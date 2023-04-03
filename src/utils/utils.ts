import { google } from 'googleapis';
import { client_email, private_key } from '../eum-366115-61fa453cf283.json';

/**api데이터 요청후 category와 obsrValue를 넣으면 단위를 추가해줌 */
export const addSignGender = (category: string, obsrValue: string) => {
  let ptyValue = '';
  let skyValue = '';

  switch (category) {
    case 'POP':
      category = `${obsrValue} %`;
      break;
    case 'PTY':
      if (obsrValue === '0') ptyValue = '없음';
      if (obsrValue === '1') ptyValue = '비';
      if (obsrValue === '2') ptyValue = '비/눈';
      if (obsrValue === '3') ptyValue = '눈';
      if (obsrValue === '4') ptyValue = '소나기';
      if (obsrValue === '5') ptyValue = '빗방울';
      if (obsrValue === '6') ptyValue = '빗방울눈날림';
      if (obsrValue === '7') ptyValue = '눈날림';
      category = ptyValue;
      break;
    case 'PCP':
      category = `${obsrValue} mm `;
      if (obsrValue === '강수없음') category = `${obsrValue} `;
      break;
    case 'REH':
      category = `${obsrValue} %`;
      break;
    case 'SNO':
      category = `${obsrValue} cm`;
      if (obsrValue === '적설없음') category = obsrValue;
      break;
    case 'SKY':
      if (obsrValue === '1') skyValue = '맑음';
      if (obsrValue === '3') skyValue = '구름많음';
      if (obsrValue === '4') skyValue = '흐림';
      category = skyValue;
      break;
    case 'TMP':
      category = `${obsrValue} ℃`;
      break;
    case 'TMN':
      category = `${obsrValue} ℃`;
      break;
    case 'TMX':
      category = `${obsrValue} ℃`;
      break;
    case 'UUU':
      category = `${obsrValue} m/s`;
      break;
    case 'VVV':
      category = `${obsrValue} m/s`;
      break;
    case 'WAV':
      category = `${obsrValue} M`;
      break;
    case 'VEC':
      category = `${obsrValue} ° (deg)`;
      break;
    case 'WSD':
      category = `${obsrValue} m/s`;
      break;
    case 'T1H':
      category = `${obsrValue} ℃`;
      break;
    case 'RN1':
      category = `${obsrValue} mm`;
      break;
    case 'LGT':
      category = `${obsrValue} kA (킬로암페어)`;
      break;
  }
  return category;
};

export const keyCreater = (data, category, value) => {
  switch (category) {
    case 'POP':
      data.precipitationPercent = value;
      break;
    case 'PTY':
      data.precipitationPattern = value;
      break;
    case 'PCP':
      data.precipitation = value;
      break;
    case 'REH':
      data.humidity = value;
      break;
    case 'SNO':
      data.snow = value;
      break;
    case 'SKY':
      data.skyStatus = value;
      break;
    case 'TMP':
      data.temperatureForHour = value;
      break;
    case 'TMN':
      data.lowTemp = value;
      break;
    case 'TMX':
      data.heightTemp = value;
      break;
    case 'UUU':
      data.EW_windInfo = value;
      break;
    case 'VVV':
      data.SN_windInfo = value;
      break;
    case 'WAV':
      data.seaWave = value;
      break;
    case 'VEC':
      data.windDirection = value;
      break;
    case 'WSD':
      data.windSpeed = value;
      break;
    case 'T1H':
      data.temperature = value;
      break;
    case 'RN1':
      data.precipitation = value;
      break;
    case 'LGT':
      data.thunderstroke = value;
      break;
  }
  return data;
};
/**구글 시트 연결 */
export const connectGoogleApi = () => {
  const authorize = new google.auth.JWT(client_email, null, private_key, [
    'https://www.googleapis.com/auth/spreadsheets',
  ]);
  // google spread sheet api 가져오기
  const googleSheet = google.sheets({
    version: 'v4',
    auth: authorize,
  });
  return googleSheet;
};
//
export const getDate = () => {
  const KoreaHour = Date.now() + 9 * 60 * 60 * 1000;
  const nowYear = `${new Date(KoreaHour).getFullYear()}`;
  // 테스트 하고 싶다면 아래 시간대 변경후 public-api service 에서 min을 45 이상으로 변경
  // const mockHours = 0;
  const mockHours = new Date(KoreaHour).getHours();
  const mockMonth = new Date(KoreaHour).getMonth() + 1;
  const mockDate = new Date(KoreaHour).getDate();
  let nowMonth = '';
  let nowHours = '';
  let nowDate = '';
  if (mockHours < 10) {
    nowHours = `0${mockHours}`;
  } else {
    nowHours = `${mockHours}`;
  }
  if (mockMonth < 10) {
    nowMonth = `0${mockMonth}`;
  } else {
    nowMonth = `${mockMonth}`;
  }
  if (mockDate < 10) {
    nowDate = `0${mockDate}`;
  } else {
    nowDate = `${mockDate}`;
  }

  const result = {
    nowDate: `${nowYear}${nowMonth}${nowDate}`,
    nowTime: nowHours + '00',
    nowHours,
  };
  return result;
};
