import { Get, Inject, Param, Query } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { customError } from '../error/custom.error';
import { GpsDto } from './dto/get.dto';
import { GpsService } from './gps.service';

@Controller('gps')
@ApiTags('좌표값 구하는 곳 ')
export class GpsController {
  constructor(
    private gpsService: GpsService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private logger: Logger,
  ) {}

  @ApiOperation({
    summary:
      'DB에 모든 지역 집어넣는 것 웬만하면 요청X 구글스프레드시트에서 지역명, 좌표를 가지고 저장함. 시트 업데이트시 눌러줄것.',
    description: '리턴값없음',
  })
  @Get('/insert')
  async insertData() {
    try {
      const result = await this.gpsService.insertData();
      return result;
    } catch (err) {
      throw customError(err, this.logger);
    }
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
    try {
      const { Do, si, vilage } = query;
      const gps = await this.gpsService.getGps(Do, si, vilage);
      return gps;
    } catch (err) {
      throw customError(err, this.logger);
    }
  }
}
