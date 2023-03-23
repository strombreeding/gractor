import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gps, GpsDocument } from './schemas/gps.schema';
import { google } from 'googleapis';
import { GpsRepository } from './gps.repository';
import * as utils from '../utils/utils';

@Injectable()
export class GpsService {
  private googleSheet = utils.connectGoogleApi();
  constructor(private gpsRepo: GpsRepository) {}

  async insertData() {
    console.log('접근완료');
    const datas = await this.googleSheet.spreadsheets.values.get({
      spreadsheetId: '15DSBFCgs_6eULe_HagEo4ZWKUOT6INvV6KJtuTOpQfE',
      range: `1!B2:F3793`,
    });
    console.log(datas.data.values, '완료!');
    await this.gpsRepo.isertData(datas.data.values);
    return;
  }

  /**도, 시, 읍면동을 입력받으면 해당 주소의 좌표값을 반환함 */
  async getGps(Do: string, si?: string, vilage?: string) {
    if (!Do && !si && vilage)
      throw new HttpException('정확한 주소 입력바람', HttpStatus.BAD_REQUEST);
    const gps = await this.gpsRepo.getGps(Do, si, vilage);
    return gps;
  }

  /**getGps로 얻은 gps값을 입력받으면 해당 좌표로 등록된 지명을모두 반환 */
  async getLocations(gps) {
    const locations = await this.gpsRepo.gpsToLocations(gps);
    return locations;
  }
}
