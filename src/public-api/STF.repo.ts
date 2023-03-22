import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stf, StfDocument } from './schemas/STF.schema';
import * as utils from '../utils/utils';

type StfType = {
  baseDate: string;
  baseTime: string;
  category: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: string;
  ny: string;
};

@Injectable()
export class StfRepository {
  private specialTime = ['1500', '0600'];
  constructor(
    @InjectModel(Stf.name)
    private stfModel: Model<StfDocument>,
  ) {}
  async create(data: StfType[], gps: any) {
    for (let i = 0; i < data.length; ) {
      if (i >= data.length) break;
      let newStf = {
        openDate: '',
        openTime: '',
        nx: gps[0],
        ny: gps[1],
        temperatureForHour: '',
        humidity: '',
        heightTemp: '',
        lowTemp: '',
        skyStatus: '',
        snow: '',
        precipitation: '',
        precipitationPattern: '',
        precipitationPercent: '',
        EW_windInfo: '',
        SN_windInfo: '',
        windDirection: '',
        windSpeed: '',
        seaWave: '',
      };
      const fcstTime = data[i].fcstTime;

      while (true) {
        if (data[i + 1] === undefined) {
          ++i;
          break;
        }
        if (data[i + 1].fcstTime !== fcstTime) {
          newStf.openDate = data[i].fcstDate;
          newStf.openTime = data[i].fcstTime;
          const value = utils.addSignGender(
            data[i].category,
            data[i].fcstValue,
          );
          newStf = utils.keyCreater(newStf, data[i].category, value);
          ++i;
          break;
        }

        newStf.openDate = data[i].fcstDate;
        newStf.openTime = data[i].fcstTime;
        const value = utils.addSignGender(data[i].category, data[i].fcstValue);
        newStf = utils.keyCreater(newStf, data[i].category, value);
        ++i;
      }
      // 업뎃이라면 업뎃, 아니면 만들기
      const stf = await this.stfModel.findOne({
        openDate: newStf.openDate,
        openTime: newStf.openTime,
        nx: newStf.nx,
        ny: newStf.ny,
      });
      if (stf) {
        await this.stfModel.updateOne({ _id: stf._id }, { $set: newStf });
      } else {
        await this.stfModel.create(newStf);
      }

      // 예보날짜에 최고, 최저기온 있을시 업데이트
      if (newStf.heightTemp !== '') {
        console.log('최고기온 발견 !');
        await this.stfModel.updateMany(
          {
            openDate: newStf.openDate,
            heightTemp: '',
          },
          {
            $set: {
              heightTemp: newStf.heightTemp,
            },
          },
        );
      }
      if (newStf.lowTemp !== '') {
        console.log('최저기온 발견 !');
        await this.stfModel.updateMany(
          {
            openDate: newStf.openDate,
            lowTemp: '',
          },
          {
            $set: {
              lowTemp: newStf.lowTemp,
            },
          },
        );
      }
    }
  }
}
