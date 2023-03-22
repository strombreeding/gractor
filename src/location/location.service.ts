import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpStatusCode } from 'axios';
import { Model } from 'mongoose';
import { GpsService } from 'src/gps/gps.service';
import { Location, LocationDocument } from './schemas/location.schema';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name)
    private locationModel: Model<LocationDocument>,
    private gpsService: GpsService,
  ) {}

  async getWorkingLocation(gps) {
    const zz = await this.gpsService.getLocations(gps);
    // const locations = (await this.locationModel.find({}))[0];
    return zz;
  }

  async insertLocation(xyArr: string[], gps: any) {
    const [x, y] = xyArr;
    const stringXY = `${x},${y}`;
    const aleardyLocation = (await this.locationModel.find({}))[0];
    const locationsArr = await this.getWorkingLocation(gps);
    console.log(aleardyLocation);
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
      return newLocation;
    } else if (!aleardyLocation.xyWorking.includes(stringXY)) {
      // 좌표값 추가
      aleardyLocation.xyWorking.push(stringXY);

      // 좌표가 같은 다른 지명 추가
      for (let i = 0; i < locationsArr.Do.length; i++) {
        if (aleardyLocation.do.includes(locationsArr.Do[i])) {
          aleardyLocation.do.push(locationsArr.Do[i]);
        }
      }
      for (let i = 0; i < locationsArr.si.length; i++) {
        if (aleardyLocation.si.includes(locationsArr.si[i])) {
          aleardyLocation.si.push(locationsArr.si[i]);
        }
      }
      for (let i = 0; i < locationsArr.vilages.length; i++) {
        if (aleardyLocation.vilage.includes(locationsArr.vilages[i])) {
          aleardyLocation.vilage.push(locationsArr.vilages[i]);
        }
      }

      // 업데이트
      const updateLocation = aleardyLocation;
      await this.locationModel.updateOne(
        { _id: updateLocation._id },
        { $set: updateLocation },
      );
      return updateLocation;
    } else {
      return '이미 추가된 지역입니다.';
    }
  }

  async deleteLocation(xyArr: string[], gps: any) {
    const [x, y] = xyArr;
    const stringXY = `${x},${y}`;
    const location = (await this.locationModel.find({}))[0];
    console.log(location.xyWorking.includes(stringXY));
    if (!location || !location.xyWorking.includes(stringXY))
      throw new HttpException('데이터가 비어있습니다', HttpStatusCode.NotFound);
    // const a = await this.gpsService.getGps(gps.do, gps.si, gps.vilage);
    for (let i = 0; i < location.xyWorking.length; i++) {
      if (location.xyWorking[i] === stringXY) {
        location.xyWorking.splice(i, 1);
        await this.locationModel.updateOne(
          { _id: location._id },
          { $set: location },
        );
        break;
      }
    }
    return location;
  }
}
