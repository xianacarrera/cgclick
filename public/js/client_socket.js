let socket;

function initSocket(){
    socket = io();
    login()
    addConnectionListeners();
}

function addConnectionListeners(){
    socket.on('connect', () => {
        console.log("Connected");
    });

    socket.on('disconnect', () => {
        console.log("Server has disconnected");
    });

    socket.on('generic_update', (state) => {
        if (!isFollowing) {
            return;
        }
        console.log("Update", state);
        leaveSlide();
        currentSlideNumber = state.slide;
        currentTeacherSlideNumber = state.slide;
        displaySlide();
        slide_mutex = false;
    });

    socket.on('student_answer', (msg) => {
        console.log("Received answer from the student: " + msg.answer);

        // If the answer should be unique for each student, filter by using msg.student (id of the student)

        if (msg.slide != currentSlideNumber) return;            // The student is not on the right slide
        manageAnswer(msg.answer);
        enableButtons();
    })

    socket.on('teacher_showResults', (msg) => {
        if (isTeacher) return;
        console.log(msg);
        leaveSlide();
        currentSlideNumber = msg.results.slide;
        currentTeacherSlideNumber = msg.results.slide;
        displaySlide(msg.results);
        slide_mutex = false;
    });
}

function emitChangeSlide(index){
    socket.emit('teacher_changeSlide', {
        slide: index ,
        id
    });
}

function emitAnswerToTeacher(answer){
    if (isTeacher) return;
    if (currentSlideNumber != currentTeacherSlideNumber) return;            // The student is not on the right slide
    console.log("Sent open answer");
    console.log({
        id,             // Room id
        answer,         // Answer
        student: socket.id,         // Identifies the student (useful for questions where the answer per student is unique)
    })
    socket.emit('student_answer', {
        id,             // Room id
        answer,         // Answer
        student: socket.id,         // Identifies the student (useful for questions where the answer per student is unique)
    });
}

function enableButtons(){
    // This switch is not the best solution in terms of scalability (if we want to change the names of the slides), but parametrizing this info
    // in the slides definition would be too cumbersome in terms of refactoring
    switch (slides[currentSlideNumber].type) {
        case "question_open":
            enableOpenAnswerButtons(true);
    }
}

function emitAnswersToStudents(results){
    results.isAnswer = true;
    let msg = {
        results,
        id
    }
    socket.emit('teacher_showResults', msg);
}


function manageAnswer(answer){
    let answer_container = document.getElementById(slideDefinitions[slides[currentSlideNumber].type].answer_container);
    switch(slides[currentSlideNumber].type){
        case "question_open":
            let new_item = document.createElement("li");
            let textnode = document.createTextNode(msg.answer);
            new_item.appendChild(textnode);
            answer_container.appendChild(new_item);
            break;
        case "question_image_parameters":

            break;
}


const login = (readonly = false) => socket.emit("generic_login", {id, readonly})