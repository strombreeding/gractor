import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

// MongoDB의 가장 작은 단위가 Document, 모듈에서 사용할 타입을 export 시켜줌
export type LocationDocument = Location & Document;

// 아래와 같이 timestamp 설정도 가능하다.
// createdAt과 updatedAt둘 중에 하나만 사용하고 싶다면 아래와 같이 작성도 가능하다.
// @Schema({ timestamps: { createdAt: "createdAt", updatedAt: false } })
@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Location {
  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @ApiProperty()
  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;

  // 일중인 좌표
  @ApiProperty({ description: '수행중인 도' })
  @Prop()
  do: string[];
  @ApiProperty({ description: '수행중인 시' })
  @Prop()
  si: string[];
  @ApiProperty({ description: '수행중인 동읍면' })
  @Prop()
  vilage: string[];
  // 일중인 좌표
  @ApiProperty({ description: '수행중인 좌표값' })
  @Prop()
  xyWorking: string[];
}

// 위의 작성한 클래스를 바탕으로 Mongoose에서 사용하는 스키마 클래스를 만들어준다.
export const LocationSchema = SchemaFactory.createForClass(Location);
