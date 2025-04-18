import { Module } from '@nestjs/common';
import { MealController } from 'src/presentation/controller/meal.controller';
import { MealService } from 'src/provider/meal.service';
import { NeisService } from 'src/provider/neis.service';

@Module({
  imports: [],
  controllers: [MealController],
  providers: [MealService, NeisService],
})
export class MealModule {}
