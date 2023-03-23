import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicApiModule } from './public-api/public-api.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GpsModule } from './gps/gps.module';
import { LocationModule } from './location/location.module';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './configs/winston';
// import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    PublicApiModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGODB_URL ||
        'mongodb://mongodb:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2',
    ),
    WinstonModule.forRoot(winstonLogger),
  ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes('*');
//   }
// }
export class AppModule {}
