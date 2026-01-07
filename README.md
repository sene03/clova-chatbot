# 적금봇

사용자 응답을 기반으로 적합한 적금 상품을 추천해주는 챗봇 서비스

## Client

-

## Server

Node.js + Express

-   정적 페이지 제공: `public/` 폴더를 정적으로 서빙하고, 루트 경로(`/`) 요청 시 `index.html`을 반환
-   사용자 식별자 발급: `/userId` API에서 랜덤한 사용자 ID를 생성해 클라이언트에 반환
-   Naver Clova Chatbot 연동: `/clova` API에서 클라이언트 메시지를 받아 NCP API 호출, 챗봇 응답을 클라이언트에 반환
-   환경변수 기반 설정: Clova 호출에 필요한 `INVOKE_URL`, `SECRET_KEY` 및 서버 포트(`PORT`)는 `.env` 환경변수로 관리

### 주요 API

-   `GET /`

    -   서비스 메인 페이지(`index.html`) 제공

-   `GET /userId`

    -   랜덤 userId 생성 후 `{ userId }` 형태로 반환

-   `POST /clova`

    -   요청 body의 `message`, `userId`를 받아 Clova Chatbot API 호출 후 응답 반환
    -   에러 발생 시 Clova 응답 코드/메시지를 그대로 전달하거나(응답이 있는 경우), 내부 오류는 500으로 처리

-   `GET /clova/test?message=...`
    -   간단 테스트용 API (쿼리스트링으로 message 입력)

## 시나리오

## 실행 방식
