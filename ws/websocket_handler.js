const { State } = require("../model/state");

/**
 * WebsocketHandler handles all incoming connections.
 */
class WebSocketHandler {

    /**
    * Initializes the WebsocketHandler.
    */
    constructor() {
        // A JSON object acts like an hashmap so we can have different states assigned to different ids
        this.states = {}
    }

    /**
    * Handles the on connection event and routes the sockets.
    * @param {Socket} socket client socket.
    */
    on_connect(socket) {
        // Participants must login with the ID, disregarding whether it is a teacher or not.
        socket.on("generic_login", (login_id) => this.on_login(socket, login_id.id));
        // changeSlide topic should be called whenever slide are sent
        socket.on('teacher_changeSlide', (new_slide) => this.on_change_slide(new_slide))
    }

    /**
    * Handles the on change of slide event and routes the sockets.
    * @param {JSON} new_slide the object contains the field slide and will be set.
    */
    on_change_slide(slide) {
        this.states[slide.id].slide = slide.slide;
        this.on_update(slide.id, this.states[slide.id].stateObject());
    }

    /**
    * Handles login of new partipants and send them the state, if the room do not exist create it.
    * @param {Socket} socket client socket.
    * @param {String} id the id of the room we want to join.
    */
    on_login(socket, id) {
        console.log(id)
        // Create new room if it does not exist.
        if (!this.states.hasOwnProperty(id)) {
            console.log("a" + id)
            this.states[id] = new State(0); // Start from first slide
        }
        this.states[id].addSocket(socket)
        socket.emit("generic_update", this.states[id].stateObject())
    }

    /**
    * Should be called whenever the state changes.
    * @param {String} id room id.
    * @param {JSON} state_obj the new state object.
    */
    on_update(id, state_obj) {
        // update topic should be received by the client and update current slide and whatever accordingly.
        this.states[id].broadcast('generic_update', state_obj)
    }
}

module.exports.WebSocketHandler = WebSocketHandler;