import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, QueryFailedError, Repository } from 'typeorm';
import { SignupDto } from '../auth/dto/sign-up.dto';
import { HashService } from '../hash/hash.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly hashService: HashService,
	) {}

	async create(signupDto: SignupDto): Promise<User> {
		try {
			const [emailExists, phoneExists] = await Promise.all([
				this.userRepository.exists({ where: { email: signupDto.email } }),
				this.userRepository.exists({ where: { phone: signupDto.phone } }),
			]);

			const errors: Record<string, string> = {};

			if (emailExists) errors.email = 'Email уже занят';
			if (phoneExists) errors.phone = 'Телефон уже занят';

			if (Object.keys(errors).length) {
				throw new ConflictException({ message: 'Ошибка валидации', errors });
			}

			const hash = await this.hashService.hash(signupDto.password);

			const user = this.userRepository.create({
				...signupDto,
				password: hash,
			});

			await this.userRepository.save(user);

			return this.findOne({ id: user.id });
		} catch (error) {
			if (error instanceof QueryFailedError && error.driverError?.code === '23505') {
				throw new ConflictException('Пользователь уже существует');
			}

			throw error;
		}
	}

	async findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	async findOne(options: FindOptionsWhere<User>): Promise<User> {
		const user = await this.userRepository.findOne({ where: options });
		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}

		return user;
	}

	async findOneWithPassword(options: FindOptionsWhere<User>): Promise<User> {
		const user = await this.userRepository.findOne({
			where: options,
			select: ['id', 'firstName', 'lastName', 'middleName', 'email', 'phone', 'password', 'createdAt', 'updatedAt'],
		});
		if (!user) {
			throw new NotFoundException('Пользователь не найден');
		}

		return user;
	}

	async update(id: string, dto: UpdateUserDto): Promise<User> {
		const user = await this.findOne({ id });

		const errors: Record<string, string> = {};

		const [emailExists, phoneExists] = await Promise.all([
			dto.email && dto.email !== user.email
				? this.userRepository.exists({ where: { email: dto.email } })
				: Promise.resolve(false),
			dto.phone && dto.phone !== user.phone
				? this.userRepository.exists({ where: { phone: dto.phone } })
				: Promise.resolve(false),
		]);

		if (emailExists) errors.email = 'Email уже занят';
		if (phoneExists) errors.phone = 'Телефон уже занят';

		if (Object.keys(errors).length) {
			throw new ConflictException({ message: 'Ошибка валидации', errors });
		}

		await this.userRepository.update(id, dto);
		return this.findOne({ id });
	}

	async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
		const user = await this.findOneWithPassword({ id });

		const isMatch = await this.hashService.compare(dto.currentPassword, user.password);
		if (!isMatch) {
			throw new UnauthorizedException('Неверный текущий пароль');
		}

		await this.userRepository.update(id, { password: await this.hashService.hash(dto.newPassword) });
	}

	async delete(id: string): Promise<User> {
		const user = await this.findOne({ id });
		return await this.userRepository.remove(user);
	}
}
