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
  // 0600 1500 = 14
  async create(data: StfType[]) {
    // let count = 0;
    for (let i = 0; i < data.length; ) {
      if (i >= data.length) break;
      let newStf = {
        openDate: '',
        openTime: '',
        gps: '',
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
        // 올려줬을때 undifined 라면 멈춰줘야함
        // if (data[i] === undefined) break;
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
          newStf = utils.stfCreater(newStf, data[i].category, value);
          ++i;
          break;
        }
        // if (data[i + 1].fcstTime !== fcstTime && i < data.length) {
        //   // 멈춰도 i는 올려줘야함. 안그러면 무한루프임
        //   ++i;
        //   break;
        // }
        // }
        //
        newStf.openDate = data[i].fcstDate;
        newStf.openTime = data[i].fcstTime;
        const value = utils.addSignGender(data[i].category, data[i].fcstValue);
        newStf = utils.stfCreater(newStf, data[i].category, value);
        // if (data[i].category === 'TMX' || data[i].category === 'TMN') {
        //   console.log('오 카테고리 있다!!', newStf);
        // }
        ++i;
      }
      const stf = await this.stfModel.findOne({
        openDate: newStf.openDate,
        openTime: newStf.openTime,
      });
      if (stf) {
        await this.stfModel.updateOne({ _id: stf._id }, { $set: newStf });
      } else {
        await this.stfModel.create(newStf);
      }
      // ++count;
    }
    // console.log('작업끝!', count);
  }
}
