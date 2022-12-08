/*
function displaySlideOpenQuestion() {
    let question = "How are you?";
    document.getElementById("content").className = cardClasses;
    document.getElementById("content").innerHTML = ejs.views_slide_open_question({ question });
}
*/

let cardClasses = "d-inline-flex flex-wrap justify-content-start align-items-start p-1 border border-2 border-primary rounded-3 bg-light";
let noClasses = "";

function displaySlideTriangleCube(params) {
    document.getElementById("content").className = cardClasses;
    document.getElementById("content").innerHTML = ejs.views_slide_triangle_cube(params);
    start_slide_triangle_cube(params);
}

// The element starts to be dragged
function boxDragStart(e) {
    // Data is transferred between dragstart and drop events using dataTransfer
    // In this case, it will have a plain text format. The information passed is the id of the option
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.classList.add("bg-dark")      // Add a background color
    e.target.classList.add("text-white")   // Add a text color

    // Remove the background from previous drags
    e.target.classList.remove("bg-white");
    e.target.classList.remove("text-dark");

    setTimeout(() => {      // So that the dragged element is not affected
        e.target.classList.add("bg-white");
        e.target.classList.add("text-white");

        // The original option doesn't react to drag events
        e.target.removeEventListener("dragenter", boxDragEnter);
        e.target.removeEventListener("dragover", boxDragOver);
        e.target.removeEventListener("dragleave", boxDragLeave);
    }, 0);
}

// The element is dragged over an area where it can be dropped 
// e.target is the area 
function boxDragEnter(e) {
    e.preventDefault();     // Make the drop target valid
    e.target.classList.remove("bg-white");
    e.target.classList.add("bg-info");
}

// The element is being dragged over an area where it can be dropped (fires continuously)
// e.target is the area 
function boxDragOver(e) {
    e.preventDefault();     // Make the drop target valid
    e.target.classList.remove("bg-white");
    e.target.classList.add("bg-info");
}

// The element is dragged out of an area where it could have been dropped
// e.target is the area 
function boxDragLeave(e) {
    e.target.classList.remove("bg-info");
    e.target.classList.add("bg-white");
}

// The element is dropped on a target
// e.target is the area 
function boxDrop(e) {
    // Get the id of the option
    let optionId = e.dataTransfer.getData("text/plain");
    let option = document.getElementById(optionId);

    e.preventDefault();

    // Swap the option with the target    
    [e.target.textContent, option.textContent] = [option.textContent, e.target.textContent];

    // Remove the background color and make the element visible
    e.target.classList.remove("bg-info");
}

function boxDragEnd(e) {   // Note that this always fires after stopping the drag, while drop only fires when the element is dropped on a valid target
    e.target.classList.remove("bg-dark")      // Remove the background
    e.target.classList.remove("text-white");
    e.target.classList.add("text-dark");

    e.target.addEventListener("dragenter", boxDragEnter);
    e.target.addEventListener("dragover", boxDragOver);
    e.target.addEventListener("dragleave", boxDragLeave);
}

function displaySlideParametrization() {
    document.getElementById("content").className = cardClasses;
    document.getElementById("content").innerHTML = ejs.views_slide_parametrization({});
    document.querySelectorAll("input[name='param_options']").forEach(input => input.addEventListener("change", showShape));
    document.querySelectorAll(".drop-box.card").forEach(box => {
        box.addEventListener("dragstart", boxDragStart);
        box.addEventListener("dragenter", boxDragEnter);
        box.addEventListener("dragover", boxDragOver);
        box.addEventListener("dragleave", boxDragLeave);
        box.addEventListener("drop", boxDrop);
        box.addEventListener("dragend", boxDragEnd);
    });

    MathJax.typeset();
    showShape();
}

function displaySlidePhongModel(params) {
    document.getElementById("content").className = cardClasses;
    document.getElementById("content").innerHTML = ejs.views_slide_phong_model(params);
    start_slide_phong_model(params);
}

function displaySlideShaders() {
    document.getElementById("content").className = cardClasses;
    document.getElementById("content").innerHTML = ejs.views_slide_custom_shaders({});
    hljs.highlightAll();
    start_slide_custom_shaders();
    document.getElementById("btn-submit-shaders").addEventListener("click", () => {
        window.cancelAnimationFrame(currentSlideInfo.requestID);
        hljs.highlightAll();
        start_slide_custom_shaders();
    });
}

