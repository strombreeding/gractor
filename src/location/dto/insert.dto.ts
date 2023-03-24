import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class LocationDto {
  @ApiProperty({
    example: '서울특별시 : 단독 O',
    description: 'Do',
    required: false,
  })
  Do: string;

  @ApiProperty({
    example: '관악구 : 단독 O',
    description: 'si',
    required: false,
  })
  si: string | null;

  @ApiProperty({
    example: '성현동 : 단독 X, 반드시 도 & 시 입력',
    description: 'vilage',
    required: false,
  })
  vilage: string | null;
}
//
