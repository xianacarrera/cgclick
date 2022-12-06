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
        socket.on('teacher_changeSlide', (new_slide) => this.on_change_slide(new_slide));
        // create will create a new session
        socket.on('teacher_createRoom', (room) => this.on_create_room(socket, room.id));
        // check if a student room exist
        socket.on('student_roomExist', (room) => this.on_room_exist(socket, room.id));
        // retransmit an answer from a student to the teacher
        socket.on('student_answer', (msg) => this.on_open_answer(msg.id, msg.answer, msg.student));
    }

    /**
    * Handles the on change of slide event and routes the sockets.
    * @param {Socket} socket client socket.
    * @param {JSON} new_slide the object contains the field slide and will be set.
    */
    on_change_slide(slide) {
        this.states[slide.id].slide = slide.slide;
        this.on_update(slide.id, this.states[slide.id].stateObject());
    }

    /**
    * Handles room creation.
    * @param {Socket} socket client socket.
    * @param {String} id the id of the room we want to join.
    */
    on_create_room(socket, id) {
        this.states[id] = new State(0); // Start from first slide.
        socket.emit("generic_create_done", {}); // Just send this when we are done.
    }

    /**
    * Returns if a room exist.
    * @param {Socket} socket client socket.
    * @param {String} id the id of the room we want to join.
    */
    on_room_exist(socket, id) {
        socket.emit("generic_check_done", {status: this.states.hasOwnProperty(id)}); // Just send this when we are done.
    }

    /**
    * Handles login of new partipants and send them the state, if the room do not exist create it.
    * @param {Socket} socket client socket.
    * @param {String} id the id of the room we want to join.
    */
    on_login(socket, id) {
        console.log("Login of " + socket.id);

        // Create new room if it does not exist.
        if (!this.states.hasOwnProperty(id)) {
            this.states[id] = new State(0); // Start from first slide
        }
        if (this.states[id].sockets.length == 0){       // The room could exist but be empty
            // Needs to be done here and not on create room because the id of the teacher's socket changes
            this.states[id].teacherSocketId = socket.id;
        }
        this.states[id].addSocket(socket)
        socket.emit("generic_update", this.states[id].stateObject())
    }

    /**
    * Should be called whenever the state changes.
    * @param {Socket} socket client socket.
    * @param {String} id room id.
    * @param {JSON} state_obj the new state object.
    */
    on_update(id, state_obj) {
        // update topic should be received by the client and update current slide and whatever accordingly.
        this.states[id].broadcast('generic_update', state_obj)
    }

    on_open_answer(id, answer, student){
        this.io.to(this.states[id].teacherSocketId).emit("student_answer", {answer, student});
    }

    setIO(io_instance){
        this.io = io_instance;
    }

    /**
    * Return the states in the handler.
    * @return {Object} states.
    */
    getStates() {
        return this.states;
    }
}

module.exports.WebSocketHandler = WebSocketHandler;