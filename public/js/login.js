const idLength = 9

var socket = io();

// generateId creates a new session id.
const generateId = () => {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( var i = 0; i < idLength; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return "LOL";
}

const createNewRoom = () => {
    let id = generateId();
    socket.on('generic_create_done', (good) => {
        if (good.good) {
            window.location.href = `/pin/${id}`
        } else {
            socket.emit('teacher_createRoom', {id: generateId()});
        }
    })
    socket.emit('teacher_createRoom', {id});
    socket.on('student_openAnswer', (msg) => {
        console.log("Received open answer from the student: " + msg.answer);
    })
}

const joinRoom = () => {
    let id = document.getElementById('id').value.trim();

    socket.on('generic_check_done', (obj_status) => {
        if (obj_status.status) {
            window.location.href = `/pin/${id}`
        } else {
            document.getElementById('id').value = "";
            document.getElementById('not-found-msg').style.display = 'block';
        }
    })
    socket.emit('student_roomExist', {id});
}

document.getElementById('id').addEventListener('input', function (evt) {
    let id = document.getElementById('id').value.trim();
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        document.getElementById("joinBtn").disabled = id.length == 0 || specialChars.test(id);    
});