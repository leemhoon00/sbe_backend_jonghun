import { ApiProperty } from '@nestjs/swagger';

class NutritionResponse {
  @ApiProperty({ example: '단백질' })
  name: string;

  @ApiProperty({ example: 'g' })
  unit: string;

  @ApiProperty({ example: 10.0 })
  quantity: number;
}

class MealDetailResponse {
  @ApiProperty({ enum: ['중식', '석식'], example: '중식' })
  mealType: string;

  @ApiProperty()
  menus: string[];

  @ApiProperty({ example: '100.0' })
  calorie: number;

  @ApiProperty({ type: [NutritionResponse] })
  nutritions: NutritionResponse[];
}

export class MealResponse {
  @ApiProperty({ example: '2025-04-18' })
  date: string;

  @ApiProperty()
  schoolName: string;

  @ApiProperty({ type: [MealDetailResponse] })
  meals: MealDetailResponse[];
}
