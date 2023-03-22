import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicApiModule } from './public-api/public-api.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GpsModule } from './gps/gps.module';
import { LocationModule } from './location/location.module';
import { SslModule } from './ssl/ssl.module';
import { SsfModule } from './ssf/ssf.module';

@Module({
  imports: [
    PublicApiModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017',
    ),
    SslModule,
    SsfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
