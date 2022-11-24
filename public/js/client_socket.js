let socket;

function initSocket(){
    socket = io();
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
        document.querySelector("body").innerHTML = slides[state.slide];
        addEventListeners();
    });

    socket.on('generic_init', (state) => {
        console.log("Received init from the server, slide number: ", state.slide);
        changeSlide(state.slide);
    })

}

function emitChangeSlide(index){
    socket.emit('teacher_changeSlide', {
        slide: index 
    });
}