let currentSlideNumber;
let isTeacher = true;

function init(){
    currentSlideNumber = 0;
    initSocket();
    document.getElementById("navbar").innerHTML = ejs.views_includes_navbar({slides, currentSlideNumber});
    addEventListeners();
    slides[currentSlideNumber].displayFunction();
}

function changeSlide(newSlideNumber){

    // Don't do anything if we're staying on the same slide
    if (newSlideNumber == currentSlideNumber) {
        return;
    }

    // Update HTML classes in navbar
    document.querySelector(`a[href="${currentSlideNumber}"]`).classList.remove("active");
    document.querySelector(`a[href="${newSlideNumber}"]`).classList.add("active");
    
    // Execute code necessary before leaving the current slide
    console.log("Leaving current slide: " + currentSlideNumber);
    slides[currentSlideNumber].leaveFunction();

    // Display the new slide and execute necessary init code
    currentSlideNumber = newSlideNumber;
    console.log("Displaying new slide: " + currentSlideNumber);
    slides[currentSlideNumber].displayFunction();
    emitChangeSlide(currentSlideNumber);
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



