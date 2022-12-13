// let cardClasses = "d-inline-flex flex-wrap justify-content-start align-items-start p-1 border border-2 border-primary rounded-3 bg-light";
let cardClasses = "card d-inline-flex flex-row flex-wrap justify-content-start align-items-start p-1 mb-2 bg-light";
let noClasses = "";

let parameterizationState = [
    "Sphere",
    "Torus",
    "Klein bottle"
]

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

function displaySlideParametrization(params) {
    document.getElementById("content").className = cardClasses;
    params.sentAnswer = sentParametrizationAnswer
    params.showAnswer = showParametrizationAnswer
    params.answers = listOfParametrizationAnswers
    document.getElementById("content").innerHTML = ejs.views_slide_parametrization(params);
    document.querySelectorAll("input[name='param_options']").forEach(input => input.addEventListener("change", showShape));
    document.querySelectorAll(".drop-box.card").forEach(box => {
        box.addEventListener("dragstart", boxDragStart);
        box.addEventListener("dragenter", boxDragEnter);
        box.addEventListener("dragover", boxDragOver);
        box.addEventListener("dragleave", boxDragLeave);
        box.addEventListener("drop", boxDrop);
        box.addEventListener("dragend", boxDragEnd);
    });
    Array.from(document.getElementsByClassName('drop-box')).forEach((e) => e.draggable = !sentParametrizationAnswer)
    document.getElementById('param-btn').addEventListener('click', () => {
        document.getElementById('param-btn').disabled = true;
        sentParametrizationAnswer = true;
        // Do stuff here with websockets
        if (isTeacher) {
            socket.emit('teacher_showParemetrizationAnswers', {id})
            return
        }
        Array.from(document.getElementsByClassName('drop-box')).forEach((e) => e.draggable = false)
        parameterizationState = [
            document.getElementById('drop-box1').innerHTML.trim(),
            document.getElementById('drop-box2').innerHTML.trim(),
            document.getElementById('drop-box3').innerHTML.trim()
        ]
        // Student section. should send answer to teacher.
        socket.emit('student_sendParametrizationAnswer', {
            bits: [
                document.getElementById('drop-box1').innerHTML.trim() == "Torus",
                document.getElementById('drop-box2').innerHTML.trim() == "Klein bottle",
                document.getElementById('drop-box3').innerHTML.trim() == "Sphere"
            ],
            id
        })
    })
    if (isTeacher) {
        Array.from(document.getElementsByClassName('drop-box')).forEach((e) => e.draggable = false)
        Array.from(document.getElementsByClassName('card-title')).forEach((e) => e.style.color = "white")
        let showBtn = document.getElementById('show-btn')
        showBtn.addEventListener('click', () => {
            if (showBtn.innerHTML == "Hide Answers") {
                showBtn.innerHTML = "Show Answers"
                Array.from(document.getElementsByClassName('card-title')).forEach((e) => e.style.color = "white")
                // Hide answers
            } else {
                showBtn.innerHTML = "Hide Answers"
                Array.from(document.getElementsByClassName('card-title')).forEach((e) => e.style.color = "black")
            }
        })
    } else {
        let drop1 = document.getElementById('drop-box1')
        let drop2 = document.getElementById('drop-box2')
        let drop3 = document.getElementById('drop-box3')
        drop1.innerHTML = parameterizationState[0]
        drop2.innerHTML = parameterizationState[1]
        drop3.innerHTML = parameterizationState[2]
        if (showParametrizationAnswer) {
            document.getElementById('param-btn').disabled = true
            document.getElementById('param-btn').innerHTML = "Answers Shown"
            Array.from(document.getElementsByClassName('drop-box')).forEach((e) => e.draggable = false)
        }
        if (sentParametrizationAnswer) {
            console.log(parameterizationState)
            if (drop1.innerHTML == "Torus") drop1.style.backgroundColor = "green";
            else {
                drop1.style.backgroundColor = "red";
                drop1.innerHTML += " (Torus)"
            }
            if (drop2.innerHTML == "Klein bottle") drop2.style.backgroundColor = "green";
            else {
                drop2.style.backgroundColor = "red";
                drop2.innerHTML += " (Klein)"
            }
            if (drop3.innerHTML == "Sphere") drop3.style.backgroundColor = "green";
            else {
                drop3.style.backgroundColor = "red";
                drop3.innerHTML += " (Sphere)"
            }
            document.getElementById('param-btn').innerHTML = "Answers Shown"
            Array.from(document.getElementsByClassName('drop-box')).forEach((e) => e.draggable = false)
        }
    }
    
    MathJax.typeset();
    showShape();
}

