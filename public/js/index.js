let currentSlideNumber;
let isTeacher = true;

function init(){
    currentSlideNumber = 0;
    initSocket();
    document.getElementById("navbar").innerHTML = ejs.views_includes_navbar({slides, currentSlideNumber});
    addEventListeners();
    displaySlide();
}

function changeSlide(newSlideNumber){

    // Don't do anything if we're staying on the same slide
    if (newSlideNumber == currentSlideNumber) {
        return;
    }

    leaveSlide();
    currentSlideNumber = newSlideNumber;
    displaySlide(currentSlideNumber);
    emitChangeSlide(currentSlideNumber);
}

function leaveSlide() {
    console.log("Leaving current slide: " + currentSlideNumber);

    // Execute code necessary before leaving the current slide
    slideFunctions[slides[currentSlideNumber].slideType].leaveFunction(slides[currentSlideNumber].parameters);

    // Update HTML classes in navbar
    document.querySelector(`a[href="${currentSlideNumber}"]`).classList.remove("active");
}

function displaySlide() {
    
    console.log("Displaying new slide: " + currentSlideNumber);

    // Update HTML classes in navbar
    document.querySelector(`a[href="${currentSlideNumber}"]`).classList.add("active");

    // Update heading and descriptions
    document.getElementById("title").innerHTML = slides[currentSlideNumber].title || slides[currentSlideNumber].name || "";
    document.getElementById("description-before").innerHTML = slides[currentSlideNumber].descriptionBefore || "";
    document.getElementById("description-after").innerHTML = slides[currentSlideNumber].descriptionAfter || "";

    // Display the new slide and execute necessary init code
    slideFunctions[slides[currentSlideNumber].slideType].displayFunction(slides[currentSlideNumber].parameters);
}

function link_listener(e){
    e.preventDefault();
    changeSlide(e.currentTarget.pathname[1]);
}
function addEventListeners(){
    document.querySelectorAll("a").forEach(link=>{
        link.removeEventListener("click", link_listener);
        link.addEventListener("click", link_listener);
    });
}



