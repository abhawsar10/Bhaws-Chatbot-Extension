function findButtonByText(text) {
    
    let buttons = document.querySelectorAll('button');
    for (let button of buttons) {
        if (button.textContent.includes(text)) {
            return button;
        }
    }
    return null;
}

function findNavButtonByText(text) {
    
    let buttons = document.querySelectorAll('.contentNav__link');
    for (let button of buttons) {
        if (button.querySelector('span').textContent.toLowerCase().includes(text.toLowerCase())) {
            return button;
        }   
    }
    return null;
}

function add_to_cart(){

    let text = 'Add 1 Item to Cart'
    let addToCartButton = findButtonByText(text);

    if (addToCartButton) {
        console.log("I clicked the button", addToCartButton.innerHTML);
        addToCartButton.click();
    }else{
        console.error('Add-to-cart button not found');
    }

}

function scrolldown(){

    window.scrollBy({
        top: window.innerHeight,
        left: 0, 
        behavior: 'smooth'
    });
}

function scrollup(){

    window.scrollBy({
        top: -window.innerHeight,
        left: 0, 
        behavior: 'smooth'
    });
}

function scrollto(scrolltonav){

    let navButton = null;
    
    navButton = findNavButtonByText(scrolltonav);

    console.log("found this element ",navButton)
    if (navButton!==null){
        navButton.click();
    }else{
        scrolldown();
    }

}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

      if (request.action == "add_to_cart") {
        add_to_cart();
        sendResponse({result: "Successfully Added to cart"});
      }
      if (request.action == "scroll_down") {
        scrolldown();
        sendResponse({result: "Successfully Scrolled Down"});
      }
      if (request.action == "scroll_up") {
        scrollup();
        sendResponse({result: "Successfully Scrolled Up"});
      }
      if (request.action == "scroll_to") {
        scrollto(request.scroll_to_nav);
        sendResponse({result: "Successfully Scrolled To Nav"});
      }

    }
    
);
