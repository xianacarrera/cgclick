
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
    if (newSlideNumber == currentSlideNumber) return;
    if (slide_mutex) return;

    slide_mutex = true;

    leaveSlide();
    currentSlideNumber = newSlideNumber;

    if (isTeacher) {
        emitChangeSlide(currentSlideNumber);
    } else {
        displaySlide();
        slide_mutex = false;
    }
}

function leaveSlide() {
    // Execute code necessary before leaving the current slide
    slideDefinitions[slides[currentSlideNumber].type].leaveFunction(mergeParams());

    let currentURL = new URL(window.location.href);

    // Update HTML classes in navbar
    document.querySelector(`a[href="${currentURL.pathname}/${currentSlideNumber}"]`).classList.remove("active");
}

function displaySlide() {
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
    changeSlide(e.currentTarget.pathname.split("/").pop());     // Get last element of path
}

function addEventListeners(){
    document.querySelectorAll("a").forEach(link=>{
        link.removeEventListener("click", link_listener);
        link.addEventListener("click", link_listener);
    });
}


