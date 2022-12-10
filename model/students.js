
class StudentCounter{

    constructor() {
        this.students = [];
        this.following = [];
        this.submits = [];
    }

    getData(){
        return {
            "students": this.students.length-1,
            "following": this.following.length-1,
            "submits": this.submits.length-1,
        }
    }
    
}

module.exports.StudentCounter = StudentCounter