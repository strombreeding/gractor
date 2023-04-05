import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// MongoDB의 가장 작은 단위가 Document, 모듈에서 사용할 타입을 export 시켜줌
export type SsfDocument = Ssf & Document;

// 아래와 같이 timestamp 설정도 가능하다.
// createdAt과 updatedAt둘 중에 하나만 사용하고 싶다면 아래와 같이 작성도 가능하다.
// @Schema({ timestamps: { createdAt: "createdAt", updatedAt: false } })
@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class Ssf {
  @Prop({
    default: new Date(),
    type: mongoose.Schema.Types.Date,
    // expires: 86400 / 2,
  })
  createdAt: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;

  @Prop()
  nx: string;
  @Prop()
  ny: string;

  @Prop()
  openDate: string; //20230301

  @Prop()
  openTime: string; // 몇시 02시,  11시

  @Prop()
  skyStatus: string; // :하늘 상태 맑음(1), 구름많음(3), 흐림(4)
  @Prop()
  temperature: string; // 기온 ℃
  @Prop()
  precipitation: string; // 1시간 강수량 mm
  @Prop()
  precipitationPattern: string; // 강수 형태 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
  @Prop()
  EW_windInfo: string; // 동서바람성분 m/s
  @Prop()
  SN_windInfo: string; // 남북바람성분 m/s
  @Prop()
  windDirection: string; // 풍향 ° deg
  @Prop()
  windSpeed: string; // 풍속 m/s
  @Prop()
  humidity: string; //습도 %
  @Prop()
  thunderstroke: string; // 낙뢰 kA
}
/**
 * 
T1H	기온	℃
RN1	1시간 강수량	범주 (1 mm)
SKY	하늘상태	코드값
UUU	동서바람성분	m/s
VVV	남북바람성분	m/s
REH	습도	%
PTY	강수형태	코드값
LGT	낙뢰	kA(킬로암페어)
VEC	풍향	deg
WSD	풍속	m/s

 */

// 위의 작성한 클래스를 바탕으로 Mongoose에서 사용하는 스키마 클래스를 만들어준다.
export const SsfSchema = SchemaFactory.createForClass(Ssf);
