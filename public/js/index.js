let currentSlideNumber;
let isTeacher = true;

function init(){
    currentSlideNumber = 0;
    initSocket();
    document.getElementById("navbar").innerHTML = ejs.views_includes_navbar({});
    addEventListeners();
    slides[currentSlideNumber].displayFunction();
}

function changeSlide(slideNumber){
    console.log("Leaving current slide: " + currentSlideNumber);
    slides[currentSlideNumber].leaveFunction();

    currentSlideNumber = slideNumber;

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
