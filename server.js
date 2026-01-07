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

app.get("/clova/test", async (req, res) => {
    try {
        const message = req.body.message;

        const reply = await callClovaChatbot(message, {
            invokeUrl,
            secretKey,
        });

        console.log("챗봇 답변:", reply);
        res.json({ reply });
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
