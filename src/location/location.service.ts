import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from './schemas/location.schema';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name)
    private locationModel: Model<LocationDocument>,
  ) {}

  async insertLocation(xyArr: string[]) {
    const [x, y] = xyArr;
    const stringXY = `${x},${y}`;
    const aleardyLocation = (await this.locationModel.find({}))[0];
    console.log(aleardyLocation);
    if (!aleardyLocation) {
      await this.locationModel.create({ xyWorking: stringXY });
      const newLocation = await this.locationModel.findOne({
        xyWorking: stringXY,
      });
      return newLocation;
    } else if (!aleardyLocation.xyWorking.includes(stringXY)) {
      aleardyLocation.xyWorking.push(stringXY);
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

  async deleteLocation(xyArr) {}
}
