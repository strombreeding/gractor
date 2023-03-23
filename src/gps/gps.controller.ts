import { Get, Param, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GpsDto } from './dto/get.dto';
import { GpsService } from './gps.service';

@Controller('gps')
@ApiTags('좌표값 구하는 곳 ')
export class GpsController {
  constructor(private gpsService: GpsService) {}

  @Get('/insert')
  async insertData() {
    const result = await this.gpsService.insertData();
    return result;
  }

  @ApiOperation({
    summary: '지역입력시 좌표값 반환',
    description: '조건으로 검색하여 좌표값 반환',
  })
  @ApiCreatedResponse({
    status: 200,
  })
  @Get('/')
  async gps(@Query() query: GpsDto) {
    const { Do, si, vilage } = query;
    const gps = await this.gpsService.getGps(Do, si, vilage);
    return gps;
  }
}
