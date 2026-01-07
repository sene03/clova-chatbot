const chatMessages = document.getElementById('chat-messages');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 말풍선 추가
function renderMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'bubble';
    bubbleDiv.textContent = text;

    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv);

    scrollToBottom();
}

// 항상 스크롤 하단 유지
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

//전송 버튼 클릭
sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;

    renderMessage(text, 'user'); // 사용자 메시지
    input.value = ''; // 입력창 초기화

    // 테스트용 메시지
    renderMessage('답변입니다.', 'bot');
});

// Enter 적용
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendBtn.click();
});