function displaySlidePhongModel(params) {
    document.getElementById("content").className = cardClasses;
    document.getElementById("content").innerHTML = ejs.views_slide_phong_model(params);
    start_slide_phong_model(params);
}

function displaySlideShaders(params){
    document.getElementById("content").className = cardClasses;
    document.getElementById("content").innerHTML = ejs.views_slide_custom_shaders(params);
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

function displaySlideCompleteParametrization(params){
    document.getElementById("content").className = cardClasses;
    document.getElementById("content").innerHTML = ejs.views_slide_complete_parametrization(params);
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

function showAnswersButtonFunction(showAnswersButton, arr){
    if (showAnswersButton.id == "hidden"){
        arr.forEach(c => c.classList.remove("d-none"));
        showAnswersButton.id = "shown";
        showAnswersButton.innerHTML = "Hide answers";
    } else {
        arr.forEach(c => c.classList.add("d-none"));
        showAnswersButton.id = "hidden";
        showAnswersButton.innerHTML = "Show answers";
    }
}

function displayOpenQuestionSlide(params) {
    document.getElementById("content").className = cardClasses;
    let question = document.querySelector("#description-before p").textContent;
    if (isTeacher) {
        document.getElementById("content").innerHTML = ejs.views_teacher_open_answers(params);
        let answerContainer = document.getElementById(slideDefinitions[slides[currentSlideNumber].type].answer_container);
        let showAnswersButton = document.querySelector("button[data-action='show-answers']");
        let resetButton = document.querySelector("button[data-action='reset']");
        let sendAnswersButton = document.querySelector("button[data-action='send-answers']");
        let arr = [answerContainer, resetButton, sendAnswersButton];
        showAnswersButton.addEventListener("click", () => showAnswersButtonFunction(showAnswersButton, arr));
        resetButton.addEventListener("click", () => {
            answerContainer.innerHTML = "";     // Remove all child nodes
            arr.forEach(c => c.classList.add("d-none"));
            showAnswersButton.id = "hidden";
            showAnswersButton.innerHTML = "Show Answers";
            enableOnAnswerButtons(false);

            emitAnswersToStudents({question, slide: currentSlideNumber}, false)
        });
        sendAnswersButton.addEventListener("click", () => {
            let results = [];
            for (let i = 0; i < answerContainer.childElementCount; i++){
                results.push({
                    text: answerContainer.children[i].querySelector(".answerText").textContent,
                    count: answerContainer.children[i].querySelector(".answerCount").textContent
                })
            }
            let model = {
                question, 
                results,
                slide: currentSlideNumber
            }
            emitAnswersToStudents(model);
        })
    } else if (params?.model?.isAnswer) {        // The teacher is showing the answers to the students
        params.model.showButtons = false;
        document.getElementById("content").innerHTML = ejs.views_teacher_open_answers(params.model);
        document.querySelector("button[data-action='show-answers']").classList.add("d-none");
        let answer_container = document.getElementById(slideDefinitions[slides[currentSlideNumber].type].answer_container);
        answer_container.classList.remove("d-none");
        for (let i = 0; i < params.model.results.length; i++) {     // Skip the first element (it's empty)
            if (params.model.results[i].text.trim() == "" || params.model.results[i].text.trim() == "\n") continue;
            addOpenQuestionNode(answer_container, params.model.results[i].text, params.model.results[i].count);
        }

    } else {
        document.getElementById("content").innerHTML = ejs.views_slide_open_question();
        document.getElementById("student_open_question").addEventListener("submit", (e) => {
            e.preventDefault();
            let answer = document.getElementById("student_open_question").querySelector("textarea").value;
            console.log(answer);
            emitAnswerToTeacher(answer);
        })
    }
}

function addOpenQuestionNode(answer_container, text, count){
    let new_item = document.createElement("p");
    let new_count = document.createElement("span");
    new_count.className = "answerCount me-2 badge rounded-pill bg-primary";
    new_count.appendChild(document.createTextNode(count));
    
    let new_text = document.createElement("span");
    new_text.classList.add("answerText");
    new_text.appendChild(document.createTextNode(text));
    
    new_item.appendChild(new_count);
    new_item.appendChild(new_text);

    answer_container.appendChild(new_item);
}

function enableOnAnswerButtons(enable) {
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
