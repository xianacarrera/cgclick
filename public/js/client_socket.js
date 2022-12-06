let socket;

function initSocket(){
    socket = io();
    socket.emit("generic_login", {
        id, // Placeholder
    })
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
        console.log("Update", state);
        leaveSlide();
        currentSlideNumber = state.slide;
        currentTeacherSlideNumber = state.slide;
        displaySlide();
        slide_mutex = false;
    });

    socket.on('student_openAnswer', (msg) => {
        console.log("Received open answer from the student: " + msg.answer);
    })
}

function emitChangeSlide(index){
    socket.emit('teacher_changeSlide', {
        slide: index ,
        id
    });
}

function emitOpenAnswerToTeacher(answer){
    if (isTeacher) return;
    if (currentSlideNumber != currentTeacherSlideNumber) return;            // The student is not on the right slide
    console.log("Sent open answer");
    socket.emit('student_openAnswer', {
        id,
        answer
    });
}
