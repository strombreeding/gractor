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

  /** 해당 좌표를 가진 모든 지명 반환 repo로직 */
  async gpsToLocations(gps: any) {
    const stringXY = [gps.nx, gps.ny];
    const arr = await this.gpsModel.find({
      etc: { $all: [{ nx: gps.nx }, { ny: gps.ny }] },
    });
    const document = await this.gpsModel.find({ defaultXY: stringXY });
    const result = {
      Do: [],
      si: [],
      vilages: [],
    };
    document.map((xx) => {
      if (!result.Do.includes(xx.do) && gps.do) {
        result.Do.push(xx.do);
      }
      if (!result.si.includes(xx.si) && xx.si !== '') {
        result.si.push(xx.si);
      }
    });
    arr.map((xx) => {
      xx.etc.map((etc) => {
        if (etc.nx === gps.nx && etc.ny === gps.ny) {
          result.vilages.push(etc.vilage);
        }
      });
      // if (xx.nx === gps.nx && xx.ny === gps.ny) {
      // }
    });
    return result;
  }

  /** 입력 지명을 기반으로 좌표뽑아내기 */
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
    return result;
    // return gps;
  }

  /** 업데이트 내역이 있을때 MongoDB에 저장함.
   * 구글스프레드시트 기반으로 됨
   */
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
