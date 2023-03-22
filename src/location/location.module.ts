import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GpsModule } from '../gps/gps.module';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { Location, LocationSchema } from './schemas/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
    GpsModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
