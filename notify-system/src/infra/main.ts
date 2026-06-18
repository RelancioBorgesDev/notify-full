import { NestFactory } from '@nestjs/core';
import { EnvService } from './env/env.service';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  const configService = app.get(EnvService);

  const config = new DocumentBuilder()
    .setTitle('Notify System Docs')
    .setDescription('The Notify System API documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  app.use(
    '/docs',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'moon',
    }),
  );

  const port = configService.get('PORT');
  await app.listen(port);
}

bootstrap();
