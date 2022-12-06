
let currentSlideNumber;
let slide_mutex = false;
var isFollowing = true;

function init(){
    currentSlideNumber = 0;
    initSocket();
    let pathname = new URL(window.location.href).pathname;
    document.getElementById("navbar").innerHTML = ejs.views_includes_navbar({slides, currentSlideNumber, id, pathname});
    if (!isTeacher) {
        document.getElementById('follow').addEventListener('change', () => {
            isFollowing = document.getElementById('follow').checked
            if (isFollowing) login()
        })
    }
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
    displayEval(slideDefinitions[slides[currentSlideNumber].type].evaluation || "no_eval");

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

function displayEval(eval_type){
    let q = document.getElementById("question_type");
    try {
        if(eval_type == "auto"){
            q.classList.remove("text-success");
            q.classList.remove("text-secondary");
            q.classList.add("text-primary");
            q.setAttribute("title","Automatically evaluated");
        }
        else if(eval_type == "teacher"){
            q.classList.remove("text-primary");
            q.classList.remove("text-secondary");
            q.classList.add("text-success");
            q.setAttribute("title","Evaluated by the teacher");
        }
        else if(eval_type == "no_eval"){
            q.classList.remove("text-primary");
            q.classList.remove("text-success");
            q.classList.add("text-secondary");
            q.setAttribute("title","No evaluation");
        }
        else{
            throw "Invalid evalution type";
        }
    } catch (error) {
        console.error(error);
        q.setAttribute("title","");
    }
    
}

function link_listener(e){
    e.preventDefault();
    if (!isFollowing) {
        changeSlide(e.currentTarget.pathname.split("/").pop());     // Get last element of path
    }
}

function addEventListeners(){
    document.querySelectorAll("a").forEach(link=>{
        link.removeEventListener("click", link_listener);
        link.addEventListener("click", link_listener);
    });
}


