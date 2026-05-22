# MVP Workflow

## 사용자 흐름
1. 방문자가 홈페이지 진입
2. Hero/서비스 이미지 중심 구성으로 브랜드 인지
3. 예약 CTA 또는 예약 페이지 이동
4. 예약 요청 폼 제출
5. 완료 메시지 확인

## 관리자 흐름
1. `/admin/reservations`에서 예약 목록 확인
2. 상태값 변경(pending/confirmed/cancelled)
3. `/admin/reservations/[id]`에서 상세 확인

## 백엔드 흐름
1. `POST /api/reservations` 요청 수신
2. 입력 검증
3. Prisma로 SQLite 저장
4. 자동화 이벤트 디스패처 호출

## 향후 확장
- `lib/automation/providers`에 채널별 provider 추가
- 관리자 인증 추가
- 예약 시간대 중복 체크, 캘린더 정책 추가
