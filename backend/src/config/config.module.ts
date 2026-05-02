import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ZodError } from 'zod';
import { envSchema } from './config.schema';
import { CustomConfigService } from './config.service';

function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    throw `Configuration validation failed:\n${formatZodErrors(result.error)}`;
  }

  return result.data;
}

function formatZodErrors(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.join('.');
      const field = path || 'root';
      return `  ${field}: ${issue.message}`;
    })
    .join('\n');
}

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
  ],
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class ConfigModule {}