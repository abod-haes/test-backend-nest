import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Furniture Store API')
    .setDescription(
      'Training API for Products, Categories, Cart, Authentication and Roles.',
    )
    .setVersion('2.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

  SwaggerModule.setup(
    'api/docs',
    app,
    document,
  );

  const port = Number(
    process.env.PORT || 3000,
  );

  await app.listen(
    port,
    '0.0.0.0',
  );

  console.log(
    `API listening on 0.0.0.0:${port}`,
  );
}

bootstrap().catch((error) => {
  console.error(
    'BOOTSTRAP_ERROR',
    error,
  );

  process.exit(1);
});
