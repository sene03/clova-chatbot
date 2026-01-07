document.addEventListener('DOMContentLoaded', () => {
//HTML 다 로드하고 JS를 로드하도록 강제

    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    function generateRandomId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    function getCookie(name){
        console.log(document.cookie);
        
        const value = document.cookie
            .split('; ')
            .find(row => row.startsWith(name + '='));
        return value ? value.split('=')[1] : null;
    }

    function setCookie(name, value, days = 1){
        const expires = new Date(Date.now() + days * 86400000).toUTCString();
        document.cookie = `${name}=${value}; expires=${expires}; path=/`;
    }

    function initUserId() {
        let myId = getCookie('myUserId');
        
        if (!myId) {
            myId = generateRandomId();
            setCookie('myUserId', myId, 1);
            console.log("유저아이디 생성 :", myId);
        } else {
            console.log("유저아이디 재사용 :", myId);
        }
        
        return myId;
    }


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

    // 토글 제어
    function toggleInput(isDisabled) {
        userInput.disabled = isDisabled;
        sendBtn.disabled = isDisabled;
    }

    const currentUserId = initUserId();

    async function sendMessage(){
        const text = userInput.value.trim();

        if(!text) return; //빈 내용 실행 안함

        //사용자 메시지 추가하는 함수
        renderMessage(text, 'user');
        userInput.value = '';

        //로딩 시작 + 버튼 잠금
        //uiSetLoading(true);
        toggleInput(true);

        try{
            //백엔드 서버로 요청 보내기
            const response = await fetch('/clova/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                     userId: currentUserId,
                     message: text 
                 })
            });
            

            if(!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            // //mock 데이터
            // const data = {
            //     reply: "백엔드 서버 준비중..."
            // }
            
            // const botReply = data.reply || "답변을 가져올 수 없습니다";

            renderMessage(botReply, 'bot');

            } catch (error) {
                console.error('Error:', error);
                renderMessage("서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.", 'bot');
            } finally {
                //uiSetLoading(false);
                toggleInput(false);
                userInput.focus();
            }

        }

    
    //이벤트 리스너
    if (sendBtn) {
        // [수정] clcik -> click 오타 수정
        sendBtn.addEventListener('click', sendMessage);
    }

    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

});