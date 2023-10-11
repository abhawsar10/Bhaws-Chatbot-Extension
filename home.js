document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('sendButton');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    sendButton.addEventListener('click', function () {
        const userMessage = userInput.value.trim();

        if (userMessage !== '') {
            displayUserMessage(userMessage);

            const botResponse = getchatbotresponse(userMessage);
            console.log(botResponse)
            displayBotMessage(botResponse);

            userInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });

    function displayUserMessage(message) {
        const userMessage = createMessageElement('user-message', `You: ${message}`);
        chatMessages.appendChild(userMessage);
    }

    function displayBotMessage(message) {
        const botMessage = createMessageElement('bot-message', `Bhaws Chatbot: ${message}`);
        chatMessages.appendChild(botMessage);
    }

    function createMessageElement(className, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add(className);
        messageElement.textContent = text;
        return messageElement;
    }

    function getchatbotresponse(userMessage) {
        
        return "hi"
    }
    
});


