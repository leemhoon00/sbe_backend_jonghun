import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';
import { IsYYYYMMOrYYYYMMDD } from './helper/date.validator';

export class GetMealRequest {
  @ApiProperty({ minLength: 2 })
  @Length(2)
  schoolName: string;

  @ApiProperty({
    required: false,
    description: 'YYYYMMDD or YYYYMM, 없으면 default 오늘 날짜입니다',
    example: '20250418',
  })
  @IsOptional()
  @IsYYYYMMOrYYYYMMDD()
  date?: string;
}
