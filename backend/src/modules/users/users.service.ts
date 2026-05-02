import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import { SignupDto } from '../auth/dto/sign-up.dto';
import { HashService } from '../hash/hash.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		private readonly hashService: HashService,
	) {}

	async create(signupDto: SignupDto): Promise<User> {
		try {
			const [emailExists, phoneExists] = await Promise.all([
				this.usersRepository.exists({ where: { email: signupDto.email } }),
				this.usersRepository.exists({ where: { phone: signupDto.phone } }),
			]);

			const errors: Record<string, string> = {};

			if (emailExists) errors.email = 'Email уже занят';
			if (phoneExists) errors.phone = 'Телефон уже занят';

			if (Object.keys(errors).length) {
				throw new ConflictException({ message: 'Ошибка валидации', errors });
			}

			const hash = await this.hashService.hash(signupDto.password);

			const user = this.usersRepository.create({
				...signupDto,
				password: hash,
			});

			await this.usersRepository.save(user);

			return this.findOne({ id: user.id });
		} catch (error) {
			if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
				throw new ConflictException('Пользователь уже существует');
			}

			throw error;
		}
	}

	async findAll(): Promise<User[]> {
		return this.usersRepository.find();
	}

	async findOne(options: FindOptionsWhere<User>): Promise<User> {
		const user = await this.usersRepository.findOne({ where: options });
		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}

		return user;
	}

	async delete(id: string): Promise<User> {
		const user = await this.findOne({ id });
		return await this.usersRepository.remove(user);
	}
}
