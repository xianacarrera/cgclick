
/**
 * State is our application state,
 * for now it will just keep track of the current slide and that is all.
 */
class State {

    /**
    * Initializes the state.
    * @param {Number} initial_slide slide number.
    */
    constructor(initial_slide) {
        this.slide = initial_slide;
        this.showParametrizationAnswer = false;
        this.sockets = [] // Keep track of the rooms
    }

    /**
    * Return the state object for broadcasting.
    * @return   {JSON} State object.
    */
    stateObject(id) {
        return {
            slide: this.slide,
            showParametrizationAnswer: this.showParametrizationAnswer,
            id,
        }
    }

    /** 
    * Add new socket to the state (aka. current room).
    * @param    {Socket} socket socket to add.
    */
    addSocket(socket) {
        this.sockets.push(socket)
    }

    /** 
    * Add new socket to the state (aka. current room).
    * @param    {Socket} socket socket to add.
    */
    broadcast(topic, message) {
        this.sockets.forEach((socket) => socket.emit(topic, message))
    }
}

module.exports.State = State