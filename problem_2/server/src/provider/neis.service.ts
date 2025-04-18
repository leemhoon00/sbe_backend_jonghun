import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

    const { ATPT_OFCDC_SC_CODE, SD_SCHUL_CODE } = school;

    const response = await fetch(
      `${this.apiUrl}/mealServiceDietInfo?KEY=${this.apiKey}&Type=json&pIndex=1&pSize=1000` +
        `&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}` +
        `&SD_SCHUL_CODE=${SD_SCHUL_CODE}` +
        `&MLSV_YMD=${date}`,
    );

    const data = (await response.json()) as NeisMealsResponse | FailResponse;
    if ('RESULT' in data) {
      return [];
    }

    return data.mealServiceDietInfo[1].row.map((meal) => ({
      schoolName: meal.SCHUL_NM,
      mealType: meal.MMEAL_SC_NM,
      date: meal.MLSV_YMD,
      menus: meal.DDISH_NM.split('<br/>').map((item) =>
        item.replace(/\([^)]*\)/g, '').trim(),
      ),
      calorie: Number(meal.CAL_INFO.split(' ')[0]),
      nutrition: meal.NTR_INFO.split('<br/>').map((item) => {
        const match = item.match(/^(.+?)\(([^)]+)\)\s*:\s*([\d.]+)$/);
        return match
          ? {
              name: match[1].trim(), // 영양소 이름
              unit: match[2].trim(),
              quantity: Number(match[3]), // 함유량
            }
          : [];
      }),
    }));
  }
}

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
