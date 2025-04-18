import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Length } from 'class-validator';
import { IsDateFormat } from './helper/date.validator';

export class GetMealRequest {
  @ApiProperty({ minLength: 2 })
  @Length(2)
  schoolName: string;

  @ApiProperty({
    required: false,
    description: 'YYYY-MM-DD or YYYY-MM, 없으면 default 오늘 날짜입니다',
    example: '2025-04-18',
  })
  @IsOptional()
  @IsDateFormat()
  date?: string;
}
