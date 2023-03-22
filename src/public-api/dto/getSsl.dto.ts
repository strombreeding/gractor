import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class SslDto {
  @ApiProperty({
    example: '서울특별시',
    description: 'Do',
  })
  Do: string;

  @ApiProperty({
    example: '관악구 or 데이터입력 X',
    description: 'si',
    required: false,
  })
  si: string | null;

  @ApiProperty({
    example: '성현동 or 데이터입력 X',
    description: 'vilage',
    required: false,
  })
  vilage: string | null;
}
//
