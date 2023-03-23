import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
const deployType = ['production', 'development'];
const deploy = deployType[1];
const logDir = __dirname + '/../../logs'; // log 파일을 관리할 폴더

export const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    maxFiles: 30, //30일치 로그파일 저장
    zippedArchive: true, // 로그가 쌓이면 압축하여 관리
  };
};
// error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
export const winstonLogger = {
  transports: [
    new winston.transports.Console({
      level: deploy === 'production' ? 'info' : 'silly',
      // production 환경이라면 http, 개발환경이라면 모든 단계를 로그
      format:
        deploy === 'production'
          ? winston.format.simple()
          : winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike('gractor', {
                prettyPrint: true,
              }),
            ),
    }),

    // info, error 로그는 파일로 관리
    new winstonDaily(dailyOptions('info')),
    // new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('error')),
  ],
};
