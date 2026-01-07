const chatMessages = document.getElementById('chat-messages');
const input = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// 말풍선 추가
function renderMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    if (sender === 'bot'){
        const logoImg = document.createElement('img');
        logoImg.src = 'bot-logo.png'; 
        logoImg.className = 'bot-logo';
        messageDiv.appendChild(logoImg);
    }

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'bubble';
    bubbleDiv.textContent = text;

    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv)

    scrollToBottom();
}

// 로딩
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.className = 'message bot';

    const logoImg = document.createElement('img');
    logoImg.src = 'bot-logo.png';
    logoImg.className = 'bot-logo';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'bubble typing';
    bubbleDiv.textContent = '…';

    loadingDiv.appendChild(logoImg);
    loadingDiv.appendChild(bubbleDiv);

    chatMessages.appendChild(loadingDiv);
    scrollToBottom();
}


function hideLoading() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) chatMessages.removeChild(loadingDiv);
}

// 항상 스크롤 하단 유지
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}



//전송 버튼 클릭
sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) return;

    renderMessage(text, 'user');
    input.value = ''; // 입력창 초기화

    // 답변
    handleBotReply(text);
});

// test용 답변
function handleBotReply(userText) {
    sendBtn.disabled = true; //중복 방지
    showLoading();

    // 추후 수정 예정
    setTimeout(() => {
        hideLoading();
        renderMessage('test 봇 답변입니다.', 'bot');
        sendBtn.disabled = false; //중복 방지 해제
    }, 1000);
}


// Enter 적용
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !sendBtn.disabled) {
        sendBtn.click();
    }
});