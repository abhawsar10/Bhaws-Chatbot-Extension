function findButtonByText(text) {
    
    let buttons = document.querySelectorAll('button');
    for (let button of buttons) {
        if (button.textContent.includes(text)) {
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



chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action == "add_to_cart") {
        add_to_cart();
        sendResponse({result: "success"});
      }
    }
);
