# MVP Requirements Snapshot

## 목표
- 홍천 꽃신을 소개하는 랜딩 홈페이지
- 예약 접수와 관리자 확인이 가능한 작동형 MVP
- 추후 자동화 기능 확장이 쉬운 구조

## 포함 범위
- Hero / 소개 / 서비스 / 예약 CTA / 위치문의 / Footer
- 예약 입력: 이름, 연락처, 날짜, 시간, 인원 수, 요청사항
- 제출 완료 메시지
- 관리자 목록/상세/상태값(pending/confirmed/cancelled)

## 비포함 범위
- 실제 디자인 이미지 반영
- 외부 결제/알림 API 실연동
- 관리자 인증/권한 시스템

## 기술 선택 근거
- Next.js: 페이지+API를 한 저장소에서 빠르게 구현
- Prisma+SQLite: 빠른 로컬 MVP 데이터 저장
- TypeScript: 확장 및 유지보수 안정성
