import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gps, GpsDocument } from './schemas/gps.schema';
import { google } from 'googleapis';
import { client_email, private_key } from '../eum-366115-61fa453cf283.json';
import { GpsRepository } from './gps.repository';

@Injectable()
export class GpsService {
  private googleSheet = connectGoogleApi();
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
}
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
