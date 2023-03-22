import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GpsService } from 'src/gps/gps.service';
import { LocationDto } from './dto/insert.dto';
import { LocationService } from './location.service';
import { Location } from './schemas/location.schema';

@Controller('location')
@ApiTags('데이터 수집지역 관련 CRUD')
export class LocationController {
  constructor(
    private locationService: LocationService,
    private gpsService: GpsService,
  ) {}

  @ApiOperation({
    summary: '수집지역 확인',
    description:
      '수집지역에 대한 정보를 확인하세요. \n예) 서울시 관악구 추가 => 서울특별시/관악구 body에 null 정확히 입력',
  })
  @ApiCreatedResponse({
    status: 201,
    description: "xyWorking 배열값을 ','로 스플릿 하여 사용하면 됩니다. ",
    type: Location,
  })
  @Get()
  async getLocations(@Query() query: LocationDto) {
    const { Do, si, vilage } = query;
    const gps = await this.gpsService.getGps(Do, si, vilage);
    const a = await this.locationService.getWorkingLocation(gps);
    console.log(gps);
    return a;
  }
  @ApiOperation({
    summary: '수집지역 추가',
    description:
      '수집지역에 대한 정보를 확인하세요. \n예) 서울시 관악구 추가 => 서울특별시/관악구 body에 null 정확히 입력',
  })
  @ApiCreatedResponse({
    status: 201,
    description: "xyWorking 배열값을 ','로 스플릿 하여 사용하면 됩니다. ",
    type: Location,
  })
  @Post()
  async insertLocation(@Body() body: LocationDto) {
    const { Do, si, vilage } = body;
    const gps = await this.gpsService.getGps(Do, si, vilage);
    const stringXY = [gps.nx, gps.ny];
    console.log(stringXY);
    const result = await this.locationService.insertLocation(stringXY, gps);
    return result;
    // return 'zz';
  }
  @ApiOperation({
    summary: '수집지역 제거',
    description:
      '수집지역에 대한 이름을 정확히 입력하세요. 예) 서울: 서울특별시',
  })
  @ApiCreatedResponse({
    status: 200,
    type: Location,
  })
  @Delete()
  async deleteLocation(@Body() body: LocationDto) {
    const { Do, si, vilage } = body;
    const gps = await this.gpsService.getGps(Do, si, vilage);
    const stringXY = [gps.nx, gps.ny];
    const result = await this.locationService.deleteLocation(stringXY, gps);
    return result;
  }
}
