const slides = [
    "<p>Hello World 1!</p><button>Go to slide 2</button>",
    "<p>Hello World 2!</p><button>Go to slide 3</button>",
    "<p>Hello World 3!</p><button>Go to slide 1</button>"
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