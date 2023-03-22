import { Module } from '@nestjs/common';
import { PublicApiService } from './public-api.service';
import { PublicApiController } from './public-api.controller';
import { GpsService } from '../gps/gps.service';
import { GpsRepository } from '../gps/gps.repository';
import { GpsModule } from '../gps/gps.module';

@Module({
  imports: [GpsModule],
  providers: [PublicApiService],
  controllers: [PublicApiController],
})
export class PublicApiModule {}
