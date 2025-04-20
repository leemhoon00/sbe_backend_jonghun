import { Controller, Get, Query } from '@nestjs/common';
import { MealService } from 'src/provider/meal.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { GetMealRequest } from '../request/meal.request';
import { MealResponse } from '../response/meal.response';

@ApiTags('meals')
@ApiResponse({ status: 400, description: '유효성 검사 실패' })
@Controller('meals')
export class MealController {
  constructor(private mealService: MealService) {}

  @ApiOperation({ summary: '급식 정보 조회' })
  @ApiResponse({ status: 200, type: [MealResponse] })
  @ApiResponse({ status: 404, description: '학교를 찾을 수 없음' })
  @Get()
  async getMealInfo(@Query() query: GetMealRequest): Promise<MealResponse[]> {
    return this.mealService.getMealInfo({
      schoolName: query.schoolName,
      date: query.date ?? new Date().toISOString().split('T')[0],
    });
  }
}
