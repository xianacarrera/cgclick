
let currentSlideNumber;
let slide_mutex = false;
var isFollowing = true;

function init(){
    currentSlideNumber = 0;
    initSocket();
    let pathname = new URL(window.location.href).pathname;
    document.getElementById("navbar").innerHTML = ejs.views_includes_navbar({slides, currentSlideNumber, id, pathname});
    document.getElementById("statusbar").innerHTML = ejs.views_includes_statusbar({id, pathname});
    if (!isTeacher) {
        document.getElementById('follow').addEventListener('change', () => {
            isFollowing = document.getElementById('follow').checked
            if (isFollowing) login(readonly = true)
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

function displaySlide(model) {
    let currentURL = new URL(window.location.href);
    // Update HTML classes in navbar
    document.querySelector(`a[href="${currentURL.pathname}/${currentSlideNumber}"]`).classList.add("active");

    // Update heading and descriptions
    document.getElementById("title").innerHTML = slides[currentSlideNumber].title || slides[currentSlideNumber].name || "";
    document.getElementById("description-before").innerHTML = slides[currentSlideNumber].descriptionBefore || "";
    document.getElementById("description-after").innerHTML = slides[currentSlideNumber].descriptionAfter || "";
    displayEval(slideDefinitions[slides[currentSlideNumber].type].evaluation || "no_eval");

    // Display the new slide and execute necessary init code
    let params = mergeParams();
    if (model) params.model = model;
    slideDefinitions[slides[currentSlideNumber].type].displayFunction(params);
}

function mergeParams() {
    let customParams = slides[currentSlideNumber].params;
    let result = JSON.parse(JSON.stringify(slideDefinitions[slides[currentSlideNumber].type].defaultParams) || "{}");
    Object.keys(customParams || {}).forEach((key) => {
        result[key] = customParams[key];
    });
    return parseStringParams(result);
}

function parseStringParams(params) {
    if (params.canvas_size == "tiny") {
        params.canvas_width = 150;
        params.canvas_height = 150;
    } else if (params.canvas_size == "small") {
        params.canvas_width = 300;
        params.canvas_height = 300;
    } else if (params.canvas_size == "medium") {
        params.canvas_width = 450;
        params.canvas_height = 450;
    } else if (params.canvas_size == "large") {
        params.canvas_width = 600;
        params.canvas_height = 600;
    } else if (params.canvas_size == "huge") {
        params.canvas_width = 750;
        params.canvas_height = 750;
    }
    
    if (params.canvas_size != "exact" && slideDefinitions[slides[currentSlideNumber].type].double_canvas) {
        params.canvas_width *= 2;
    }
    return params;
}

function displayEval(eval_type){
    let q = document.getElementById("question_type");
    try {
        if(eval_type == "auto"){
            q.classList.remove("text-danger");
            q.classList.remove("text-secondary");
            q.classList.add("text-primary");
            q.setAttribute("title","This slide is evaluated automatically");
        }
        else if(eval_type == "teacher"){
            q.classList.remove("text-primary");
            q.classList.remove("text-secondary");
            q.classList.add("text-danger");
            q.setAttribute("title","This slide is evaluated by the teacher");
        }
        else if(eval_type == "no_eval"){
            q.classList.remove("text-primary");
            q.classList.remove("text-danger");
            q.classList.add("text-secondary");
            q.setAttribute("title","This slide is not evaluated at all");
        }
        else{
            throw "Invalid evalution type";
        }
        // Initialize tooltips
        [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        });
    } catch (error) {
        console.error(error);
        q.setAttribute("title","");
    }
    
}

function link_listener(e){
    e.preventDefault();
    if (!isFollowing || isTeacher) {
        changeSlide(e.currentTarget.pathname.split("/").pop());     // Get last element of path
    }
}

function addEventListeners(){
    document.querySelectorAll("a").forEach(link=>{
        link.removeEventListener("click", link_listener);
        link.addEventListener("click", link_listener);
    });
}


