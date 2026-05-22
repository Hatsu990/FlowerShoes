# FlowerShoes MVP (홍천 꽃신)

홍천 꽃신 예약 시스템 MVP입니다.

현재 범위:
- 이미지 중심 랜딩 페이지
- 예약 요청 폼
- Turso DB(libSQL) 저장
- 관리자 예약 목록/상세/상태 변경
- 추후 자동화 확장을 위한 이벤트 디스패처 구조

## 기술 스택
- Next.js (App Router)
- TypeScript
- Turso (libSQL)
- @libsql/client

## 환경 변수
`.env` 파일에 아래 값이 필요합니다.

```env
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

`DATABASE_URL`은 사용하지 않습니다. (Prisma 미사용)

## Vercel 환경 변수 (Production/Preview)
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

## 빠른 시작
1) 의존성 설치
```bash
npm install
```

2) 예약 테이블 생성
```bash
npm run db:init
```

3) 샘플 데이터(선택)
```bash
npm run db:seed
```

4) 개발 서버 실행
```bash
npm run dev
```

브라우저:
- 홈: `http://localhost:3000`
- 예약 페이지: `http://localhost:3000/reserve`
- 관리자: `http://localhost:3000/admin/reservations`

## 주요 스크립트
- `npm run dev`: 개발 서버
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 서버
- `npm run db:init`: Turso 예약 테이블/인덱스 생성
- `npm run db:seed`: 샘플 예약 데이터 생성

## 폴더 구조
- `app/`: 페이지 + API 라우트
- `components/`: UI 컴포넌트
- `lib/db`: Turso 클라이언트 + 스키마/초기화
- `lib/reservations`: 예약 도메인 로직(검증/서비스/저장소)
- `lib/automation`: 자동화 이벤트 확장 포인트
- `scripts/`: DB 초기화/시드 스크립트
- `docs/`: 기획/디자인 참고 문서
- `assets/image-pool/raw`: 실제 이미지 에셋 투입 폴더

## 자동화 확장 포인트
`lib/automation`에 이벤트 디스패처가 들어있습니다.
현재는 콘솔 provider만 연결돼 있고, 추후 아래를 provider로 추가할 수 있습니다.
- 카카오 알림
- SMS
- 이메일
- 관리자 알림

## 주의
- 현재는 디자인 에셋 없이 placeholder 기반으로 구현되어 있습니다.
- 이미지 투입 시 `assets/image-pool/raw`와 `assets/image-pool/image-notes.md`를 기준으로 교체하면 됩니다.