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
        changeSlide(state.slide);
    });

    socket.on('generic_init', (state) => {
        console.log("Received init from the server, slide number: ", state.slide);
        changeSlide(state.slide);
    })

    socket.on('generic_releaseMutex', () => slide_mutex = false);

}

function emitChangeSlide(index){
    socket.emit('teacher_changeSlide', {
        slide: index ,
        id
    });
}