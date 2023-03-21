import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// MongoDB의 가장 작은 단위가 Document, 모듈에서 사용할 타입을 export 시켜줌
export type GpsDocument = Gps & Document;

// 아래와 같이 timestamp 설정도 가능하다.
// createdAt과 updatedAt둘 중에 하나만 사용하고 싶다면 아래와 같이 작성도 가능하다.
// @Schema({ timestamps: { createdAt: "createdAt", updatedAt: false } })
@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Gps {
  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;

  //행정구역코드
  @Prop()
  code: string;

  @Prop()
  // 도
  do: string;

  @Prop()
  si: string;

  @Prop()
  defaultXY: Array<string>;

  @Prop()
  etc: Vilege[];
}

// 위의 작성한 클래스를 바탕으로 Mongoose에서 사용하는 스키마 클래스를 만들어준다.
export const GpsSchema = SchemaFactory.createForClass(Gps);
export type Vilege = {
  vilage: string; //읍면리이름
  nx: string; // x좌표
  ny: string; // y좌표
};
