import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ssl, SslDocument } from './schemas/SSL.schema';

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

  async create(data: SslType[]) {
    console.log(data.length, ' ssl데이터의 길이');
    // const
  }
}
