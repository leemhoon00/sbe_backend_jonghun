## 문제 2

급식식단정보를 활용하여, 학교 가정통신문 서비스에서 활용될 수 있는 `GET` API 1개를 자유롭게 설계하고 구현해 주세요.

## Solution

### 실행 방법

**1. problem_2/server 폴더로 이동합니다.**

```bash
cd problem_2/server
```

**2. 의존성을 설치합니다.**

```bash
npm i
```

**3. `.env` 파일에 NEIS API 키를 입력합니다.**

```text
API_KEY=YOUR_API_KEY
```

**4. 서버를 실행합니다.**

```bash
npm run start:dev
```

**5. (웹 브라우저) `localhost:3000/api`에 접속하여 Swagger UI를 통해 API를 호출합니다.**

<br />

### 풀이

#### API 설계

- `GET /meals`
  - 요청 파라미터로 학교명(필수), 날짜(선택)를 받습니다.
  - `YYYY-MM-DD` 형식의 날짜는 해당 날짜의 급식정보를 반환하며, `YYYY-MM` 형식의 날짜는 해당 월의 모든 급식정보를 반환합니다.

#### 유효성 검사

- 커스텀 validator를 구현하여 요청 파라미터의 유효성을 검사합니다.
- 학교명은 필수이며 최소 2글자, 날짜는 `YYYY-MM-DD` 또는 `YYYY-MM` 형식이거나 없으면 기본값으로 오늘 날짜가 사용됩니다.

#### 데이터 가공

- Open API에서 기본적으로 제공해주는 메뉴와 영양 정보 등의 데이터는 따로 변환작업을 거쳐야 활용할 수 있습니다.

  **급식 메뉴 (Before)**
  ```text
  '무장아찌주먹밥 (5.6.8.9.13.18)<br/>스텔라별볶이 (1.2.5.6.12.13.16.18)<br/>배추김치 (9)<br/>맑은어묵국 (1.5.6.7.13.18)<br/>군만두 (1.5.6.10.16.18)<br/>치커리사과무침 (5.6.13)<br/>쥬시쿨(가) (11.13)<br/>어묵바 (1.5.6.12.13)'
  ```

  **급식 메뉴 (After)**
  ```json
  "menus": [
    "무장아찌주먹밥",
    "스텔라별볶이",
    "배추김치",
    "맑은어묵국",
    "군만두",
    "치커리사과무침",
    "쥬시쿨",
    "어묵바"
  ],
  ```

  **영양 정보 (Before)**
  ```text
  '탄수화물(g) : 129.5<br/>단백질(g) : 32.1<br/>지방(g) : 14.8<br/>비타민A(R.E) : 280.0<br/>티아민(mg) : 0.3<br/>리보플라빈(mg) : 0.5<br/>비타민C(mg) : 27.5<br/>칼슘(mg) : 198.8<br/>철분(mg) : 3.3'
  ```
  
  **영양 정보 (After)**
  ```json
  "nutritions": [
    {
      "name": "탄수화물",
      "unit": "g",
      "quantity": 129.5
    },
    {
      "name": "단백질",
      "unit": "g",
      "quantity": 32.1
    },
    {
      "name": "지방",
      "unit": "g",
      "quantity": 14.8
    },
    {
      "name": "비타민A",
      "unit": "R.E",
      "quantity": 280
    },
    {
      "name": "티아민",
      "unit": "mg",
      "quantity": 0.3
    },
    {
      "name": "리보플라빈",
      "unit": "mg",
      "quantity": 0.5
    },
    {
      "name": "비타민C",
      "unit": "mg",
      "quantity": 27.5
    },
    {
      "name": "칼슘",
      "unit": "mg",
      "quantity": 198.8
    },
    {
      "name": "철분",
      "unit": "mg",
      "quantity": 3.3
    }
  ]
  ```


<br />

### 실행 결과

![image](https://github.com/user-attachments/assets/addfac52-e8e1-43aa-b7ee-cd5ee510e716)
