const slides = [
    ejs.views_slide({}),
    ejs.views_slide_alpha({}),
    ejs.views_slide_beta({})
]

let currentSlide;
let isTeacher = true;


function init(){
    currentSlide = 0;
    initSocket();
    changeSlide(currentSlide);
}

function changeSlide(index){
    document.querySelector("body").innerHTML = slides[index];
    //document.getElementById("navbar").innerHTML = ejs.views_includes_navbar({});
    addEventListeners();
}

function addEventListeners(){
    document.querySelector("button").addEventListener("click", () => {
        console.log("Current slide" + currentSlide)
        currentSlide = (currentSlide + 1) % slides.length;
        console.log("Current slide after" + currentSlide)
        changeSlide(currentSlide);
        emitChangeSlide(currentSlide);
    });
}