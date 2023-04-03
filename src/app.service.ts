import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello(): string {
    const KoreaHour = Date.now() + 9 * 60 * 60 * 1000;
    return `현재 날짜는 ${new Date(KoreaHour)} 입니다.`;
  }
}
