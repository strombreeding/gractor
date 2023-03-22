import { INestApplication } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';

export const setupSwagger = (app: INestApplication): void => {
  const configSwagger = new DocumentBuilder()
    .setTitle('API 명세서')
    .setDescription('대기예보 API명세서')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('/document', app, document);
};
