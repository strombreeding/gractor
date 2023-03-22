import { Get, Param, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { GpsDto } from './dto/get.dto';
import { GpsService } from './gps.service';

@Controller('gps')
export class GpsController {
  constructor(private gpsService: GpsService) {}

  @Get('/insert')
  async insertData() {
    const result = await this.gpsService.insertData();
    return result;
  }

  @Get('/')
  async gps(@Query() query: GpsDto) {
    const { Do, si, vilage } = query;
    const gps = await this.gpsService.getGps(Do, si, vilage);
    return gps;
  }
}
