import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SslDto } from './dto/getSsl.dto';
import { ToggleDto } from './dto/toggle.dto';
import { PublicApiService } from './public-api.service';
import { Ssl } from './schemas/SSL.schema';
import * as utils from '../utils/utils';

@Controller('public-api')
@ApiTags('공공데이터 수집정지/가동 및 데이터 열람')
export class PublicApiController {
  constructor(private apiService: PublicApiService) {}
  @ApiOperation({
    summary: '초단기 실황 조회 ',
    description: '현재 시간기준으로 데이터를 가져옵니다. ',
  })
  @ApiCreatedResponse({
    status: 200,
    type: Ssl,
  })
  @Get('/ssl')
  async getSSL(@Query() query: SslDto) {
    const { Do, si, vilage } = query;
    const result = await this.apiService.getSslData(Do, si, vilage);
    return result;
  }
  @ApiOperation({
    summary: '초단기 예보 조회 ',
    description: '현재 시간기준으로 6시간 이후까지의 데이터를 가져옵니다. ',
  })
  @ApiCreatedResponse({
    status: 200,
    type: Ssl,
  })
  @Get('/ssf')
  async getSSF(@Query() query: SslDto) {
    const { Do, si, vilage } = query;
    const result = await this.apiService.getSslData(Do, si, vilage);
    return result;
  }
  @ApiOperation({
    summary: '단기 예보 조회 ',
    description: '현재 시간기준으로 최대 3일 이후까지의 데이터를 가져옵니다. ',
  })
  @ApiCreatedResponse({
    status: 200,
    type: Ssl,
  })
  @Get('/stf')
  async getSTF(@Query() query: SslDto) {
    const { Do, si, vilage } = query;
    const result = await this.apiService.getSslData(Do, si, vilage);
    return result;
  }
  //
  @ApiOperation({
    summary: '수집시작/ 종료 제어',
    description: 'start 또는 end로 수집을 시작/종료 하세요. ',
  })
  @ApiCreatedResponse({
    status: 200,
    type: '작동 | 중지 완료',
  })
  @Patch('/interval')
  async startIntervalRequest(@Body() body: ToggleDto) {
    // 여러 클러스터가 동작할 경우에는 이 라우터는 한개의 클러스터에서만 실행 되어야함
    const { control, accessCode } = body;
    try {
      if (accessCode !== '123123') throw new Error();
      const result = await this.apiService.toggle(control);
      return result;
    } catch (err) {
      throw new HttpException('ㅗ', HttpStatus.BAD_REQUEST);
    }
    // return zz;
  }
}
