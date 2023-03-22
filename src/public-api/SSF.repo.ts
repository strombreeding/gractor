import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ssf, SsfDocument } from './schemas/SSF.schema';
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
  async create(data: SsfType[]) {
    console.log(data.length, ' ssf데이터의 길이');
  }
}
