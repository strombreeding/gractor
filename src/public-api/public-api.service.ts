import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { GpsService } from 'src/gps/gps.service';
import { LocationService } from 'src/location/location.service';
import * as utils from '../utils/utils';
import { SsfRepository } from './SSF.repo';
import { SslRepository } from './SSL.repo';
import { StfRepository } from './STF.repo';

// const reqAndDB = async (
//   workingLocationArr,
//   baseUrl,
//   serviceKey,
// ): Promise<void> => {
//   // 대기 예보 시간대
//   const acceptHoursOfSTF = ['02', '05', '08', '11', '14', '17', '20', '23'];

//   // 현재 시간과 분을 구하는 것
//   const nowMinutes = new Date().getMinutes();
//   const now = utils.getDate();

//   console.log(workingLocationArr);
//   console.log(`SSL 요청 가능여부 : `, nowMinutes > 41);
//   console.log(`SSF 요청 가능여부 : `, nowMinutes > 46);
//   console.log(
//     `STF 요청 가능여부 : `,
//     nowMinutes > 11 && acceptHoursOfSTF.includes(now.nowHours),
//   );

//   console.log('=======================');
//   console.log('======');
//   // SSL 요청
//   if (nowMinutes > 41) {
//     //
//     // ...SSL API 요청 및 DB 저장 로직
//     for (let i = 0; i < workingLocationArr.length; i++) {
//       reqOpenApi(
//         baseUrl,
//         'getUltraSrtNcst',
//         serviceKey,
//         workingLocationArr[i].split(','),
//         now.nowTime,
//         now.nowDate,
//       );
//     }
//   }
//   //   // SSF 요청
//   if (nowMinutes > 46) {
//     //
//     // ...SSF API 요청 및 DB 저장 로직
//     for (let i = 0; i < workingLocationArr.length; i++) {
//       reqOpenApi(
//         baseUrl,
//         'getUltraSrtFcst',
//         serviceKey,
//         workingLocationArr[i].split(','),
//         now.nowTime,
//         now.nowDate,
//       );
//     }
//   }
//   //   // STF 요청
//   if (nowMinutes > 11 && acceptHoursOfSTF.includes(now.nowHours)) {
//     //
//     // ...STF API 요청 및 DB 저장 로직
//   }
//   console.log(now.nowTime, now.nowDate);
//   for (let i = 0; i < workingLocationArr.length; i++) {
//     reqOpenApi(
//       baseUrl,
//       'getVilageFcst',
//       serviceKey,
//       workingLocationArr[i].split(','),
//       now.nowTime,
//       now.nowDate,
//     );
//   }
// };

// export const reqOpenApi = async (
//   baseUrl: string,
//   functionType: string,
//   serviceKey: string,
//   workingGPS: Array<any>,
//   nowTime: string,
//   nowDate: string,
// ) => {
//   const acceptFunction = [
//     'getUltraSrtNcst',
//     'getUltraSrtFcst',
//     'getVilageFcst',
//   ];
//   // workingGPS.join('/,');
//   console.log(workingGPS);
//   if (!acceptFunction.includes(functionType))
//     throw new HttpException('상세기능이아님', HttpStatus.BAD_REQUEST);
//   const query = `${baseUrl}${functionType}?serviceKey=${serviceKey}&numOfRows=1000&pageNo=1&base_date=${nowDate}&base_time=${nowTime}&nx=${workingGPS[0]}&ny=${workingGPS[1]}&dataType=JSON`;
//   const data = await (await axios.get(query)).data.response;
//   console.log(data);
// };
@Injectable()
export class PublicApiService {
  private interval = this.getLocations();
  // private interval = setInterval(() => this.getLocations(), 10000);
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

  async getLocations() {
    const locationArr = await (
      await this.locationService.getAllLocations()
    ).xyWorking;
    console.log(locationArr);
    this.reqAndDB(locationArr);
    return locationArr;
  }
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
    // if (nowMinutes > 41) {
    //   //
    //   // ...SSL API 요청 및 DB 저장 로직
    //   for (let i = 0; i < workingLocationArr.length; i++) {
    //     await this.reqOpenApi(
    //       this.baseUrl,
    //       'getUltraSrtNcst',
    //       this.serviceKey,
    //       workingLocationArr[i].split(','),
    //       now.nowTime,
    //       now.nowDate,
    //     );
    //   }
    // }
    // //   // SSF 요청
    // if (nowMinutes > 46) {
    //   //
    //   for (let i = 0; i < workingLocationArr.length; i++) {
    //     await this.reqOpenApi(
    //       this.baseUrl,
    //       'getUltraSrtFcst',
    //       this.serviceKey,
    //       workingLocationArr[i].split(','),
    //       now.nowTime,
    //       now.nowDate,
    //     );
    //   }
    //   // ...SSF API 요청 및 DB 저장 로직
    // }
    //   // STF 요청
    if (nowMinutes > 11 && acceptHoursOfSTF.includes(now.nowHours)) {
      //
      // ...STF API 요청 및 DB 저장 로직
    }
    console.log(now.nowTime, now.nowDate);
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
    console.log(query);
    const dataArr = await (
      await axios.get(query)
    ).data.response.body.items.item;
    console.log(dataArr.length, '데이터 길이');
    switch (functionType) {
      case acceptFunction[0]:
        await this.sslRepo.create(dataArr);
        break;
      case acceptFunction[1]:
        await this.ssfRepo.create(dataArr);
        break;
      case acceptFunction[2]:
        await this.stfRepo.create(dataArr);
        break;
    }
    console.log(dataArr.length, ' stf데이터의 길이');

    console.log('작업끝');
  }

  async toggle(control: string) {
    const zz = await this.locationService.getAllLocations();
    console.log(zz);
    // const locationArr = (await this.locationService.getAllLocations())
    //   .xyWorking;
    // reqAndDB(locationArr, this.baseUrl, this.serviceKey);

    // if (control === 'start' && this.isWorking === 0) {
    //   console.log(control);
    //   this.interval = setInterval(this.getLocations, 1000);
    //   this.isWorking = 1;
    //   return '수집 시작';
    // } else if (control === 'end' && this.isWorking === 1) {
    //   console.log(control);
    //   clearInterval(this.interval);
    //   this.isWorking = 0;
    //   return '수집 종료';
    // }
  }
}
