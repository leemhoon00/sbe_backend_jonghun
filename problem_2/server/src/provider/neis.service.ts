import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateUtil } from 'src/common/util/date.util';

@Injectable()
export class NeisService {
  private apiUrl = 'https://open.neis.go.kr/hub';
  private apiKey: string;
  constructor(private configService: ConfigService) {
    const key = this.configService.get<string>('API_KEY');
    if (!key) {
      throw new Error('API_KEY 없음');
    }
    this.apiKey = key;
  }

  // 학교 검색
  async getSchoolInfo(name: string) {
    const response = await fetch(
      `${this.apiUrl}/schoolInfo?KEY=${this.apiKey}&Type=json&pIndex=1&pSize=1&SCHUL_NM=${name}`,
    );
    const data = (await response.json()) as NeisSchoolsResponse | FailResponse;
    if ('RESULT' in data) {
      return null;
    }
    return data.schoolInfo[1].row[0];
  }

  async findMealsByDate({
    schoolName,
    date,
  }: {
    schoolName: string;
    date: string;
  }) {
    const school = await this.getSchoolInfo(schoolName);

    if (!school) {
      return null;
    }

    const { ATPT_OFCDC_SC_CODE, SD_SCHUL_CODE, SCHUL_NM } = school;

    const response = await fetch(
      `${this.apiUrl}/mealServiceDietInfo?KEY=${this.apiKey}&Type=json&pIndex=1&pSize=1000` +
        `&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}` +
        `&SD_SCHUL_CODE=${SD_SCHUL_CODE}` +
        `&MLSV_YMD=${date.replaceAll('-', '')}`,
    );

    const data = (await response.json()) as NeisMealsResponse | FailResponse;
    if ('RESULT' in data) {
      return [];
    }

    return [
      {
        date,
        schoolName: SCHUL_NM,
        meals: data.mealServiceDietInfo[1].row.map((meal) =>
          this.convertMeal(meal),
        ),
      },
    ];
  }

  async findMealsByMonth({
    schoolName,
    date,
  }: {
    schoolName: string;
    date: string;
  }) {
    const school = await this.getSchoolInfo(schoolName);

    if (!school) {
      return null;
    }

    const { ATPT_OFCDC_SC_CODE, SD_SCHUL_CODE, SCHUL_NM } = school;

    const response = await fetch(
      `${this.apiUrl}/mealServiceDietInfo?KEY=${this.apiKey}&Type=json&pIndex=1&pSize=1000` +
        `&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}` +
        `&SD_SCHUL_CODE=${SD_SCHUL_CODE}` +
        `&MLSV_FROM_YMD=${date.replaceAll('-', '')}01` +
        `&MLSV_TO_YMD=${DateUtil.getLastDateOfMonth(date)}`,
    );

    const data = (await response.json()) as NeisMealsResponse | FailResponse;

    if ('RESULT' in data) return [];

    // Map에 날짜를 키로, Meal[]을 값으로 저장하는 이유는 NEIS API의 기본 제공 데이터는 먼저 중식/석식으로 1차 정렬 후 날짜순으로 2차 정렬하여 반환합니다.
    // 만약 프론트엔드에서 캘린더에 쓸 목적으로 이 api를 호출한다면 날짜별로 묶어서 반환해야 추가적인 데이터 정렬 없이 바로 사용가능합니다.
    const map = new Map<string, Meal[]>();
    data.mealServiceDietInfo[1].row.forEach((meal) => {
      const date =
        meal.MLSV_YMD.substring(0, 4) +
        '-' +
        meal.MLSV_YMD.substring(4, 6) +
        '-' +
        meal.MLSV_YMD.substring(6, 8);

      if (!map.has(date)) {
        map.set(date, []);
      }

      map.get(date)?.push(this.convertMeal(meal));
    });

    const result: {
      date: string;
      schoolName: string;
      meals: Meal[];
    }[] = [];

    map.forEach((value, key) => {
      result.push({
        date: key,
        schoolName: SCHUL_NM,
        meals: value,
      });
    });
    return result;
  }

  convertMeal(meal: NeisMealResponse): Meal {
    return {
      mealType: meal.MMEAL_SC_NM,
      menus: meal.DDISH_NM.split('<br/>').map((item) =>
        item.replace(/\([^)]*\)/g, '').trim(),
      ),
      calorie: Number(meal.CAL_INFO.split(' ')[0]),
      nutritions: meal.NTR_INFO.split('<br/>').map((item) => {
        const match = item.match(/^(.+?)\(([^)]+)\)\s*:\s*([\d.]+)$/);
        return match
          ? {
              name: match[1].trim(), // 영양소 이름
              unit: match[2].trim(),
              quantity: Number(match[3]), // 함유량
            }
          : {
              name: '',
              unit: '',
              quantity: 0,
            };
      }),
    };
  }
}

type Meal = {
  mealType: string;
  menus: string[];
  calorie: number;
  nutritions: {
    name: string;
    unit: string;
    quantity: number;
  }[];
};

type NeisSchoolResponse = {
  ATPT_OFCDC_SC_CODE: string; // 시도교육청 코드
  ATPT_OFCDC_SC_NM: string; // 시도교육청 이름
  SD_SCHUL_CODE: string; // 학교 코드
  SCHUL_NM: string; // 학교 이름
};

type NeisSchoolsResponse = {
  schoolInfo: [
    {
      head: [
        {
          list_total_count: number;
          RESULT: {
            CODE: string;
            MESSAGE: string;
          };
        },
      ];
    },
    {
      row: NeisSchoolResponse[];
    },
  ];
};

type NeisMealResponse = {
  SCHUL_NM: string; // 학교 이름
  MMEAL_SC_NM: string; // 중식 or 석식
  MLSV_YMD: string; // 날짜
  DDISH_NM: string; // 메뉴
  CAL_INFO: string; // 칼로리
  NTR_INFO: string; // 영양 정보
  MMEAL_SC_CODE: string; // 중식 or 석식 코드
};

type NeisMealsResponse = {
  mealServiceDietInfo: [
    {
      head: [
        {
          list_total_count: number;
          RESULT: {
            CODE: string;
            MESSAGE: string;
          };
        },
      ];
    },
    {
      row: NeisMealResponse[];
    },
  ];
};

type FailResponse = {
  RESULT: {
    CODE: string;
    MESSAGE: string;
  };
};
