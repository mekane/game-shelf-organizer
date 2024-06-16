import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = 3000;
const devMode = true;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true, // strip properties with no validation decorators in DTO
      disableErrorMessages: false,
      enableDebugMessages: devMode,
      validationError: {
        value: false, // don't expose the values
      },
    }),
  );

  console.log(`Game Shelf Organizer app listening on ${port}`);
  await app.listen(port);
}
bootstrap();
