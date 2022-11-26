const slideFunctions = [
    displaySlideOpenQuestion,
    displaySlideTriangleCube,
    displaySlideParametrization
]

let currentSlide;
let isTeacher = true;

function init(){
    currentSlide = 0;
    initSocket();
    document.getElementById("navbar").innerHTML = ejs.views_includes_navbar({});
    addEventListeners();
    changeSlide(currentSlide);
}

function changeSlide(index){
    slideFunctions[index]();
}

function link_listener(e){
    e.preventDefault();
    console.log("Current slide: " + currentSlide)
    currentSlide = e.currentTarget.pathname[1];
    console.log("Changing to slide: " + currentSlide)
    changeSlide(currentSlide);
    emitChangeSlide(currentSlide);
}

function addEventListeners(){
    document.querySelectorAll("a").forEach(link=>{
        link.removeEventListener("click", link_listener);
        link.addEventListener("click", link_listener);
    });
}



