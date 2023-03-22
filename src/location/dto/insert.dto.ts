import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class LocationDto {
  @ApiProperty({
    example: '서울특별시',
    description: 'Do',
  })
  Do: string;

  @ApiProperty({
    example: '관악구 or 데이터입력 X',
    description: 'si',
  })
  si: string | null;

  @ApiProperty({
    example: '성현동 or 데이터입력 X',
    description: 'vilage',
  })
  vilage: string | null;
}
//
