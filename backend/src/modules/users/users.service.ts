import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { SignupDto } from '../auth/dto/sign-up.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(signupDto: SignupDto): Promise<User> {
     try {
      const hash = await this.hashService.hash(signupDto.password);
      const user = this.usersRepository.create({
        ...signupDto,
        password: hash,
      });

      await this.usersRepository.save(user);

      return this.findOne({ id: user.id });
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError.code === '23505'
      ) {
        throw new ConflictException(
          'Пользователь с таким email или телефоном существует',
        );
      }
      throw error;
    }
  }

  async findOne(options: FindOptionsWhere<User>): Promise<User> {
    const user = await this.usersRepository.findOne({ where: options});
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }
}
