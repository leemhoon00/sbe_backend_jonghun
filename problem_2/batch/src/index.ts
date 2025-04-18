import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const key = process.env.API_KEY;

const url = 'https://open.neis.go.kr/hub';

async function getSchoolInfo(index: number = 1, size: number = 100) {
  const response = await fetch(
    `${url}/schoolInfo?KEY=${key}&type=json&pIndex=${index}&pSize=${size}`
  );
  const data = (await response.json()) as SchoolsResponse;
  return data.schoolInfo[1].row;
}

async function getSchoolCount() {
  const response = await fetch(
    `${url}/schoolInfo?KEY=${key}&type=json&pIndex=1&pSize=1`
  );
  const data = (await response.json()) as SchoolsResponse;
  return data.schoolInfo[0].head[0].list_total_count;
}

async function getMealInfo({
  index,
  size,
  cityCode,
  schoolCode,
}: {
  index: number;
  size: number;
  cityCode: string;
  schoolCode: string;
}) {
  const response = await fetch(
    `${url}/mealServiceDietInfo?KEY=${key}&type=json&pIndex=${index}&pSize=${size}&ATPT_OFCDC_SC_CODE=${cityCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=20250418`
  );
  const data = await response.json();
  console.dir(data, { depth: null });
}

async function main() {
  // const totalCount = await getSchoolCount();
  // await prisma.school.deleteMany({});
  // for (let i = 1; i <= Math.ceil(totalCount / 1000); i++) {
  //   const schools = await getSchoolInfo(i, 1000);
  //   const convertedSchools = [];
  //   for (const school of schools) {
  //     if (!school.SD_SCHUL_CODE.trim()) {
  //       continue;
  //     }
  //     convertedSchools.push({
  //       cityCode: school.ATPT_OFCDC_SC_CODE,
  //       code: school.SD_SCHUL_CODE,
  //       name: school.SCHUL_NM,
  //     });
  //   }
  //   await prisma.school.createMany({
  //     data: convertedSchools,
  //     skipDuplicates: true,
  //   });
  // }

  const data = await getMealInfo({
    index: 1,
    size: 1,
    cityCode: 'B10',
    schoolCode: '7010698',
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

type SchoolResponse = {
  ATPT_OFCDC_SC_CODE: string; // 시도교육청 코드
  ATPT_OFCDC_SC_NM: string; // 시도교육청 이름
  SD_SCHUL_CODE: string; // 학교 코드
  SCHUL_NM: string; // 학교 이름
};

type SchoolsResponse = {
  schoolInfo: [
    {
      head: [
        {
          list_total_count: number;
          RESULT: {
            CODE: string;
            MESSAGE: string;
          };
        }
      ];
    },
    {
      row: SchoolResponse[];
    }
  ];
};
