import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gps, GpsDocument } from './schemas/gps.schema';
import { google } from 'googleapis';
import { GpsRepository } from './gps.repository';
import * as utils from '../utils/utils';
import { CustomError } from 'src/error/custom.error';

@Injectable()
export class GpsService {
  private googleSheet = utils.connectGoogleApi();
  constructor(private gpsRepo: GpsRepository) {}

  async insertData() {
    console.log('지역 정보 업데이트');
    try {
      const datas = await this.googleSheet.spreadsheets.values.get({
        spreadsheetId: '15DSBFCgs_6eULe_HagEo4ZWKUOT6INvV6KJtuTOpQfE',
        range: `1!B2:F3793`,
      });
      console.log(datas.data.values, '완료!');
      await this.gpsRepo.isertData(datas.data.values);
      return;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  /**도, 시, 읍면동을 입력받으면 해당 주소의 좌표값을 반환함 */
  async getGps(Do: string, si?: string, vilage?: string) {
    try {
      if (!Do && !si && vilage)
        throw new CustomError('정확한 주소 입력바람', 400);
      const gps = await this.gpsRepo.getGps(Do, si, vilage);
      return gps;
    } catch (err) {
      if (!err.options === false) {
        throw new CustomError(err.message, 400);
      }
      throw new Error(err);
    }
  }

  /**getGps로 얻은 gps값을 입력받으면 해당 좌표로 등록된 지명을모두 반환 */
  async getLocations(gps) {
    try {
      const locations = await this.gpsRepo.gpsToLocations(gps);
      return locations;
    } catch (err) {
      throw new Error(err);
    }
  }
}
