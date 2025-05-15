import {
  ClassSerializerInterceptor,
  ConsoleLogger,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { AppModule } from './app.module';

const port = 3000;
const devMode = true;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
      colors: true,
    }),
  });

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

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  initSwagger(app);

  const logger = app.get(Logger);
  logger.log(`Game Shelf Organizer app listening on ${port}`);

  await app.listen(port);
}
bootstrap();

async function initSwagger(app: INestApplication) {
  const logger = app.get(Logger);

  const builder = new DocumentBuilder()
    .setTitle('Board Game API')
    .setDescription('API Docs')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const openApiDocument = SwaggerModule.createDocument(app, builder);

  SwaggerModule.setup('api', app, openApiDocument);

  const documentPath = join(process.cwd(), 'boardgame.openapi.json');
  try {
    writeFileSync(documentPath, JSON.stringify(openApiDocument, null, 2));
    logger.log(`OpenAPI doc written to: ${documentPath}`);
  } catch (error) {
    logger.error(`Error writing OpenAPI doc`, error);
  }
}
