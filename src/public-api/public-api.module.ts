import { Module } from '@nestjs/common';
import { PublicApiService } from './public-api.service';

@Module({
  providers: [PublicApiService]
})
export class PublicApiModule {}
