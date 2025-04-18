import { Controller, Get, Query } from '@nestjs/common';
import { MealService } from 'src/provider/meal.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { GetMealRequest } from '../request/meal.request';

@ApiTags('meals')
@ApiResponse({ status: 400, description: '유효성 검사 실패' })
@Controller('meals')
export class MealController {
  constructor(private mealService: MealService) {}

  @ApiOperation({ summary: '급식 정보 조회' })
  @Get()
  async getMealInfo(@Query() query: GetMealRequest) {
    return this.mealService.getMealInfo({
      schoolName: query.schoolName,
      date: query.date ?? new Date().toISOString().split('T')[0],
    });
  }
}
