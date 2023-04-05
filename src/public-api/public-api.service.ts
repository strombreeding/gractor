import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import axios from 'axios';
import { CustomError } from 'src/error/custom.error';
import { GpsService } from 'src/gps/gps.service';
import { LocationService } from 'src/location/location.service';
import * as utils from '../utils/utils';
import { SsfRepository } from './SSF.repo';
import { SslRepository } from './SSL.repo';
import { StfRepository } from './STF.repo';

const worked = {
  date: utils.getDate().nowDate + utils.getDate().nowHours,
  ssl: false,
  ssf: false,
  stf: false,
};
@Injectable()
export class PublicApiService {
  private interval = setInterval(() => {
    this.reqAndDB();
  }, 300000);

  private isWorking = 1;
  private baseUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/`;
  private serviceKey = process.env.SERVICE_KEY;
  constructor(
    private gpsService: GpsService,
    @Inject(forwardRef(() => LocationService))
    private locationService: LocationService,
    private sslRepo: SslRepository,
    private ssfRepo: SsfRepository,
    private stfRepo: StfRepository,
  ) {}

  async getSslData(Do: string, si?: string, vilage?: string) {
    try {
      const { nx, ny } = await this.gpsService.getGps(Do, si, vilage);
      console.log(nx, ny);
      const now = utils.getDate();
      const ssl = await this.sslRepo.getSslDatas(nx, ny, now);
      return ssl;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async getSsfData(Do: string, si?: string, vilage?: string) {
    try {
      const { nx, ny } = await this.gpsService.getGps(Do, si, vilage);
      console.log(nx, ny);
      const now = utils.getDate();
      const ssf = await this.ssfRepo.getSsfDatas(nx, ny, now);
      return ssf;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async getStfData(Do: string, si?: string, vilage?: string) {
    try {
      const { nx, ny } = await this.gpsService.getGps(Do, si, vilage);
      console.log(nx, ny);
      const now = utils.getDate();
      const stf = await this.stfRepo.getStfDatas(nx, ny, now);
      return stf;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**좌표목록 받아서 수집가능한 목록에한하여 수집 시작 */
  async reqAndDB(): Promise<void> {
    try {
      console.log('현재 작업상태', worked);

      const workingLocationArr = (await this.locationService.getAllLocations())
        .xyWorking;
      // 대기 예보 시간대
      const acceptHoursOfSTF = ['02', '05', '08', '11', '14', '17', '20', '23'];

      // 현재 시간과 분을 구하는 것
      const KoreaHour = Date.now() + 9 * 60 * 60 * 1000;
      const nowMinutes = new Date(KoreaHour).getMinutes();
      const now = utils.getDate();
      if (worked.stf === true && worked.date !== now.nowDate + now.nowHours)
        worked.stf = false;

      console.log('현재 시간 : ', now.nowDate, now.nowHours);
      console.log(`SSL 요청 가능여부 : `, nowMinutes > 41);
      console.log(`SSF 요청 가능여부 : `, nowMinutes > 46);
      console.log(
        `STF 요청 가능여부 : `,
        nowMinutes > 11 && acceptHoursOfSTF.includes(now.nowHours),
      );
      if (nowMinutes > 41 && worked.ssl === false) {
        for (let i = 0; i < workingLocationArr.length; i++) {
          await this.reqOpenApi(
            this.baseUrl,
            'getUltraSrtNcst',
            this.serviceKey,
            workingLocationArr[i].split(','),
            now.nowTime,
            now.nowDate,
          );
        }
        worked.date = now.nowDate + now.nowHours;
        worked.ssl = true;
      }

      // SSF 요청
      if (nowMinutes > 46 && worked.ssf === false) {
        for (let i = 0; i < workingLocationArr.length; i++) {
          await this.reqOpenApi(
            this.baseUrl,
            'getUltraSrtFcst',
            this.serviceKey,
            workingLocationArr[i].split(','),
            now.nowTime,
            now.nowDate,
          );
        }
        worked.date = now.nowDate + now.nowHours;
        worked.ssf = true;
      }
      // STF 요청
      if (
        nowMinutes > 11 &&
        acceptHoursOfSTF.includes(now.nowHours) &&
        worked.stf === false
      ) {
        for (let i = 0; i < workingLocationArr.length; i++) {
          await this.reqOpenApi(
            this.baseUrl,
            'getVilageFcst',
            this.serviceKey,
            workingLocationArr[i].split(','),
            now.nowTime,
            now.nowDate,
          );
        }
        worked.stf = true;
        worked.date = now.nowDate + now.nowHours;
      }
      // SSL, SSF 요청 완료시 초기화
      if (
        worked.ssf === true &&
        worked.ssl === true &&
        worked.date !== now.nowDate + now.nowHours
      ) {
        worked.ssf = false;
        worked.ssl = false;
      }
    } catch (err) {
      console.log(`ERROR : ${err.message}`);
    }
  }

  /**reqAndDB 가 부르는 함수 DB에 저장하는 역할 */
  async reqOpenApi(
    baseUrl: string,
    functionType: string,
    serviceKey: string,
    workingGPS: Array<any>,
    nowTime: string,
    nowDate: string,
  ) {
    const acceptFunction = [
      'getUltraSrtNcst',
      'getUltraSrtFcst',
      'getVilageFcst',
    ];
    // workingGPS.join('/,');
    console.log('펑션타입 : ', functionType);
    console.log('현재 시각 : ', nowTime);
    if (!acceptFunction.includes(functionType))
      throw new HttpException('상세기능이아님', HttpStatus.BAD_REQUEST);
    const query = `${baseUrl}${functionType}?serviceKey=${serviceKey}&numOfRows=1000&pageNo=1&base_date=${nowDate}&base_time=${nowTime}&nx=${workingGPS[0]}&ny=${workingGPS[1]}&dataType=JSON`;
    try {
      const openData = await axios.get(query);
      const isSuccess = openData.data.response.header.resultCode === '00';
      if (!isSuccess) {
        throw new CustomError(`데이터 수집 실패:${query}`, 500);
      }
      const dataArr = openData.data.response.body.items.item;
      switch (functionType) {
        case acceptFunction[0]:
          await this.sslRepo.create(dataArr, workingGPS);
          break;
        case acceptFunction[1]:
          await this.ssfRepo.create(dataArr, workingGPS);
          break;
        case acceptFunction[2]:
          await this.stfRepo.create(dataArr, workingGPS);
          break;
      }
      console.log('작업끝');
    } catch (err) {
      if (!err.options === false) {
        throw new CustomError(err.message, err.status);
      }
      throw new Error();
    }
  }

  /** 수집 시작/중지 */
  async toggle(control: string) {
    if (control === 'start' && this.isWorking === 0) {
      console.log(control);
      this.interval = setInterval(() => this.reqAndDB(), 300000);
      this.isWorking = 1;
      return '수집 시작';
    } else if (control === 'end' && this.isWorking === 1) {
      console.log(control);
      clearInterval(this.interval);
      this.isWorking = 0;
      return '수집 종료';
    }
  }
}
