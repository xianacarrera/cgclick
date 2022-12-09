
class StudentCounter{

    constructor() {
        this.students = 0;
        this.following = 0;
        this.submits = 0;
    }

    getData(){
        return {
            "students": this.students,
            "following": this.following,
            "submits": this.submits,
        }
    }
    
}

module.exports.StudentCounter = StudentCounter