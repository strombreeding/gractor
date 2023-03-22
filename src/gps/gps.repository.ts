import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gps, GpsDocument } from './schemas/gps.schema';

@Injectable()
export class GpsRepository {
  constructor(
    @InjectModel(Gps.name)
    private gpsModel: Model<GpsDocument>,
  ) {}

  async getGps(Do: string, si?: string, vilageName?: string) {
    const findFilter = {
      ...(Do && { do: Do }),
      ...(si && { si }),
    };
    console.log(findFilter);

    const gps = await this.gpsModel.findOne(findFilter);
    if (!gps)
      throw new HttpException(
        '해당 주소로된 데이터가 존재하지 않음',
        HttpStatus.NOT_FOUND,
      );
    const result = {
      do: Do,
      si,
      vilage: vilageName,
      nx: gps.defaultXY[0],
      ny: gps.defaultXY[1],
    };
    if (vilageName) {
      const isVilage = gps.etc.find((etc) => etc.vilage === vilageName);
      if (!isVilage)
        throw new HttpException(
          '해당 읍면리로 데이터를 찾을 수 없습니다',
          HttpStatus.NOT_FOUND,
        );
      gps.etc.map((vilage) => {
        if (vilage.vilage === vilageName) {
          result.nx = vilage.nx;
          result.ny = vilage.ny;
        }
      });
    }
    // console.log(result);
    return result;
    // return gps;
  }

  async isertData(data: any) {
    for (let i = 0; i < data.length; i++) {
      const etc = {
        vilage: data[i][2],
        nx: data[i][3],
        ny: data[i][4],
      };
      const checkAleardy = await this.gpsModel.findOne({
        do: data[i][0],
        si: data[i][1],
      });
      if (!checkAleardy) {
        const insertData = {
          do: data[i][0],
          si: data[i][1],
          defaultXY: [data[i][3], data[i][4]],
          etc: [],
        };
        await this.gpsModel.create(insertData);
      } else {
        await this.gpsModel.updateOne(
          {
            do: data[i][0],
            si: data[i][1],
          },
          { $push: { etc } },
        );
      }
    }
    return 'good';
  }
}
