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

  async getIndependency() {}

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
      console.log(err.message);
    }
  }
  async getWorkingLocation(gps) {
    const locations = await this.gpsService.getLocations(gps);
    return locations;
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
        return updateLocation;
      } else {
        return '이미 추가된 지역입니다.';
      }
      return locationsArr;
    } catch (err) {
      console.log(err.message);
    }
  }

  async deleteLocation(xyArr: string[], gps: any) {
    const [x, y] = xyArr;
    const stringXY = `${x},${y}`;
    try {
      const aleardyLocation = (await this.locationModel.find({}))[0];
      const workingArr = await this.gpsService.getLocations(gps);
      if (!aleardyLocation || !aleardyLocation.xyWorking.includes(stringXY))
        throw new HttpException(
          '데이터가 비어있습니다',
          HttpStatusCode.NotFound,
        );
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
    if (!location.do.includes(Do)) {
      location.do.push(Do);
    }
  });
  locationInfo.si.map((si) => {
    if (!location.si.includes(si)) {
      location.si.push(si);
    }
  });
  locationInfo.vilages.map((vilage) => {
    if (!location.vilage.includes(vilage)) {
      location.vilage.push(vilage);
    }
  });
  return location;
};
