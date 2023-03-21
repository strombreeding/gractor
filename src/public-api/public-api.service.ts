import { Injectable } from '@nestjs/common';

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
  console.log(`현재 날짜 : ${nowYear}년 ${nowHours}시 ${nowMinutes}분`);
  console.log(`SSL 요청 가능여부 : `, nowMinutes > 41);
  console.log(`SSF 요청 가능여부 : `, nowMinutes > 46);
  console.log(
    `STF 요청 가능여부 : `,
    nowMinutes > 11 && acceptHoursOfSTF.includes(nowHours),
  );
  console.log(process.env.SERVICE_KEY);
  // SSL 요청
  //   if(nowMinutes > 41) { //
  //   	...SSL API 요청 및 DB 저장 로직
  //   }
  //   // SSF 요청
  //   if(nowMinutes > 46) { //
  //   	...SSF API 요청 및 DB 저장 로직
  //   }
  //   // STF 요청
  //   if(nowMinutes > 11 && acceptHoursOfSTF.includes(nowHours) ) { //
  //   	...STF API 요청 및 DB 저장 로직
  //   }
};

export const reqOpenApi = () => {
  const baseUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/`;
  const serviceKey = process.env.SERVICE_KEY;
  const query = `getUltraSrtNcst?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&base_date=20230321&base_time=2200&nx=60&ny=127&dataType=JSON`;
};
// 10분에 한번씩 reqAndDB 함수 실행
// setInterval(reqAndDB, 2000);

// 이 함수로 10분간격으로 req 및 DB 저장로직을 실행
@Injectable()
export class PublicApiService {}
