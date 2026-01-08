# 💬 NCP CLOVA Chatbot 실습

NCP CLOVA Chatbot(Custom API)를 활용한 웹 기반 채팅 UI

사용자에게 적합한 적금 상품을 추천



## 📌 주요 특징

### Tech Stech
- Node.js + Express
- HTML/CSS/JS



## 🏗️ 전체 아키텍처

```
[ Web Frontend ]
      │
      │  POST /clova
      ▼
[ Express Server ]
      │
      │  NCP Custom API (send)
      ▼
[ CLOVA Chatbot ]
```

---

## 챗봇 시나리오

<img width="400" height="800" alt="image" src="https://github.com/user-attachments/assets/4323a13e-57e7-4951-89d8-a5aecf5f120e" />



## API 명세


### 엔드포인트

- POST /clova
  - 메시지 통신
  
- POST /userId
  - 랜덤으로 생성된 사용자 아이디 반환


### 📥 Request

```json
{
  "userId": "test_user_001",
  "message": "안녕하세요"
}
```


### 📤 Response

```json
{
  "userId": "test_user_001",
  "timestamp": 1767764964224,
  "texts": [
    "잘 선택했습니다!",
    "다음 항목을 선택해주세요."
  ],
  "choices": [
    {
      "label": "6개월",
      "payload": "_T_UnexpiredForm␞112329␞0"
    },
    {
      "label": "12개월",
      "payload": "_T_UnexpiredForm␞112329␞1"
    }
  ],
  "imageUrl": "https://clovachatbot.ncloud.com/xxx",
  "actionUrl": null
}
```


1. `texts`

   * 순서대로 채팅 메시지로 렌더링
2. `choices`

   * 버튼으로 렌더링
   * 클릭 시 payload(버튼 id)를 message에 담아서 전송
3. `imageUrl`

   * 존재하면 메시지 위/아래에 이미지 카드로 표시
4. `actionUrl`

   * 존재 시 외부 이동 버튼 등으로 활용 가능



## ⏱️ 챗봇 메시지 렌더링 UX

* 첫 메시지: 즉시 출력
* 이후 메시지:

  * 로딩 풍선 표시
  * 일정 시간 지연
  * 메시지 출력


## 🎨 UI 특징

* 모바일 우선 디자인
* 태블릿/웹에서는 max-width 기반 중앙 정렬
* 채팅 영역과 입력 영역 분리
* 로딩 풍선으로 챗봇 응답 대기 상태 표현



## 🚀 실행 방법

```bash
npm install
npm start
```


