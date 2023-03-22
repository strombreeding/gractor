import { Get, Param, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { GpsDto } from './dto/get.dto';
import { GpsService } from './gps.service';

@Controller('gps')
export class GpsController {
  constructor(private gpsService: GpsService) {}

  @Get('/insert')
  async getData() {
    const result = await this.gpsService.getData();
    return result;
  }

  @Get('/')
  async zz(@Query() query: GpsDto) {
    const { Do, si, vilage } = query;
    const aa = await this.gpsService.getGps(Do, si, vilage);
    return aa;
  }
}
