
/**
 * WebsocketHandler handles all incoming connections.
 */
class WebSocketHandler {

    /**
    * Initializes the WebsocketHandler.
    * @param {State} state state of the app.
    */
    constructor(state) {
        this.state = state;
    }

    /**
    * Handles the on connection event and routes the sockets.
    * @param {Socket} socket client socket.
    */
    on_connect(socket) {
        // Notify new participants.
        socket.emit("generic_init", this.state.stateObject());
        // changeSlide topic should be called whenever slide are sent
        socket.on('teacher_changeSlide', (new_slide) => this.on_change_slide(socket, new_slide.slide))
    }

    /**
    * Handles the on change of slide event and routes the sockets.
    * @param {Socket} socket client socket.
    * @param {JSON} new_slide the object contains the field slide and will be set.
    */
    on_change_slide(socket, slide) {
        this.state.slide = slide;
        this.on_update(socket, this.state.stateObject());
    }

    /**
    * Should be called whenever the state changes.
    * @param {Socket} socket client socket.
    * @param {JSON} state_obj the new state object.
    */
    on_update(socket, state_obj) {
        // update topic should be received by the client and update current slide and whatever accordingly.
        socket.broadcast.emit('generic_update', state_obj)
    }
}

module.exports.WebSocketHandler = WebSocketHandler;