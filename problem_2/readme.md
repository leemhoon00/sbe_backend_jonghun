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

<br />

### 실행 결과

![image](https://github.com/user-attachments/assets/addfac52-e8e1-43aa-b7ee-cd5ee510e716)

