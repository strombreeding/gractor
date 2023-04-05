import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpStatusCode } from 'axios';
import { Model } from 'mongoose';
import { CustomError } from 'src/error/custom.error';
import { GpsService } from 'src/gps/gps.service';
import { Location, LocationDocument } from './schemas/location.schema';
import { PublicApiService } from 'src/public-api/public-api.service';
import * as util from '../utils/utils';
@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name)
    private locationModel: Model<LocationDocument>,
    @Inject(forwardRef(() => PublicApiService))
    private publicService: PublicApiService,
    private gpsService: GpsService, // private publicService: PublicApiService,
  ) {}
  async getAllLocations() {
    try {
      const locations = (await this.locationModel.find({}))[0];
      const result = {
        do: locations.do,
        si: locations.si,
        vilage: locations.vilage,
        xyWorking: locations.xyWorking,
      };
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async getWorkingLocation(gps) {
    try {
      const locations = await this.gpsService.getLocations(gps);
      return locations;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async insertLocation(xyArr: string[], gps: any) {
    const [x, y] = xyArr;
    const stringXY = `${x},${y}`;

    try {
      const aleardyLocation = (await this.locationModel.find({}))[0];
      const locationsArr = await this.getWorkingLocation(gps);
      if (!aleardyLocation) {
        const toCreate = {
          xyWorking: stringXY,
          do: locationsArr.Do,
          si: locationsArr.si,
          vilage: locationsArr.vilages,
        };
        await this.locationModel.create(toCreate);
        const newLocation = await this.locationModel.findOne({
          xyWorking: stringXY,
        });
        const a = await this.getForInsertLocation(xyArr);
        console.log('시작', a);

        return newLocation;
      } else if (!aleardyLocation.xyWorking.includes(stringXY)) {
        // 좌표값 추가
        aleardyLocation.xyWorking.push(stringXY);

        // 좌표가 같은 다른 지명 추가
        const location = addLocation(aleardyLocation, locationsArr);
        aleardyLocation.do = location.do;
        aleardyLocation.si = location.si;
        aleardyLocation.vilage = location.vilage;
        // 업데이트
        const updateLocation = aleardyLocation;
        await this.locationModel.updateOne(
          { _id: updateLocation._id },
          { $set: updateLocation },
        );
        const a = await this.getForInsertLocation(xyArr);
        console.log('시작', a);

        return updateLocation;
      } else {
        return '이미 추가된 지역입니다.';
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
  /**XY주면 가장 최근의 발표된 OpenAPI 데이터 수집후 저장함 */
  async getForInsertLocation(arr: any) {
    const baseUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/`;
    const serviceKey = process.env.SERVICE_KEY;
    const acceptHoursOfSTF = ['02', '05', '08', '11', '14', '17', '20', '23'];
    const getTime = util.getDate();

    //SSL, SSF 를 위한 1시간 전 구하기
    if (String(Number(getTime.nowTime) - 100).length === 3) {
      getTime.nowTime = `0${String(Number(getTime.nowTime) - 100)}`;
    } else if (String(Number(getTime.nowTime) - 100).length === 1) {
      getTime.nowTime = `0000`;
    }
    const nowTime = getTime.nowTime;
    const nowDate = getTime.nowDate;
    // 가장 최근 발표된 stf 시간
    while (!acceptHoursOfSTF.includes(getTime.nowHours)) {
      getTime.nowHours =
        `${Number(getTime.nowHours) - 1}`.length !== 1
          ? `${Number(getTime.nowHours) - 1}`
          : `0${Number(getTime.nowHours) - 1}`;
    }
    const forStfTime =
      `${Number(getTime.nowHours)}`.length === 1
        ? `0${getTime.nowHours}00`
        : `${getTime.nowHours}00`;

    //데이터 수집
    const sslRequest = await this.publicService.reqOpenApi(
      baseUrl,
      'getUltraSrtNcst',
      serviceKey,
      arr,
      nowTime,
      nowDate,
    );
    const ssfRequest = await this.publicService.reqOpenApi(
      baseUrl,
      'getUltraSrtFcst',
      serviceKey,
      arr,
      nowTime,
      nowDate,
    );
    const stfRequest = await this.publicService.reqOpenApi(
      baseUrl,
      'getVilageFcst',
      serviceKey,
      arr,
      forStfTime,
      nowDate,
    );
    return true;
  }
  async deleteLocation(xyArr: string[], gps: any) {
    const [x, y] = xyArr;
    const stringXY = `${x},${y}`;
    try {
      const aleardyLocation = (await this.locationModel.find({}))[0];
      const workingArr = await this.gpsService.getLocations(gps);
      if (!aleardyLocation || !aleardyLocation.xyWorking.includes(stringXY))
        throw new CustomError('데이터가 비어있습니다', 404);
      // const a = await this.gpsService.getGps(gps.do, gps.si, gps.vilage);

      const targetLocation = deleteLocation(aleardyLocation, workingArr);
      aleardyLocation.do = targetLocation.do;
      aleardyLocation.si = targetLocation.si;
      aleardyLocation.vilage = targetLocation.vilage;
      for (let i = 0; i < aleardyLocation.xyWorking.length; i++) {
        if (aleardyLocation.xyWorking[i] === stringXY) {
          aleardyLocation.xyWorking.splice(i, 1);
          break;
        }
      }
      await this.locationModel.updateOne(
        { _id: aleardyLocation._id },
        { $set: aleardyLocation },
      );
      return aleardyLocation;
    } catch (err) {
      if (!err.options === false) {
        throw new CustomError(err.message, 404);
      }
      throw new Error();
      console.log(err.message);
    }
  }
}

export const deleteLocation = (
  location: Location,
  locationInfo: {
    Do: string[];
    si: string[];
    vilages: string[];
  },
) => {
  locationInfo.Do.map((Do) => {
    if (location.do.includes(Do)) {
      const index = location.do.indexOf(Do);
      location.do.splice(index, 1);
    }
  });
  locationInfo.si.map((si) => {
    if (location.si.includes(si)) {
      const index = location.si.indexOf(si);
      location.si.splice(index, 1);
    }
  });
  locationInfo.vilages.map((vilage) => {
    if (location.vilage.includes(vilage)) {
      const index = location.vilage.indexOf(vilage);
      location.vilage.splice(index, 1);
    }
  });
  return location;
};

export const addLocation = (
  location: Location,
  locationInfo: { Do: string[]; si: string[]; vilages: string[] },
) => {
  locationInfo.Do.map((Do) => {
    if (!location.do.includes(Do) && Do !== '') {
      location.do.push(Do);
    }
  });
  locationInfo.si.map((si) => {
    if (!location.si.includes(si) && si !== '') {
      location.si.push(si);
    }
  });
  locationInfo.vilages.map((vilage) => {
    if (!location.vilage.includes(vilage) && vilage !== '') {
      location.vilage.push(vilage);
    }
  });
  return location;
};
