const idLength = 9

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

const createNewRoom = () => {
    let id = generateId();
    window.location.href = `/pin/${id}`;
}

const joinRoom = () => {
    let id = document.getElementById('id').value;
    window.location.href = `/pin/${id}`;
}