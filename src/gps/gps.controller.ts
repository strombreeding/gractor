import { Get, Param, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
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
  async zz(
    @Query('do') Do: string,
    @Query('si') si: string,
    @Query('vilage') vilage: string,
  ) {
    console.log(Do, si, vilage);
    const aa = await this.gpsService.getGps(Do, si, vilage);
    return aa;
  }
}
