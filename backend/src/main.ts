import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { CustomConfigService } from './config/config.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = app.get(CustomConfigService);
	app.use(cookieParser());
	app.enableCors({
		origin: config.frontendUrl,
		credentials: true,
	});
	app.useGlobalPipes(
		new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }),
	);
	await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
