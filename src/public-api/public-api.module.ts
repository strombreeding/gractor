import { Module, forwardRef } from '@nestjs/common';
import { PublicApiService } from './public-api.service';
import { PublicApiController } from './public-api.controller';
import { GpsModule } from '../gps/gps.module';
import { LocationModule } from 'src/location/location.module';
import { LocationService } from 'src/location/location.service';
import { GpsService } from 'src/gps/gps.service';
import { GpsRepository } from 'src/gps/gps.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Ssl, SslSchema } from './schemas/SSL.schema';
import { Ssf, SsfSchema } from './schemas/SSF.schema';
import { Stf, StfSchema } from './schemas/STF.schema';
import { SslRepository } from './SSL.repo';
import { SsfRepository } from './SSF.repo';
import { StfRepository } from './STF.repo';

@Module({
  imports: [
    forwardRef(() => LocationModule),
    GpsModule,
    MongooseModule.forFeature([
      { name: Ssl.name, schema: SslSchema },
      { name: Ssf.name, schema: SsfSchema },
      { name: Stf.name, schema: StfSchema },
    ]),
  ],
  providers: [PublicApiService, SslRepository, SsfRepository, StfRepository],
  controllers: [PublicApiController],
  exports: [PublicApiService, SslRepository, SsfRepository, StfRepository],
})
export class PublicApiModule {}
