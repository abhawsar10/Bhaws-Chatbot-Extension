document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.getElementById('sendButton');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    let allMessages = [];

    if (localStorage.getItem('allMessages')) {
        localStorage.removeItem('allMessages')
    }
    if (localStorage.getItem('scraped_data')) {
        localStorage.removeItem('scraped_data')
    }
    
    
    

    sendButton.addEventListener('click', async function () {
        const userMessage = userInput.value.trim();

        if (userMessage !== '') {

            const context = await JSON.parse(localStorage.getItem('scraped_data') || '""');
            console.log(context);

            displayUserMessage(userMessage);
            const botResponse = await sendUserMessageToAPI(userMessage,allMessages,JSON.stringify(context));
            if (isAddToCartIntent(botResponse)) {
                // Call the add_to_cart function
                add_to_cart();
                // return 'The item has been added to your cart.';
            }
            displayBotMessage(botResponse);

            // Store all messages array in localStorage
            allMessages.push(userMessage);
            allMessages.push(botResponse);
            localStorage.setItem('allMessages', JSON.stringify(allMessages));

            userInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });


    reloadButton.addEventListener('click', function () {
        localStorage.removeItem('allMessages');
        chatMessages.innerHTML = '';
        allMessages = [];
    });

    addToCartButton.addEventListener('click', function () {
        add_to_cart()
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

    async function sendUserMessageToAPI(userMessage,prev_messages,context) {

        let prompt = "";
        prompt += "Given this information, user will ask you some questions about it:\n" + context +"\n"
        
        prompt += "If the user tells you to 'add this item to cart' or 'purchase this item' or anything similar, simply reply 'Added item to cart' \n"


        for (const message of prev_messages){
            prompt += message + "\n";
        }
        prompt += "\n" + "user:" +userMessage;

        console.log(prompt)

        try {
            const response = await fetch('http://localhost:3000/generateChatResponse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_msg: prompt })
            });

            if (response.ok) {
                const data = await response.json();
                return data.message;
            } else {
                console.error('Error sending message to API');
                return 'Error occurred while processing your request.';
            }
        } catch (error) {
            console.error('Error sending message to API', error);
            return 'Error occurred while processing your request.';
        }
    }
    
});


chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {

    if (message.url_to_crawl) {
        const url_to_crawl = message.url_to_crawl;
        console.log("URL to Crawl=======", url_to_crawl);
        let filtered_data = await scrape_data(url_to_crawl)
        console.log("Scraped Data=======", filtered_data);
    }

    if(message.scraped_data){
        console.log("Data gotten from site========",message.scraped_data)
        localStorage.setItem('scraped_data', JSON.stringify(message.scraped_data));
    }

});

function isAddToCartIntent(response) {
    
    const addToCartPhrases = ['add to cart','Added item to cart','add','cart', 'purchase', 'buy', 'order'];
    return addToCartPhrases.some(phrase => response.toLowerCase().includes(phrase));
}

function add_to_cart(){

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        chrome.tabs.sendMessage(
            tabs[0].id,
            {action: "add_to_cart"},
            function(response) {
                console.log(response.result);
            }
        );

    });
}


async function scrape_data(url_to_crawl){
    
    try {
        const response = await fetch('http://localhost:3000/scrape_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url_to_crawl: url_to_crawl })
        });

        if (response.ok) {
            const data = await response.json();
            return data.filtered_data;
        } else {
            console.error('Error sending message to API');
            return 'Error occurred while processing your request.';
        }
    } catch (error) {
        console.error('Error sending message to API', error);
        return 'Error occurred while processing your request.';
    }

}