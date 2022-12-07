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

        let answer_container = document.getElementById(slideDefinitions[slides[currentSlideNumber].type].answer_container);
        let new_item = document.createElement("li");
        let textnode = document.createTextNode(msg.answer);
        new_item.appendChild(textnode);
        answer_container.appendChild(new_item);
    })

    socket.on('teacher_showResults', (msg) => {
        leaveSlide();
        currentSlideNumber = msg.slide;
        currentTeacherSlideNumber = msg.slide;
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
    socket.emit('student_answer', {
        id,             // Room id
        answer,         // Answer
        student: socket.id,         // Identifies the student (useful for questions where the answer per student is unique)
    });
}



const login = () => socket.emit("generic_login", {id})