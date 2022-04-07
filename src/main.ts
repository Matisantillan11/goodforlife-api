import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(Config.enviroment.port, () => {
    console.log(`Server running on port: ${Config.enviroment.port}`);
  });
}

bootstrap();
