import { google } from 'googleapis';
import { client_email, private_key } from '../eum-366115-61fa453cf283.json';

/**api데이터 요청후 category와 obsrValue를 넣으면 단위를 추가해줌 */
export const stfGender = (category: string, obsrValue: string) => {
  switch (category) {
    case 'POP':
      category = `${obsrValue}%`;
      break;
    case 'PTY':
      let ptyValue = '';
      if (obsrValue === '0') ptyValue = '없음';
      if (obsrValue === '1') ptyValue = '비';
      if (obsrValue === '2') ptyValue = '비/눈';
      if (obsrValue === '3') ptyValue = '눈';
      if (obsrValue === '4') ptyValue = '소나기';
      category = ptyValue;
      break;
    case 'PCP':
      if (obsrValue) category = `${obsrValue}%`;
      break;
    case 'REH':
      category = `${obsrValue}%`;
      break;
    case 'SNO':
      category = `${obsrValue}%`;

      break;
    case 'SKY':
      break;
    case 'TMP':
      break;
    case 'TMN':
      break;
    case 'TMX':
      break;
    case 'UUU':
      break;
    case 'VVV':
      break;
    case 'WAV':
      break;
    case 'VEC':
      break;
    case 'WSD':
      break;
  }
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
