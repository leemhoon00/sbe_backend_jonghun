import { Injectable, HttpException } from '@nestjs/common';
import { NeisService } from './neis.service';

@Injectable()
export class MealService {
  constructor(private neisService: NeisService) {}

  async getMealInfo({
    schoolName,
    date,
  }: {
    schoolName: string;
    date: string;
  }) {
    if (date.length === 10) {
      const meals = await this.neisService.findMealsByDate({
        schoolName,
        date,
      });
      if (!meals) {
        throw new HttpException('SCHOOL_NOT_FOUND', 404);
      }
      return meals;
    }
    const meals = await this.neisService.findMealsByMonth({ schoolName, date });
    if (!meals) {
      throw new HttpException('SCHOOL_NOT_FOUND', 404);
    }
    return meals;
  }
}