function showShape() {
    threeAPI.initScene();
    let checkedOption = document.querySelector("input[name='param_options']:checked");
    if (checkedOption) {
        let shapeIndex = checkedOption.value;
        threeAPI.createParametricGeometry(threeAPI.presetGeometries[shapeIndex]);
        threeAPI.animate();
    } else {
        threeAPI.clear();
    }
}

function displaySlideMidpoint() {
    document.getElementById("content").className = cardClasses;
    document.getElementById("content").innerHTML = ejs.views_slide_midpoint({});
    startMidpoint();
    addMidpointListeners();
}

function displaySlideImageParameters(params) {
    document.getElementById("content").className = cardClasses;
    document.getElementById("content").innerHTML = ejs.views_slide_image_parameters(params);
    ip_start(
        { azimuthal: -70, polar: 60 },                           // Directional light
        { x: -200, y: 150, z: -40, intensity: 30 },              // Point light
        { azimuthal: -45, polar: 60, distance: 150, fov: 45 },   // Camera
        { gamma: params.target_gamma, tone_mapping_alpha: params.target_alpha, tone_mapping_beta: params.target_beta }
    );
}

function displaySlideCompleteParametrization() {
    document.getElementById("content").className = cardClasses;
    document.getElementById("content").innerHTML = ejs.views_slide_complete_parametrization({});
    threeAPI.initScene();
    threeAPI.clear();
    addCompleteParametrizationListeners();
    // MathJax will change the DOM text, so we need to preload the raw html in the listeners before applying the conversion to latex for the user
    MathJax.typeset();
}

function displayAboutSlide(params) {
    document.getElementById("content").className = noClasses;
    document.getElementById("content").innerHTML = ejs.views_slide_about(params);
    document.querySelectorAll("img").forEach(img => img.addEventListener("click", (event) => {
        document.querySelectorAll("img").forEach(img => {
            if (img !== event.target) {
                img.classList.remove("clicked_image");
            } else {
                img.classList.toggle("clicked_image");
            }
        });
    }));
}

function displayOpenQuestionSlide(params) {
    document.getElementById("content").className = cardClasses;
    let question = "Tell me your most profound thoughts";
    if (isTeacher) {
        document.getElementById("content").innerHTML = ejs.views_teacher_open_answers({});
        let answerContainer = document.getElementById(slideDefinitions[slides[currentSlideNumber].type].answer_container);
        document.querySelector("button[data-action='reset']").addEventListener("click", () => {
            answerContainer.innerHTML = "";     // Remove all child nodes
            enableOpenAnswerButtons(false);
        });
        document.querySelector("button[data-action='send-answers']").addEventListener("click", () => {
            let results = [];
            let answers = [...answerContainer.childNodes];      // Necessary because childNodes is not a true array
            answers.forEach(item => results.push(item.textContent));
            let model = {
                question, 
                results,
                slide: currentSlideNumber
            }
            emitAnswersToStudents(model);
        })
    } else if (params?.model?.isAnswer) {        // The teacher is showing the answers to the students
        document.getElementById("content").innerHTML = ejs.views_teacher_open_answers(params.model);

        let answer_container = document.getElementById(slideDefinitions[slides[currentSlideNumber].type].answer_container);
        params.model.results.forEach(r => {
            let new_item = document.createElement("li");
            let textnode = document.createTextNode(r);
            new_item.appendChild(textnode);
            answer_container.appendChild(new_item);
        })

    } else {
        document.getElementById("content").innerHTML = ejs.views_slide_open_question({ question });
        document.getElementById("student_open_question").addEventListener("submit", (e) => {
            e.preventDefault();
            let answer = document.getElementById("student_open_question").querySelector("textarea").value;
            console.log(answer);
            emitAnswerToTeacher(answer);
        })
    }
}

function enableOpenAnswerButtons(enable) {
    document.querySelectorAll(".enabled-on-answer").forEach(e => {
        if (enable) {
            e.classList.remove("disabled");
            e.disabled = false;
        } else {
            e.classList.add("disabled");
            e.disabled = true;
        }
    })
}


function leaveAndCancelAnimationFrame() {
    // console.log("Canceling animation frame with requestID = " + currentSlideInfo.requestID);
    window.cancelAnimationFrame(currentSlideInfo.requestID);
}
