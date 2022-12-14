fetchAPI = function() {

    async function access() {
        const signature = localStorage.getItem('teacherSignature');
        console.log(signature);
        const res = await fetch("/access", 
        { 
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({signature, socketId: socket.id})
        });
        return res;
    }

    return {
        access
    }

}();