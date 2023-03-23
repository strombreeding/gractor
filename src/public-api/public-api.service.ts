import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { GpsService } from 'src/gps/gps.service';
import { LocationService } from 'src/location/location.service';
import * as utils from '../utils/utils';
import { SsfRepository } from './SSF.repo';
import { SslRepository } from './SSL.repo';
import { StfRepository } from './STF.repo';

@Injectable()
export class PublicApiService {
  private interval = setInterval(() => {
    this.getLocations();
  }, 300000);
  private isWorking = 1;
  private baseUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/`;
  private serviceKey = process.env.SERVICE_KEY;
  constructor(
    private gpsService: GpsService,
    private locationService: LocationService,
    private sslRepo: SslRepository,
    private ssfRepo: SsfRepository,
    private stfRepo: StfRepository,
  ) {}

  async getSslData(Do: string, si?: string, vilage?: string) {
    const { nx, ny } = await this.gpsService.getGps(Do, si, vilage);
    console.log(nx, ny);
    const now = utils.getDate();
    const ssl = await this.sslRepo.getSslDatas(nx, ny, now);
    return ssl;
  }
  async getSsfData(Do: string, si?: string, vilage?: string) {
    const { nx, ny } = await this.gpsService.getGps(Do, si, vilage);
    console.log(nx, ny);
    const now = utils.getDate();
    const ssf = await this.ssfRepo.getSsfDatas(nx, ny, now);
    return ssf;
  }
  async getStfData(Do: string, si?: string, vilage?: string) {
    const { nx, ny } = await this.gpsService.getGps(Do, si, vilage);
    console.log(nx, ny);
    const now = utils.getDate();
    const stf = await this.stfRepo.getStfDatas(nx, ny, now);
    return stf;
  }

  /**등록지역 좌표 구한후, 공공API 요청을 시작하는 함수실행 */
  async getLocations() {
    const locationArr = await (
      await this.locationService.getAllLocations()
    ).xyWorking;
    console.log('등록 지역 개수:', locationArr.length);
    try {
      this.reqAndDB(locationArr);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        '문제가 생겼습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return locationArr;
  }

  /**좌표목록 받아서 수집가능한 목록에한하여 수집 시작 */
  async reqAndDB(workingLocationArr): Promise<void> {
    // 대기 예보 시간대
    const acceptHoursOfSTF = ['02', '05', '08', '11', '14', '17', '20', '23'];

    // 현재 시간과 분을 구하는 것
    const nowMinutes = new Date().getMinutes();
    const now = utils.getDate();

    console.log(`SSL 요청 가능여부 : `, nowMinutes > 41);
    console.log(`SSF 요청 가능여부 : `, nowMinutes > 46);
    console.log(
      `STF 요청 가능여부 : `,
      nowMinutes > 11 && acceptHoursOfSTF.includes(now.nowHours),
    );

    // // SSL 요청
    if (nowMinutes > 41) {
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
    }

    // SSF 요청
    if (nowMinutes > 46) {
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
    }
    // STF 요청
    if (nowMinutes > 11 && acceptHoursOfSTF.includes(now.nowHours)) {
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
    if (!acceptFunction.includes(functionType))
      throw new HttpException('상세기능이아님', HttpStatus.BAD_REQUEST);
    const query = `${baseUrl}${functionType}?serviceKey=${serviceKey}&numOfRows=1000&pageNo=1&base_date=${nowDate}&base_time=${nowTime}&nx=${workingGPS[0]}&ny=${workingGPS[1]}&dataType=JSON`;
    const dataArr = await (
      await axios.get(query)
    ).data.response.body.items.item;
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
  }

  /** 수집 시작/중지 */
  async toggle(control: string) {
    if (control === 'start' && this.isWorking === 0) {
      console.log(control);
      this.interval = setInterval(() => this.getLocations(), 5000);
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
