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
        displaySlide();
        slide_mutex = false;
        console.log("heard");
    });

    socket.on('generic_init', (state) => {
        console.log("Received init from the server, slide number: ", state.slide);
        changeSlide(state.slide);
        // TODO: displaySlide()?
    })
}

function emitChangeSlide(index){
    console.log("Emitting change slid");
    socket.emit('teacher_changeSlide', {
        slide: index ,
        id
    });
}