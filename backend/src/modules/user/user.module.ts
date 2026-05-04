import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../../shared/guards/jwt.guard';
import { HashModule } from '../hash/hash.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [TypeOrmModule.forFeature([User]), HashModule],
	controllers: [UserController],
	providers: [UserService, JwtAuthGuard],
	exports: [UserService],
})
export class UserModule {}
