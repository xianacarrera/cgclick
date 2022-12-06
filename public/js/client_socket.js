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
        displaySlide();
        slide_mutex = false;
    });

    socket.on('generic_init', (state) => {
        console.log("Received init from the server, slide number: ", state.slide);
        changeSlide(state.slide);
    })

}

function emitChangeSlide(index){
    socket.emit('teacher_changeSlide', {
        slide: index ,
        id
    });
}


const login = () => socket.emit("generic_login", {id})