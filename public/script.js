document.addEventListener("DOMContentLoaded", () => {
    // HTML 다 로드하고 JS를 로드하도록 강제

    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    function getCookie(name) {
        console.log(document.cookie);

        const value = document.cookie
            .split("; ")
            .find((row) => row.startsWith(name + "="));
        return value ? value.split("=")[1] : null;
    }

    function setCookie(name, value, days = 1) {
        const expires = new Date(Date.now() + days * 86400000).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    }

    let currentUserId = "";

    async function initUserId() {
        let myId = getCookie("myUserId");

        if (myId) {
            console.log("기존 ID(쿠키) 사용:", myId);
            currentUserId = myId;
        } else {
            try {
                const response = await fetch("/userId");
                if (!response.ok) throw new Error("userId 발급 실패");

                const data = await response.json();
                myId = data.userId;
                setCookie("myUserId", myId, 1);
                currentUserId = myId;
            } catch (error) {
                console.error("ID 발급 중 에러 발생:", error);
                currentUserId = "temp_user_" + Date.now();
            }
        }

        return myId;
    }

    initUserId();

    // 말풍선 추가
    function renderMessage(text, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}`;

        if (sender === "bot") {
            const logoImg = document.createElement("img");
            logoImg.src = "bot-logo.png";
            logoImg.className = "bot-logo";
            messageDiv.appendChild(logoImg);
        }

        const bubbleDiv = document.createElement("div");
        bubbleDiv.className = "bubble";
        bubbleDiv.textContent = text;

        messageDiv.appendChild(bubbleDiv);
        chatMessages.appendChild(messageDiv);

        scrollToBottom();
    }

    // 항상 스크롤 하단 유지
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 입력 토글 제어
    function toggleInput(isDisabled) {
        userInput.disabled = isDisabled;
        sendBtn.disabled = isDisabled;
    }

    // 로딩 표시
    function showLoading() {
        const loadingDiv = document.createElement("div");
        loadingDiv.id = "loading";
        loadingDiv.className = "message bot";

        const logoImg = document.createElement("img");
        logoImg.src = "bot-logo.png";
        logoImg.className = "bot-logo";

        const bubbleDiv = document.createElement("div");
        bubbleDiv.className = "bubble typing";
        bubbleDiv.textContent = "…";

        loadingDiv.appendChild(logoImg);
        loadingDiv.appendChild(bubbleDiv);
        chatMessages.appendChild(loadingDiv);

        scrollToBottom();
    }

    function hideLoading() {
        const loadingDiv = document.getElementById("loading");
        if (loadingDiv) loadingDiv.remove();
    }

    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        renderMessage(text, "user");
        userInput.value = "";

        toggleInput(true);
        showLoading();

        try {
            const response = await fetch("/clova", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: currentUserId,
                    message: text,
                }),
            });

            const data = await response.json();
            hideLoading();

            // 챗봇 답변 렌더링
            data.texts.forEach((text) => {
                renderMessage(text, "bot");
            });
        } catch (error) {
            console.error("Error:", error);
            hideLoading();
            renderMessage(
                "서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.",
                "bot"
            );
        } finally {
            toggleInput(false);
            userInput.focus();
        }
    }

    // 이벤트 리스너
    if (sendBtn) {
        sendBtn.addEventListener("click", sendMessage);
    }

    if (userInput) {
        userInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    }
});
