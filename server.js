// express server
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config(); // 환경변수 불러오기

import { callClovaChatbot } from "./api.js";

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

// 랜덤으로 생성된 사용자 아이디 반환
app.get("/userId", (req, res) => {
    const userId = Math.random().toString(36).slice(2, 10);
    res.json({ userId });
});

// Clova Chatbot API 호출 라우트
app.post("/clova", async (req, res) => {
    /**
     * request body 예시
     * {
     *   "userId": "test_user_001",
     *   "message": "안녕하세요"
     * }
     */
    try {
        const { message, userId } = req.body;

        const result = await callClovaChatbot(message, {
            invokeUrl,
            secretKey,
            userId,
        });

        console.log("챗봇 답변:", result);
        res.json(result);
    } catch (error) {
        console.error("--- 에러 발생 ---");

        if (error.response) {
            console.error("상태 코드:", error.response.status);
            console.error("에러 메시지:", error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(error.message);
            res.status(500).json({ message: "Clova API 호출 실패" });
        }
    }
});

// test api
// body 말고 query로 받기
app.get("/clova/test", async (req, res) => {
    const message = req.query.message;
    const result = await callClovaChatbot(message, {
        invokeUrl,
        secretKey,
        userId: "test_user_001",
    });
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
