
let currentSlideNumber;
let slide_mutex = false;


function init(){
    currentSlideNumber = 0;
    initSocket();
    let pathname = new URL(window.location.href).pathname;
    document.getElementById("navbar").innerHTML = ejs.views_includes_navbar({slides, currentSlideNumber, id, pathname});
    addEventListeners();
    displaySlide();
}

function changeSlide(newSlideNumber){
    // Don't do anything if we're staying on the same slide
    if (newSlideNumber == currentSlideNumber) {
        return;
    }

    if (slide_mutex){
        console.log("Slide mutex is locked, not changing slide");
        return;
    }
    slide_mutex = true;

    leaveSlide();
    currentSlideNumber = newSlideNumber;
    emitChangeSlide(currentSlideNumber);
    /*
    while (slide_mutex) {
        console.log("Waiting for slide_mutex to be released...");
    }
    
    displaySlide(currentSlideNumber);
    slide_mutex = false;
    */
    if (isTeacher) {
        emitChangeSlide(currentSlideNumber);
    }
}

function leaveSlide() {
    /*
    while (slide_mutex) {
        //console.log("Waiting for slide_mutex to be released...");
    }*/

    console.log("Leaving current slide: " + currentSlideNumber);

    // Execute code necessary before leaving the current slide
    slideDefinitions[slides[currentSlideNumber].type].leaveFunction(mergeParams());

    let currentURL = new URL(window.location.href);

    // Update HTML classes in navbar
    document.querySelector(`a[href="${currentURL.pathname}/${currentSlideNumber}"]`).classList.remove("active");
}

function displaySlide() {
    
    console.log("Displaying new slide: " + currentSlideNumber);

    let currentURL = new URL(window.location.href);
    // Update HTML classes in navbar
    document.querySelector(`a[href="${currentURL.pathname}/${currentSlideNumber}"]`).classList.add("active");

    // Update heading and descriptions
    document.getElementById("title").innerHTML = slides[currentSlideNumber].title || slides[currentSlideNumber].name || "";
    document.getElementById("description-before").innerHTML = slides[currentSlideNumber].descriptionBefore || "";
    document.getElementById("description-after").innerHTML = slides[currentSlideNumber].descriptionAfter || "";

    // Display the new slide and execute necessary init code
    slideDefinitions[slides[currentSlideNumber].type].displayFunction(mergeParams());
}

function mergeParams() {
    let customParams = slides[currentSlideNumber].params;
    let result = JSON.parse(JSON.stringify(slideDefinitions[slides[currentSlideNumber].type].defaultParams) || "{}");
    Object.keys(customParams || {}).forEach((key) => {
        result[key] = customParams[key];
    });
    return result;
}

function link_listener(e){
    e.preventDefault();
    let pathname = e.currentTarget.pathname;
    changeSlide(pathname.at(-1));       // The last character in the pathname is the slide number
}

function addEventListeners(){
    document.querySelectorAll("a").forEach(link=>{
        link.removeEventListener("click", link_listener);
        link.addEventListener("click", link_listener);
    });
}



