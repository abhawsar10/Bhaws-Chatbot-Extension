document.addEventListener('DOMContentLoaded', function () {


    // Refresh the current active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentTab = tabs[0];
        chrome.tabs.reload(currentTab.id);
    });


    const sendButton = document.getElementById('sendButton');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    let allMessages = [];

    if (localStorage.getItem('allMessages')) {
        localStorage.removeItem('allMessages')
    }
    // if (localStorage.getItem('scraped_data')) {
    //     localStorage.removeItem('scraped_data')
    // }
    
    
    document.getElementById('user-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            process_user_message();
        }
    });
    

    sendButton.addEventListener('click', async function () {
        process_user_message();
    });


    async function process_user_message(){

        const userMessage = userInput.value.trim();

        if (userMessage !== '') {

            const context = await JSON.parse(localStorage.getItem('scraped_data'));
            console.log("Data gotten from storage===>",context);

            displayUserMessage(userMessage);
            userInput.value = '';
 
            try {
                document.getElementById('loading-icon').style.display = 'block';
                document.getElementById('normal-icon').style.display = 'none';
                // document.getElementById('normal-icon').style.cssText = 'display:none;';
                // document.getElementById('loading-icon').style.cssText = '';
                const botResponse = await sendUserMessageToAPI(userMessage, allMessages, JSON.stringify(context));  
                
                
                if (isAddToCartIntent(botResponse)) {
                    add_to_cart();
                }
                if (isScrollDownIntent(botResponse)) {
                    scroll_down();
                }
                if (isScrollUpIntent(botResponse)) {
                    scroll_up();
                }
                let scrolltonav = null
                if ( scrolltonav = isScrollToIntent(botResponse)) {
                    scroll_to(scrolltonav);
                }

                displayBotMessage(botResponse);

                // Store all messages array in localStorage
                allMessages.push(userMessage);
                allMessages.push(botResponse);
                localStorage.setItem('allMessages', JSON.stringify(allMessages));

                chatMessages.scrollTop = chatMessages.scrollHeight;




            } catch (error) {
                console.error('An error occurred at loading time:', error);
            } finally {
                document.getElementById('loading-icon').style.display = 'none';
                document.getElementById('normal-icon').style.display = 'block';
                // document.getElementById('loading-icon').style.cssText = 'display:none;';
                // document.getElementById('normal-icon').style.cssText = '';
            }

        }

    }

    // reloadButton.addEventListener('click', function () {
    //     localStorage.removeItem('allMessages');
    //     chatMessages.innerHTML = '';
    //     allMessages = [];
    // });

    // addToCartButton.addEventListener('click', function () {
    //     // add_to_cart()
    //     // scroll_down()
    //     // scroll_up()
    //     scroll_to("specs")
    //     // scroll_to("benefits")
    // });


    function displayUserMessage(message) {
        const userMessage = createMessageElement('user-message', message,"user");
        chatMessages.appendChild(userMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function displayBotMessage(message) {
        const botMessage = createMessageElement('bot-message', message,"bot");
        chatMessages.appendChild(botMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function createMessageElement(className, text,type) {

        const messageElement = document.createElement('div');
        messageElement.classList.add(className);

        const circleDiv = document.createElement('span');
        const textDiv = document.createElement('div');
        textDiv.classList.add('message')
        textDiv.textContent = text;

        if (type=="user"){
            circleDiv.classList.add('user-circle')
            circleDiv.textContent = "YOU";
            messageElement.appendChild(circleDiv);
            messageElement.appendChild(textDiv);
        }
        if (type=="bot"){
            circleDiv.classList.add('bot-circle')
            circleDiv.textContent = "BOT";
            messageElement.appendChild(textDiv);
            messageElement.appendChild(circleDiv);
        }
        // Create a new div for the text content.


        return messageElement;
    }

    async function sendUserMessageToAPI(userMessage,prev_messages,context) {

        let prompt = "";

        prompt += "You are a chatbot for the e-commerce site, Saatva.com, which sells mattresses, frames, pillows, etc \n";

        prompt += "Given the following information, user will ask you some questions about it";
        
        prompt += "Limit answers to 600 characters:\n" + context + "\n";
        
        prompt += "If the user tells you to 'add this item to cart' or 'purchase this item' or anything similar, simply reply 'Added item to cart' \n"

        prompt += "If the user tells you to 'scroll down' or anything similar, simply reply 'Scrolling down...' \n"
        prompt += "If the user tells you to 'scroll up' or anything similar, simply reply 'Scrolling up...' \n"
        prompt += "The webpage has scrollable sections labelled 'Overview', 'Benefits', 'Reviews', 'Specs', 'FAQs' , 'Service'.\n" 
        prompt += "If the user tells you to 'scroll to these sections' or anything similar, simply reply 'Scrolling to <section name>...' \n"


        for (const message of prev_messages){
            prompt += message + "\n";
        }
        prompt += "\n" + "user:" +userMessage;

        console.log(prompt)

        try {
            const response = await fetch('https://bhaws-chatbot-extension.uw.r.appspot.com/generateChatResponse', {
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
        console.log("Data gotten from content and stored===>",message.scraped_data)
        localStorage.setItem('scraped_data', JSON.stringify(message.scraped_data));
    }

});

function isAddToCartIntent(response) {
    
    const addToCartPhrases = ['add to cart','Added item to cart',];
    // return addToCartPhrases.some(phrase => response.toLowerCase().includes(phrase));

    let matchedPhrase = null;

    addToCartPhrases.forEach(phrase => {
        if (response.toLowerCase().includes(phrase.toLowerCase())) {
            matchedPhrase = phrase; // If a match is found, store the phrase
        }
    });

    if (matchedPhrase) {
        console.log('Matched phrase:', matchedPhrase); // Log the matched phrase
        return true;
    }

return false;


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

function isScrollDownIntent(response) {
    
    const addToCartPhrases = ['scrolling down'];
    return addToCartPhrases.some(phrase => response.toLowerCase().includes(phrase));
}

function scroll_down(){

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        chrome.tabs.sendMessage(
            tabs[0].id,
            {action: "scroll_down"},
            function(response) {
                console.log(response.result);
            }
        );

    });
}

function isScrollUpIntent(response) {
    
    const addToCartPhrases = ['scrolling up'];
    return addToCartPhrases.some(phrase => response.toLowerCase().includes(phrase));
}

function scroll_up(){

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        chrome.tabs.sendMessage(
            tabs[0].id,
            {action: "scroll_up"},
            function(response) {
                console.log(response.result);
            }
        );

    });
}

function isScrollToIntent(response) {
    
    const regex = /Scrolling to (\w+)/i;

    // Search for the pattern in the response
    const match = response.match(regex);

    if (match) {
        if(match[1].toLowerCase()=="faqs"){
            return "specs"
        }
        return match[1];
    } else {
        return null;
    }

}

function scroll_to(scroll_to_nav){

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        chrome.tabs.sendMessage(
            tabs[0].id,
            {action: "scroll_to",scroll_to_nav:scroll_to_nav},
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