import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicApiModule } from './public-api/public-api.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GpsModule } from './gps/gps.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    PublicApiModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      'mongodb://mongodb:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
