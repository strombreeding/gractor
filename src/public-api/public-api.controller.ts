import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { PublicApiService } from './public-api.service';

@Controller('public-api')
export class PublicApiController {
  constructor(private apiService: PublicApiService) {}

  @Get('/interval/:control/:accessCode')
  async startIntervalRequest(
    @Param('accessCode') accessCode: string,
    @Param('control') control: string,
  ) {
    // 여러 클러스터가 동작할 경우에는 이 라우터는 한개의 클러스터에서만 실행 되어야함

    try {
      if (accessCode !== '123123') throw new Error();
      const zz = await this.apiService.zz(control);
      return 'z';
    } catch (err) {
      throw new HttpException('ㅗ', HttpStatus.BAD_REQUEST);
    }
    // return zz;
  }

  //   @Get('/end')
  //   async endIntervalRequest() {
  //     try{

  //     }catch(err)
  //     const zz = await this.apiService.zz();
  //     return zz;
  //   }
}
