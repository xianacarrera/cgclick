let socket;

function initSocket(){
    socket = io();
    login()
    addConnectionListeners();
    if(isTeacher) addTeacherListeners();
}

let studentData = {};

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
        displaySlide();
        slide_mutex = false;
    });

    socket.on('generic_init', (state) => {
        console.log("Received init from the server, slide number: ", state.slide);
        changeSlide(state.slide);
    })

}

function addTeacherListeners(){
    socket.on('teacher_update', (data) => {
        console.log(data);
        studentData = data;
        let pathname = new URL(window.location.href).pathname;
        document.getElementById("statusbar").innerHTML = ejs.views_includes_statusbar({id, pathname, "students": studentData});
    })
}

function emitChangeSlide(index){
    socket.emit('teacher_changeSlide', {
        slide: index ,
        id
    });
}


const login = (readonly = false) => socket.emit("generic_login", {id, readonly})