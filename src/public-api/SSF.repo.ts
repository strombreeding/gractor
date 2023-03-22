import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ssf, SsfDocument } from './schemas/SSF.schema';
import * as utils from '../utils/utils';

type SsfType = {
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
export class SsfRepository {
  constructor(
    @InjectModel(Ssf.name)
    private ssfModel: Model<SsfDocument>,
  ) {}
  async create(data: SsfType[], gps: any) {
    console.log(data.length);
    const a = [];
    for (let i = 0; i < 6; i++) {
      let newSsf = {
        nx: gps[0],
        ny: gps[1],
        openDate: data[i].fcstDate,
        openTime: data[i].fcstTime,
        skyStatus: '',
        temperature: '',
        precipitation: '',
        precipitationPattern: '',
        EW_windInfo: '',
        SN_windInfo: '',
        windDirection: '',
        windSpeed: '',
        humidity: '',
        thunderstroke: '',
      };
      a.push(newSsf);
    }
    // 0~5
    let c = 0;
    for (let i = 0; i < 6; i++) {
      const emptyObj = {};
      const value = utils.addSignGender(data[i].category, data[i].fcstValue);
      const key = utils.keyCreater(emptyObj, data[i].category, value);
      a[c] = { ...a[c], ...key };
      ++c;
    }
    // 6~11
    let b = 0;
    for (let i = 6; i < 12; i++) {
      const emptyObj = {};
      const value = utils.addSignGender(data[i].category, data[i].fcstValue);
      const key = utils.keyCreater(emptyObj, data[i].category, value);
      a[b] = { ...a[b], ...key };
      ++b;
    }
    // 12~17
    let q = 0;
    for (let i = 12; i < 18; i++) {
      const emptyObj = {};
      const value = utils.addSignGender(data[i].category, data[i].fcstValue);
      const key = utils.keyCreater(emptyObj, data[i].category, value);
      a[q] = { ...a[q], ...key };
      ++q;
    }
    // 18~23
    let r = 0;
    for (let i = 18; i < 24; i++) {
      const emptyObj = {};
      const value = utils.addSignGender(data[i].category, data[i].fcstValue);
      const key = utils.keyCreater(emptyObj, data[i].category, value);
      a[r] = { ...a[r], ...key };
      ++r;
    }
    // 24~29
    let s = 0;
    for (let i = 24; i < 30; i++) {
      const emptyObj = {};
      const value = utils.addSignGender(data[i].category, data[i].fcstValue);
      const key = utils.keyCreater(emptyObj, data[i].category, value);
      a[s] = { ...a[s], ...key };
      ++s;
    }
    // 30~35
    let t = 0;
    for (let i = 30; i < 36; i++) {
      const emptyObj = {};
      const value = utils.addSignGender(data[i].category, data[i].fcstValue);
      const key = utils.keyCreater(emptyObj, data[i].category, value);
      a[t] = { ...a[t], ...key };
      ++t;
    }
    // 36~41
    let v = 0;
    for (let i = 36; i < 42; i++) {
      const emptyObj = {};
      const value = utils.addSignGender(data[i].category, data[i].fcstValue);
      const key = utils.keyCreater(emptyObj, data[i].category, value);
      a[v] = { ...a[v], ...key };
      ++v;
    }
    // 42~47
    let d = 0;
    for (let i = 42; i < 48; i++) {
      const emptyObj = {};
      const value = utils.addSignGender(data[i].category, data[i].fcstValue);
      const key = utils.keyCreater(emptyObj, data[i].category, value);
      a[d] = { ...a[d], ...key };
      ++d;
    }
    // 48~53
    let e = 0;
    for (let i = 48; i < 54; i++) {
      const emptyObj = {};
      const value = utils.addSignGender(data[i].category, data[i].fcstValue);
      const key = utils.keyCreater(emptyObj, data[i].category, value);
      a[e] = { ...a[e], ...key };
      ++e;
    }
    // 54~59
    let f = 0;
    for (let i = 54; i < 60; i++) {
      const emptyObj = {};
      const value = utils.addSignGender(data[i].category, data[i].fcstValue);
      const key = utils.keyCreater(emptyObj, data[i].category, value);
      a[f] = { ...a[f], ...key };
      ++f;
    }

    for (let i = 0; i < a.length; i++) {
      const isit = await this.ssfModel.findOne({
        openDate: a[i].openDate,
        openTime: a[i].openTime,
        nx: a[i].nx,
        ny: a[i].ny,
      });
      if (!isit) {
        await this.ssfModel.create(a[i]);
      } else {
        await this.ssfModel.updateMany(
          {
            openDate: a[i].openDate,
            openTime: a[i].openTime,
            nx: a[i].nx,
            ny: a[i].ny,
          },
          { $set: a[i] },
        );
      }
    }
  }
}
