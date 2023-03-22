import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// MongoDB의 가장 작은 단위가 Document, 모듈에서 사용할 타입을 export 시켜줌
export type STFDocument = STF & Document;

// 아래와 같이 timestamp 설정도 가능하다.
// createdAt과 updatedAt둘 중에 하나만 사용하고 싶다면 아래와 같이 작성도 가능하다.
// @Schema({ timestamps: { createdAt: "createdAt", updatedAt: false } })
@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class STF {
  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;

  @Prop()
  date: string;

  @Prop()
  time: string;

  @Prop()
  etc: {
    강수량: string;
    풍속: string;
    기타등등: string;
  };

  //   @Prop()
  //   timeStatus: {
  //     // t0000: {
  //     //   강수량: string;
  //     // };
  //     // t0100: {
  //     //   강수량: string;
  //     // };
  //     // t0200: {
  //     //   강수량: string;
  //     // };
  //     // t0300: {
  //     //   강수량: string;
  //     // };
  //     // t0400: {
  //     //   강수량: string;
  //     // };
  //     // t0500: {
  //     //   강수량: string;
  //     // };
  //     // t0600: {
  //     //   강수량: string;
  //     // };
  //     // t0700: {
  //     //   강수량: string;
  //     // };
  //     // t0800: {
  //     //   강수량: string;
  //     // };
  //     // t0900: {
  //     //   강수량: string;
  //     // };
  //     // t1000: {
  //     //   강수량: string;
  //     // };
  //     // t1100: {
  //     //   강수량: string;
  //     // };
  //     // t1200: {
  //     //   강수량: string;
  //     // };
  //     // t1300: {
  //     //   강수량: string;
  //     // };
  //     // t1400: {
  //     //   강수량: string;
  //     // };
  //     // t1500: {
  //     //   강수량: string;
  //     // };
  //     // t1600: {
  //     //   강수량: string;
  //     // };
  //     // t1700: {
  //     //   강수량: string;
  //     // };
  //     // t1800: {
  //     //   강수량: string;
  //     // };
  //     // t1900: {
  //     //   강수량: string;
  //     // };
  //     // t2000: {
  //     //   강수량: string;
  //     // };
  //     // t2100: {
  //     //   강수량: string;
  //     // };
  //     // t2200: {
  //     //   강수량: string;
  //     // };
  //     // t2300: {
  //     //   강수량: string;
  //     // };
  //   };
}

// 위의 작성한 클래스를 바탕으로 Mongoose에서 사용하는 스키마 클래스를 만들어준다.
export const STFSchema = SchemaFactory.createForClass(STF);
