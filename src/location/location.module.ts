import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GpsModule } from '../gps/gps.module';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { Location, LocationSchema } from './schemas/location.schema';
import { PublicApiModule } from 'src/public-api/public-api.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
    GpsModule,
    forwardRef(() => PublicApiModule),
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
