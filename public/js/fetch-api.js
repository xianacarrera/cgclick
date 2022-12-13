fetchAPI = function() {

    async function access() {
        const res = await fetch("/access", 
        { 
            method: "POST",
            body: JSON.stringify({signature: localStorage.getItem('teacherSignature')})
        });
        return res;
    }

    return {
        access
    }

}();