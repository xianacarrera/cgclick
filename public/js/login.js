const idLength = 9

var socket = io();

const start = () => {
    initImport();
    fetchAPI.access().then(res => {
        if (res.status === 203) return;

        res.json().then(msg => initRoom(msg.id));
    });
}

// generateId creates a new session id.
const generateId = () => {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( var i = 0; i < idLength; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const initRoom = (roomId) => {
    window.location.href = `/pin/${roomId}`;
}

const createNewRoom = () => {
    let id = generateId();
    socket.on('generic_create_done', () => initRoom(id))
    socket.emit('teacher_createRoom', {id, slides: localStorage.getItem("slides")});
}

const joinRoom = () => {
    let id = document.getElementById('id').value.trim();

    socket.on('generic_check_done', (obj_status) => {
        if (obj_status.status) {
            slides = obj_status.slides;
            window.location.href = `/pin/${id}`;
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

