import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  getHello(): Date {
    const KoreaHour = Date.now() + 9 * 60 * 60 * 1000;
    return new Date(KoreaHour);
  }
}
