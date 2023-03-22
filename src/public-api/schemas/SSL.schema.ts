import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// MongoDB의 가장 작은 단위가 Document, 모듈에서 사용할 타입을 export 시켜줌
export type SslDocument = Ssl & Document;

// 아래와 같이 timestamp 설정도 가능하다.
// createdAt과 updatedAt둘 중에 하나만 사용하고 싶다면 아래와 같이 작성도 가능하다.
// @Schema({ timestamps: { createdAt: "createdAt", updatedAt: false } })
@Schema({
  collection: 'seoul',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class Ssl {
  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  createdAt: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;

  @Prop()
  openDate: string; //20230301

  @Prop()
  openTime: string; // 몇시 02시,  11시

  @Prop()
  gps: string[];

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
}
// T1H	기온	℃	10
// RN1	1시간 강수량	mm	8
// UUU	동서바람성분	m/s	12
// VVV	남북바람성분	m/s	12
// REH	습도	%	8
// PTY	강수형태	코드값	4
// VEC	풍향	deg	10
// WSD	풍속	m/s	10

// 위의 작성한 클래스를 바탕으로 Mongoose에서 사용하는 스키마 클래스를 만들어준다.
export const SslSchema = SchemaFactory.createForClass(Ssl);
