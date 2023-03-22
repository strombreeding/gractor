import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

export class ToggleDto {
  @ApiProperty({
    example: 'start | end',
    description: 'control',
  })
  control: string;

  @ApiProperty({
    example: 'accessCode',
    description: 'accessCode',
  })
  accessCode: string;
}
//
