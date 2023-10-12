function scrape_data() {

    let scrape_data = {}

    //Title
    const titleElement = document.querySelector('h1'); // Selects the first h1 element found on the page
    const title = titleElement?.innerText || ""; // Extracts the text content of the product title
    scrape_data["title"] = title

    //Price
    const priceElement = document.querySelector('[data-selector="final-price"]');
    const price = priceElement?.innerText || ""; 
    scrape_data["sale price"] = price
    
    //Old price
    const strpriceElement = document.querySelector('[data-selector="strikethrough-price"]');
    const strprice = strpriceElement?.innerText || price;
    scrape_data["old price"] = strprice

    //Description
    const  descElement = document.querySelector('[class*="__shortDescription"]');
    const  desc = descElement?.innerText || "";
    scrape_data["description"] = desc

    //Rating
    const ratingElement = document.querySelector('.yotpo-bottomline .sr-only');
    const  rating = ratingElement?.innerText || "";
    scrape_data["rating"] = rating

    //No of Reviews
    const noofreviewsElement = document.querySelector('.yotpo-bottomline .text-m');
    const  noofreviews = noofreviewsElement?.innerText || "";
    scrape_data["no. of reviews"] = noofreviews
    
    //Won awards?
    const awardElement = document.querySelector('.u-hidden--lg-down u-marginLeft--2xs');
    scrape_data["award winning"] = noofreviewsElement ? true :  false

    
    //Sizes available
    let sizes = [];
    let sizeElements = document.querySelectorAll('.productPanel__toggles--size .formToggle');
    sizeElements.forEach(element => {
        sizes.push(element.innerText.trim());
    });
    sizeElements = document.querySelectorAll('.dropdown-module__dropdown-154 li > div > span:first-child');
    sizeElements.forEach(element => {
        sizes.push(element.innerText.trim());
    });
    scrape_data["Sizes available"] = sizes


    //extrafeatures
    let extrafeatures = [];
    var items = document.querySelector('#delivery').querySelectorAll('.deliveryAndSetup__item');
    items.forEach(function(item) {
        var title = item.querySelector('h3').textContent; // get the text content of the h3 element
        var link = item.querySelector('a').getAttribute('href'); // get the value of the href attribute from the a element
        extrafeatures.push({"Feature":title, "Learn More":"saatva.com"+link})
    });
    scrape_data["Extra Features"] = extrafeatures


    //reviews
    var reviews = [];
    var reviewElements = document.querySelectorAll('.content-review');
    reviewElements.forEach(function(element) {
        reviews.push(element.innerText.trim());
    });
    scrape_data["Reviews"] = reviews


    //FAQs
    var faqs = [];
    var faqsElements = document.querySelectorAll('.specsFaqsAccordion__item');
    faqsElements.forEach(function(element) {

        var question = element.querySelector('.specsFaqsAccordion__title').innerHTML
        var answer = element.querySelector('.specsFaqsAccordion__description').innerHTML
        faqs.push({"Question":question,"Answer":answer});

    });
    scrape_data["Frequently Asked Questions"] = faqs


    //Additional Info
    var info = []
    // dataStreamLongDescription
    var infoElement = document.querySelector('.dataStreamLongDescription');

    if (infoElement){
        var infoElement1 = infoElement.querySelectorAll("p");
        infoElement1.forEach(function(element) {
            info.push(element.innerHTML);
        });
        var infoElement2 = infoElement.querySelectorAll("li");
        infoElement2.forEach(function(element) {
            info.push(element.innerHTML);
        });
        scrape_data["Additional Info"] = info
    }



    console.log(scrape_data)
    return scrape_data
} 



function senddata(data){
    chrome.runtime.sendMessage({ scrape_data: data});
}




data = scrape_data()
senddata(data)