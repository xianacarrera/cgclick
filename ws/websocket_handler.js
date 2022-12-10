const { State } = require("../model/state");

const { StudentCounter } = require("../model/students");

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
        this.students = {};
    }

    /**
    * Handles the on connection event and routes the sockets.
    * @param {Socket} socket client socket.
    */
    on_connect(socket) {
        console.log("conect",socket.id);
        socket.on("disconnect", () => this.on_disconnect(socket));
        // Participants must login with the ID, disregarding whether it is a teacher or not.
        socket.on("generic_login", (login_id) => this.on_login(socket, login_id.id, login_id.readonly));
        // changeSlide topic should be called whenever slide are sent
        socket.on('teacher_changeSlide', (new_slide) => this.on_change_slide(new_slide));
        // create will create a new session
        socket.on('teacher_createRoom', (room) => this.on_create_room(socket, room.id));
        // check if a student room exist
        socket.on('student_roomExist', (room) => this.on_room_exist(socket, room.id));
        // when a student follows/unfollows the course
        socket.on('student_follow', (follow) => this.on_follow(socket, follow.id, follow.val));

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
        this.students[id] = new StudentCounter();
        socket.emit("generic_create_done", {}); // Just send this when we are done.
    }

    /**
    * Returns if a room exist.
    * @param {Socket} socket client socket.
    * @param {String} id the id of the room we want to join.
    */
    on_room_exist(socket, id) {
        this.states[id].broadcast("teacher_update", this.students[id].getData());
        socket.emit("generic_check_done", {status: this.states.hasOwnProperty(id)}); // Just send this when we are done.
    }

    /**
    * Handles login of new partipants and send them the state, if the room do not exist create it.
    * @param {Socket} socket client socket.
    * @param {String} id the id of the room we want to join.
    */
    on_login(socket, id, readonly) {
        console.log("login",socket.id);
        console.log(this.students[id].students.map(a => a.id));
        // Create new room if it does not exist.
        if (!this.states.hasOwnProperty(id)) {
            this.states[id] = new State(0); // Start from first slide
        }
        if (!readonly) {
            this.states[id].addSocket(socket)
            this.students[id].students.push(socket);
            this.students[id].following.push(socket);
        }
        this.states[id].broadcast("teacher_update", this.students[id].getData());
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

    /**
    * Return the states in the handler.
    * @return {Object} states.
    */
    getStates() {
        return this.states;
    }

    on_follow(socket, id, follow) {
        console.log("follow",socket.id);
        if(follow){
            this.students[id].following.push(socket);
        }
        else{
            const index = this.students[id].following.indexOf(socket);
            if(index > -1) this.students[id].following.splice(index, 1);
        }
        this.states[id].broadcast("teacher_update", this.students[id].getData());
    }

    on_disconnect(socket) {
        console.log("disconnect",socket.id);
        let id = this.find_room(socket);
        if(id){
            const index = this.students[id].students.indexOf(socket);
            if(index > -1) this.students[id].students.splice(index, 1);
            const index2 = this.students[id].following.indexOf(socket);
            if(index2 > -1) this.students[id].following.splice(index2, 1);
            this.states[id].broadcast("teacher_update", this.students[id].getData());
        }
    }

    // helper function to find the room a connection is in
    // knowing only the socket
    find_room(socket){
        for (const id in this.states) {
            if (Object.hasOwnProperty.call(this.states, id)) {
                const state = this.states[id];
                if (state.sockets.some( s => s == socket))
                    return id;
            }
        }
        return false;
    }
}

module.exports.WebSocketHandler = WebSocketHandler;