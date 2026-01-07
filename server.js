// express server
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config(); // 환경변수 불러오기

import HmacSHA256 from "crypto-js/hmac-sha256.js";
import EncBase64 from "crypto-js/enc-base64.js";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY;
const invokeUrl = process.env.INVOKE_URL;

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "." });
});

app.get("/clova/test", async (req, res) => {
    // req.body: 클라이언트에서 보낸 데이터

    // 1. 요청 바디 구성 (NCP 스펙 준수)
    const body = {
        version: "v2",
        userId: "test_user_001", // 사용자 식별 ID
        timestamp: Date.now(),
        bubbles: [
            {
                type: "text",
                data: {
                    description: "방구", // 보낼 메시지
                },
            },
        ],
        event: "send",
    };

    // 2. 요청헤더 설정 (X-NCP-CHATBOT-SIGNATURE)
    const requestBodyString = JSON.stringify(body);
    const signatureHeader = HmacSHA256(requestBodyString, secretKey).toString(
        EncBase64
    );

    // 3. Axios를 이용한 HTTP POST 요청
    try {
        const response = await axios.post(invokeUrl, body, {
            headers: {
                "Content-Type": "application/json;UTF-8",
                "X-NCP-CHATBOT_SIGNATURE": signatureHeader,
            },
        });

        console.log("--- 챗봇 응답 성공! ---");
        // 응답 데이터에서 챗봇의 답변 텍스트만 추출
        const replyText = response.data.bubbles[0].data.description;
        console.log("챗봇 답변:", replyText);

        // 클라이언트에 응답 전송
        res.json({ reply: replyText });
    } catch (error) {
        console.error("--- 에러 발생 ---");
        if (error.response) {
            console.error("상태 코드:", error.response.status);
            console.error("에러 메시지:", error.response.data);
        } else {
            console.error(error.message);
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
