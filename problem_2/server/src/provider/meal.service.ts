import { Injectable } from '@nestjs/common';
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
    if (date.length === 10)
      return await this.neisService.findMealsByDate({ schoolName, date });
    return await this.neisService.findMealsByMonth({ schoolName, date });
  }
}
