import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ssl, SslDocument } from './schemas/SSL.schema';
import * as utils from '../utils/utils';

type SslType = {
  baseDate: string;
  baseTime: string;
  category: string;
  nx: string;
  ny: string;
  obsrValue: string;
};
@Injectable()
export class SslRepository {
  constructor(
    @InjectModel(Ssl.name)
    private sslModel: Model<SslDocument>,
  ) {}

  async getSslDatas(
    nx: string,
    ny: string,
    now: {
      nowDate: string;
      nowTime: string;
      nowHours: string;
    },
  ) {
    const data = await this.sslModel.find({
      nx,
      ny,
      openDate: { $gte: now.nowDate },
      openTime: { $gte: now.nowTime },
    });
    return data;
  }

  async create(data: SslType[], gps: any) {
    let newSsl = {
      openTime: data[0].baseTime,
      openDate: data[0].baseDate,
      nx: data[0].nx,
      ny: data[0].ny,
    };
    for (let i = 0; i < data.length; i++) {
      const value = utils.addSignGender(data[i].category, data[i].obsrValue);
      newSsl = utils.keyCreater(newSsl, data[i].category, value);
    }
    const isit = await this.sslModel.findOne({
      openDate: newSsl.openDate,
      openTime: newSsl.openTime,
      nx: newSsl.nx,
      ny: newSsl.ny,
    });
    if (!isit) {
      await this.sslModel.create(newSsl);
    } else {
      await this.sslModel.updateOne({ _id: isit._id }, { $set: newSsl });
    }
  }
}
