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
import { ToggleDto } from './dto/toggle.dto';
import { PublicApiService } from './public-api.service';

@Controller('public-api')
@ApiTags('공공데이터 수집 관련')
export class PublicApiController {
  constructor(private apiService: PublicApiService) {}

  @ApiOperation({
    summary: '수집지역 확인',
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
