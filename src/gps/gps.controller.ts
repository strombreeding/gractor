import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { GpsService } from './gps.service';

@Controller('gps')
export class GpsController {
  constructor(private gpsService: GpsService) {}

  @Get()
  async getData() {
    const result = await this.gpsService.getData();
    return result;
  }
}
