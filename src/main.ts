import { NestFactory } from '@nestjs/core';
// import { setInterval } from 'timers/promises';
import { AppModule } from './app.module';
import axios from 'axios';
import { setupSwagger } from './configs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);
  await app.listen(3000);
}
bootstrap();
