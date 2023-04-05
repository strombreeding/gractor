import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// MongoDB의 가장 작은 단위가 Document, 모듈에서 사용할 타입을 export 시켜줌
export type StfDocument = Stf & Document;

// 아래와 같이 timestamp 설정도 가능하다.
// createdAt과 updatedAt둘 중에 하나만 사용하고 싶다면 아래와 같이 작성도 가능하다.
// @Schema({ timestamps: { createdAt: "createdAt", updatedAt: false } })
@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Stf {
  @Prop({
    default: new Date(),
    type: mongoose.Schema.Types.Date,
    // expires: 86400 * 3,
  })
  createdAt: Date;

  @Prop({ default: new Date(), type: mongoose.Schema.Types.Date })
  updatedAt: Date;

  @Prop()
  openDate: string; //20230301

  @Prop()
  openTime: string; // 몇시 02시,  11시

  @Prop()
  nx: string;
  @Prop()
  ny: string;

  // 기타 환경
  @Prop()
  temperatureForHour: string; // 1시간 기온 ℃
  @Prop()
  humidity: string; //습도 %
  @Prop()
  heightTemp: string; // 최고기온 ℃
  @Prop()
  lowTemp: string; // 최저기온 ℃

  // 하늘
  @Prop()
  skyStatus: string; // :하늘 상태 맑음(1), 구름많음(3), 흐림(4)
  // 눈
  @Prop()
  snow: string; // 1시간 눈 cm

  // 비
  @Prop()
  precipitation: string; // 1시간 강수량 mm
  @Prop()
  precipitationPattern: string; // 강수 형태 없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
  @Prop()
  precipitationPercent: string; // 강수확률 %

  // 바람
  @Prop()
  EW_windInfo: string; // 동서바람성분 m/s
  @Prop()
  SN_windInfo: string; // 남북바람성분 m/s
  @Prop()
  windDirection: string; // 풍향 ° deg
  @Prop()
  windSpeed: string; // 풍속 m/s
  @Prop()
  seaWave: string; // 파고 M
  /**
POP	강수확률	%
PTY	강수형태	코드값
PCP	1시간 강수량	범주 (1 mm)
REH	습도	%
SNO	1시간 신적설	범주(1 cm)
SKY	하늘상태	코드값
TMP	1시간 기온	℃
TMN	일 최저기온	℃
TMX	일 최고기온	℃
UUU	풍속(동서성분)	m/s
VVV	풍속(남북성분)	m/s
WAV	파고	M
VEC	풍향	deg
WSD	풍속	m/s


   */
}

// 위의 작성한 클래스를 바탕으로 Mongoose에서 사용하는 스키마 클래스를 만들어준다.
export const StfSchema = SchemaFactory.createForClass(Stf);
