
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
    }

    /**
    * Return the state object for broadcasting.
    * @return   {JSON} State object.
    */
    stateObject() {
        return {
            slide: this.slide,
        }
    }
}

module.exports.State = State