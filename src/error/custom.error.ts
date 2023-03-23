import { HttpException, HttpStatus } from '@nestjs/common';
import * as utils from '../utils/utils';

export class CustomError {
  constructor(messages: string, code: number) {
    switch (code) {
      case 400:
        throw new HttpException(messages, HttpStatus.BAD_REQUEST, {
          description: '400',
        });
      case 403:
        throw new HttpException(messages, HttpStatus.FORBIDDEN, {
          description: '403',
        });
      case 404:
        throw new HttpException(messages, HttpStatus.NOT_FOUND, {
          description: '404',
        });
      case 502:
        throw new HttpException(messages, HttpStatus.BAD_GATEWAY, {
          description: '502',
        });
      default:
        throw new HttpException(messages, HttpStatus.INTERNAL_SERVER_ERROR, {
          description: '500',
        });
    }
  }
}

export const customError = (err: any, logger: any) => {
  const nowDate = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const year = nowDate.getFullYear();
  const month = nowDate.getMonth() + 1;
  const date = nowDate.getDate();
  const fullDate = `${year}-${month >= 10 ? month : '0' + month}-${
    date >= 10 ? date : '0' + date
  }`;
  if (!err.options === false) {
    //옵션이 있는, 예측 가능한 예외
    if (err.options.description !== '500') {
      // 로그처리 X
      throw new HttpException(err.message, err.status);
    }
    throw new HttpException('일시적 오류', HttpStatus.INTERNAL_SERVER_ERROR);
  } else {
    // 윈스턴 로그파일 작성
    logger.error(err.message, { path: __filename }, fullDate);

    // 이후 메일이나, 스프레드시트, slack 알림 등을 추가해도 될듯
    throw new HttpException(
      '일시적 서버 오류',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};
