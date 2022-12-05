
let currentSlideNumber;

function init(){
    currentSlideNumber = 0;
    initSocket();
    document.getElementById("navbar").innerHTML = ejs.views_includes_navbar({slides, currentSlideNumber, id});
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
    if (isTeacher) {
        emitChangeSlide(currentSlideNumber);
    }
}

function leaveSlide() {
    console.log("Leaving current slide: " + currentSlideNumber);

    // Execute code necessary before leaving the current slide
    slideDefinitions[slides[currentSlideNumber].type].leaveFunction(mergeParams());

    // Update HTML classes in navbar
    document.querySelector(`a[href="/${currentSlideNumber}"]`).classList.remove("active");
}

function displaySlide() {
    
    console.log("Displaying new slide: " + currentSlideNumber);

    // Update HTML classes in navbar
    document.querySelector(`a[href="/${currentSlideNumber}"]`).classList.add("active");

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

//change colors when done
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
    console.log("e.currentTarget.pathname = ", e.currentTarget.pathname);
    changeSlide(e.currentTarget.pathname.substring(1));
}
function addEventListeners(){
    document.querySelectorAll("a").forEach(link=>{
        link.removeEventListener("click", link_listener);
        link.addEventListener("click", link_listener);
    });
}



