
/**
 * State is our application state,
 * for now it will just keep track of the current slide and that is all.
 */
class State {

    /**
    * Initializes the state.
    * @param {Number} initial_slide slide number.
    */
    constructor(initial_slide, slides) {
        this.slides = slides;
        console.log("State constructor got slides = ", slides);
        this.slide = initial_slide;
        this.showParametrizationAnswer = false;
        this.sockets = [] // Keep track of the rooms
        this.parametrizationCorrectnessBitmap = [[], [], []] // List of list of bits(booleans) with correct/incorrect states
        this.disconnectedTeacher = false;
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
            studentParametrizationAnswers: this.getParametrizationOutcome(),
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
    * addParametrizationBits adds a new answer outcome for paremetrization slides.
    * @param    {Array<Boolean>} bits bits to add.
    */
    addParametrizationBits(bits) {
        this.parametrizationCorrectnessBitmap[0].push(bits[0])
        this.parametrizationCorrectnessBitmap[1].push(bits[1])
        this.parametrizationCorrectnessBitmap[2].push(bits[2])
    }

    /** 
    * addParametrizationBits adds a new answer outcome for paremetrization slides.
    * @return {Array<Array<Integer>>} how many people got answer correct and incorrent.
    */
    getParametrizationOutcome() {
        let q1Correct = this.parametrizationCorrectnessBitmap[0].filter(x => x === true).length
        let q2Correct = this.parametrizationCorrectnessBitmap[1].filter(x => x === true).length
        let q3Correct = this.parametrizationCorrectnessBitmap[2].filter(x => x === true).length

        return [
            [
                q1Correct,
                this.parametrizationCorrectnessBitmap[0].length - q1Correct
            ],
            [
                q2Correct,
                this.parametrizationCorrectnessBitmap[1].length - q2Correct
            ],
            [
                q3Correct,
                this.parametrizationCorrectnessBitmap[2].length - q3Correct
            ]
        ]
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