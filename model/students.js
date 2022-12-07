
class StudentCounter{

    constructor() {
        this.students = 0;
        this.following = 0;
        this.submits = 0;
    }

    addStudent() {
        this.students++;
    }
}

module.exports.StudentCounter = StudentCounter