
document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('sendButton');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    sendButton.addEventListener('click', function () {
        const userMessage = userInput.value.trim();

        if (userMessage !== '') {
            // Create and display the user message
            displayUserMessage(userMessage);

            // Simulate a bot response (you can replace this with real chatbot logic)
            const botResponse = getBotResponse(userMessage);
            displayBotMessage(botResponse);

            // Clear the user's input field
            userInput.value = '';

            // Scroll to the bottom of the chat container
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

    function getBotResponse(userMessage) {
        // Simulate bot responses (you can replace this with real chatbot logic)
        switch (userMessage.toLowerCase()) {
            case 'hello':
                return 'Hello! How can I assist you?';
            case 'how are you?':
                return 'I am just a chatbot, but I am here to help!';
            default:
                return 'I do not understand. Please ask another question.';
        }
    }
});
