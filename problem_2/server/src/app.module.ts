import { Module } from '@nestjs/common';
import { globalPipe } from './core/pipe/global.pipe';
import { ConfigModule } from '@nestjs/config';
import { MealModule } from './module/meal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    MealModule,
  ],
  providers: [globalPipe],
})
export class AppModule {}
