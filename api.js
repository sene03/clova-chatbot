import axios from "axios";
import HmacSHA256 from "crypto-js/hmac-sha256.js";
import EncBase64 from "crypto-js/enc-base64.js";

/**
 * Clova Chatbot에 메시지를 보내고 응답 텍스트를 반환
 * @param {string} message - 사용자 메시지
 * @param {object} options - 설정 값들
 */
export async function callClovaChatbot(
    message,
    { invokeUrl, secretKey, userId = "test_user_001" }
) {
    // 1. 요청 바디 구성
    const body = {
        version: "v2",
        userId,
        timestamp: Date.now(),
        bubbles: [
            {
                type: "text",
                data: {
                    description: message,
                },
            },
        ],
        event: "send",
    };

    // 2. 시그니처 생성
    const requestBodyString = JSON.stringify(body);
    const signature = HmacSHA256(requestBodyString, secretKey).toString(
        EncBase64
    );

    // 3. API 호출
    const response = await axios.post(invokeUrl, body, {
        headers: {
            "Content-Type": "application/json;UTF-8",
            "X-NCP-CHATBOT_SIGNATURE": signature,
        },
    });

    // 4. 챗봇 응답 텍스트 반환
    return response.data.bubbles[0].data.description;
}
