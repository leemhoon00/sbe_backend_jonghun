## 문제 3

여러 단계의 승인 및 반려가 가능한 결재 시스템을 구축하는 시나리오에서,

1. 필요한 테이블을 최소한으로 정의해 주세요.
2. 특정 사용자가 처리해야 할 결재 건을 나열하는 쿼리를 작성해 주세요.

## Solution

- 데이터베이스: PostgreSQL
- ERD: [https://dbdiagram.io/d/68037de91ca52373f5913b6a](https://dbdiagram.io/d/68037de91ca52373f5913b6a)

#### 테이블 생성 쿼리

```sql
-- 유저 테이블 (결재를 담당하는 유저)
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- 문서 테이블
CREATE TABLE "document" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL, -- ('processing', 'approved', 'rejected')
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- 결재 프로세스 테이블
CREATE TABLE "document_process" (
    "id" UUID NOT NULL,
    "manager_id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "step" INTEGER NOT NULL, -- 결재 단계
    "status" TEXT NOT NULL, -- ('pending', 'approved', 'rejected')
    "comment" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "document_process_pkey" PRIMARY KEY ("id")
);

ALTER TABLE
    "document_process"
ADD
    CONSTRAINT "document_process_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE
    "document_process"
ADD
    CONSTRAINT "document_process_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

**설계 의도**

- `user`
  - 결재를 담당하는 유저 정보를 저장합니다.
- `document`
  - 결재를 요청하는 문서 정보를 저장합니다.
  - `status` 컬럼은 상세한 상태가 아닌 문서의 최종 상태를 나타냅니다.
- `document_process`
  - 결재 프로세스 정보를 저장합니다.
  - `document` 테이블만 있어도 대부분의 정보를 저장할 수 있지만 프로세스 별로 담당자가 다를 수 있다거나, 반려 및 승인되었던 모든 프로세스에 대해 기록을 남겨야 할 수 있기에 테이블을 따로 빼서 구성했습니다.

#### 특정 사용자가 처리해야 할 결재 건을 나열하는 쿼리

```sql
SELECT
    d.id AS document_id,
    d.title AS document_title,
    dp.step AS process_step,
    dp.status AS process_status
FROM
    document_process dp
JOIN
    document d ON dp.document_id = d.id
WHERE
    dp.manager_id = '특정 유저 ID'
    AND dp.status = 'pending';
```
