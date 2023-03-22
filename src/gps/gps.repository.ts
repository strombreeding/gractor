import { Injectable } from '@nestjs/common';
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
    const result = {
      do: Do,
      si,
      vilage: vilageName,
      nx: gps.defaultXY[0],
      ny: gps.defaultXY[1],
    };
    if (vilageName) {
      console.log('ㅎㅇ');
      gps.etc.map((vilage) => {
        if (vilage.vilage === vilageName) {
          result.nx = vilage.nx;
          result.ny = vilage.ny;
        }
      });
    }
    return result;
    return 'gps';
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
