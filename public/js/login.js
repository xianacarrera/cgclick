const idLength = 5

var socket = io();
var reloadInfo;

const start = () => {
    initImport();
    fetchAPI.access().then(res => {
        if (res.status === 203) return;

        res.json().then((msg) => {
            reloadInfo = {id: msg.id}
            document.getElementById("div-reload-room").classList.remove("d-none");
            document.getElementById("btn-reload-room").addEventListener("click", reloadRoom);
        });
    });
}

function reloadRoom(){
    socket.on('receive_slides', (msg2) => initRoom(reloadInfo.id, msg2.slides));
    socket.emit('request_slides', {id: reloadInfo.id});
}

// generateId creates a new session id.
const generateId = () => {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let charactersLength = characters.length;
    for ( var i = 0; i < idLength; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const initRoom = (roomId, slides) => {
    localStorage.setItem('received_slides', slides);
    console.log("received_slides = ", localStorage.getItem('received_slides'));
    window.location.href = `/pin/${roomId}`;
}

const createNewRoom = () => {
    let id = generateId();
    console.log("createNewRoom(): local.Storage.getItem('slides') = ", localStorage.getItem("slides"));
    socket.on('generic_create_done', () => {
        initRoom(id, localStorage.getItem("slides"));
        localStorage.removeItem('slides');;
    });
    socket.emit('teacher_createRoom', {id, slides: localStorage.getItem("slides")});
}

const joinRoom = () => {
    let id = document.getElementById('id').value.trim();
    let slides_tmp;

    socket.on('generic_check_done', (obj_status) => {
        if (obj_status.status) {
            localStorage.setItem('received_slides', obj_status.slides);
            console.log("received_slides = ", localStorage.getItem('received_slides'));
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

