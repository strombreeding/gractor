import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GpsRepository } from './gps.repository';
import { GpsService } from './gps.service';
import { Gps, GpsSchema } from './schemas/gps.schema';
import { GpsController } from './gps.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Gps.name, schema: GpsSchema }])],
  providers: [GpsService, GpsRepository],
  controllers: [GpsController],
  exports: [GpsService, GpsRepository],
})
export class GpsModule {}
