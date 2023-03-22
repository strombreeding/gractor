import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { PublicApiModule } from './public-api/public-api.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SeoulModule } from './seoul/seoul.module';
import { GpsModule } from './gps/gps.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    PublicApiModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017',
    ),
    SeoulModule,
    LocationModule,
    // GpsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
