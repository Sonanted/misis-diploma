import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/entities/user.entity';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [User],
      synchronize: true, // set to false in production and use migrations
    }),

    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
