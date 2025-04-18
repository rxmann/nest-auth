import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT', 3001);

  app.useGlobalPipes(new ValidationPipe({}));

  const logger = new Logger('Bootstrap');

  try {
    await app.listen(PORT);
    logger.log(`🚀 App is running on http://localhost:${PORT}`);
  } catch (error) {
    logger.error('❌ Error starting the application', error);
    process.exit(1);
  }
}
bootstrap();
