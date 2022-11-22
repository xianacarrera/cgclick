
/**
 * WebsocketHandler handles all incoming connections.
 */
class WebSocketHandler {

    #was_teacher_set = 0
    /**
    * Initializes the WebsocketHandler.
    * @param {State} state state of the app.
    */
    constructor(state) {
        this.state = state
    }

    /**
    * Handles the on connection event and routes the sockets.
    * @param {Socket} socket client socket.
    */
    on_connect(socket) {
        // changeSlide topic should be called whenever slide are sent
        socket.on('changeSlide', (new_slide) => this.on_change_slide(socket, new_slide).bind(this))
    }

    /**
    * Handles the on change of slide event and routes the sockets.
    * @param {Socket} socket client socket.
    * @param {JSON} new_slide the object contains the field slide and will be set.
    */
    on_change_slide(socket, new_slide) {
        this.state.slide = new_slide.slide;
        this.on_update(socket, this.state.stateObject());
    }

    /**
    * Should be called whenever the state changes.
    * @param {Socket} socket client socket.
    * @param {JSON} state_obj the new state object.
    */
    on_update(socket, state_obj) {
        // update topic should be received by the client and update current slide and whatever accordingly.
        socket.broadcast.emit('update', state_obj)
    }
}

module.exports.WebSocketHandler = WebSocketHandler;