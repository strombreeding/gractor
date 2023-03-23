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
@ApiTags('데이터 수집지역 추가/삭제/조회')
export class LocationController {
  constructor(
    private locationService: LocationService,
    private gpsService: GpsService,
  ) {}

  @ApiOperation({
    summary: '수집중인 모든 지역 확인',
    description: '수집중인 모든지역의 지명 과 좌표 반환',
  })
  @ApiCreatedResponse({
    status: 200,
    type: Location,
  })
  @Get('/independency')
  async getIndependencyLocations() {
    const result = await this.locationService.getIndependency();
    return result;
  }
  //

  @ApiOperation({
    summary: '수집중인 모든 지역 확인',
    description: '수집중인 모든지역의 지명 과 좌표 반환',
  })
  @ApiCreatedResponse({
    status: 200,
    type: Location,
  })
  @Get('/all')
  async getAllLocations() {
    const result = await this.locationService.getAllLocations();
    return result;
  }
  //

  @ApiOperation({
    summary: '수집지역 확인',
    description:
      '수집지역에 대한 정보를 확인하세요. \n예) 서울시 관악구 추가 => 서울특별시/관악구 body에 null 정확히 입력',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '공백이 없도록 주의하세요. ',
    type: Location,
  })
  @Get()
  async getLocations(@Query() query: LocationDto) {
    const { Do, si, vilage } = query;
    const gps = await this.gpsService.getGps(Do, si, vilage);
    const arr = await this.locationService.getWorkingLocation(gps);
    const result = {
      gps: gps,
      locations: arr,
    };
    return result;
  }
  //

  @ApiOperation({
    summary: '수집지역 추가',
    description:
      '수집 지명을 정확히,공백없이 입력하세요. [도(시)]와 [구]의 좌표가 다른경우 각각 수집지역을 추가해야합니다. [구(시)]는 단독추가 할 수 있지만, [읍면동]의 경우 관할[구(시)]를 함께 입력해야합니다.',
  })
  @ApiCreatedResponse({
    status: 201,
    description: '수집할 지명의 좌표와 같은 모든 지역이 추가됩니다.',
    type: Location,
  })
  @Post()
  async insertLocation(@Body() body: LocationDto) {
    const { Do, si, vilage } = body;
    if (si || vilage) {
    }
    const gps = await this.gpsService.getGps(Do, si, vilage);
    const stringXY = [gps.nx, gps.ny];
    const result = await this.locationService.insertLocation(stringXY, gps);
    return result;
    // return 'zz';
  }
  //

  @ApiOperation({
    summary: '수집지역 제거',
    description:
      '수집지역에 대한 이름을 정확히 입력하세요. 예) 서울: 서울특별시',
  })
  @ApiCreatedResponse({
    status: 200,
    description: '공백이 없도록 주의하세요.',
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
  //
}
