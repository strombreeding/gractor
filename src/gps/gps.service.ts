import { Injectable } from '@nestjs/common';
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

  async getData() {
    const datas = await this.googleSheet.spreadsheets.values.get({
      spreadsheetId: '15DSBFCgs_6eULe_HagEo4ZWKUOT6INvV6KJtuTOpQfE',
      range: `1!B2:F3793`,
    });
    console.log(datas.data.values);
    await this.gpsRepo.isertData(datas.data.values);
    return;
  }

  async getGps(Do: string, si: string, vilage: string) {
    const gps = await this.gpsRepo.getGps(Do, si, vilage);
    return gps;
  }
}
