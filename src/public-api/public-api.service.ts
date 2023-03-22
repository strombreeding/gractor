import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { GpsService } from 'src/gps/gps.service';

const reqAndDB = async (): Promise<void> => {
  // 대기 예보 시간대
  const acceptHoursOfSTF = ['02', '05', '08', '11', '14', '17', '20', '23'];

  // 현재 시간과 분을 구하는 것
  const nowYear = new Date().getFullYear();
  const nowMinutes = new Date().getMinutes();
  const mockHours = new Date().getHours();
  let nowHours = '';
  if (mockHours < 10) {
    nowHours = `0${mockHours}`;
  } else {
    nowHours = `${mockHours}`;
  }
  const workingLocationArr = [];
  // console.log(`현재 날짜 : ${nowYear}년 ${nowHours}시 ${nowMinutes}분`);
  // console.log(`SSL 요청 가능여부 : `, nowMinutes > 41);
  // console.log(`SSF 요청 가능여부 : `, nowMinutes > 46);
  // console.log(
  //   `STF 요청 가능여부 : `,
  //   nowMinutes > 11 && acceptHoursOfSTF.includes(nowHours),
  // );

  // const req = await axios.get(
  //   `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=%2BWn4cikPuEoxm%2F%2FR%2FlGw3rvVogpzoRQeaGN3R5PSRMPSlFtzclxlYLGSN31wCfFIEs43g9tpz%2BSwUT3a8LftFw%3D%3D&numOfRows=10&pageNo=1&base_date=20230322&base_time=0500&nx=55&ny=127&dataType=JSON`,
  // );
  console.log('=======================');
  // console.log(req.data.response.body);
  console.log('======');
  // SSL 요청
  if (nowMinutes > 41) {
    //
    // ...SSL API 요청 및 DB 저장 로직
  }
  //   // SSF 요청
  if (nowMinutes > 46) {
    //
    // ...SSF API 요청 및 DB 저장 로직
  }
  //   // STF 요청
  if (nowMinutes > 11 && acceptHoursOfSTF.includes(nowHours)) {
    //
    // ...STF API 요청 및 DB 저장 로직
    const req = await axios.get(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=%2BWn4cikPuEoxm%2F%2FR%2FlGw3rvVogpzoRQeaGN3R5PSRMPSlFtzclxlYLGSN31wCfFIEs43g9tpz%2BSwUT3a8LftFw%3D%3D&numOfRows=10&pageNo=1&base_date=20230322&base_time=0500&nx=55&ny=127&dataType=JSON`,
    );
  }
};
export const reqOpenApi = (
  baseUrl: string,
  functionType: string,
  serviceKey: string,
  locationArr: Array<any>,
  nowTime: string,
  nowDate: string,
) => {
  const acceptFunction = [
    'getUltraSrtNcst',
    'getUltraSrtFcst',
    'getVilageFcst',
  ];
  if (!acceptFunction.includes(functionType))
    throw new HttpException('상세기능이아님', HttpStatus.BAD_REQUEST);
  const query = `${baseUrl}${functionType}?serviceKey=${serviceKey}&numOfRows=1000&pageNo=1&base_date=${nowDate}&base_time=${nowTime}&nx=60&ny=127&dataType=JSON`;
};

// 이 함수로 10분간격으로 req 및 DB 저장로직을 실행
@Injectable()
export class PublicApiService {
  // private interval = setInterval(this.gg, 1000);
  private isWorking = 1;
  private baseUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/`;
  private serviceKey = process.env.SERVICE_KEY;
  constructor(private gpsService: GpsService) {}
  async test() {
    const a = await this.gpsService.getGps('서울특별시', '관악구');
  }
  async zz(control: string) {
    // if (control === 'start' && this.isWorking === 0) {
    //   console.log(control);
    //   this.interval = setInterval(reqAndDB, 1000);
    //   this.isWorking = 1;
    // } else if (control === 'end' && this.isWorking === 1) {
    //   console.log(control);
    //   clearInterval(this.interval);
    //   this.isWorking = 0;
    // }
    return '시작됨';
  }
  async gg() {
    console.log('케루케루');
  }
}
