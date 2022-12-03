function addCompleteParametrizationListeners(){
    document.getElementById("form-complete-param").addEventListener("submit", function(e){
        e.preventDefault();

        displayErrorMessage(false);
        const formData = new FormData(e.target);
        let js_code;
        try {
            console.log(formData.get("x"));
            js_code = latex_to_js(formData.get("x"));
            console.log(js_code);
        } catch (e) {
            displayErrorMessage(true);
        }
    });
}

function displayErrorMessage(display){
    if (display){
        document.getElementById("error-msg-complete-param").classList.remove("opacity-0");
        document.getElementById("error-msg-complete-param").classList.add("opacity-100");
    } else {
        document.getElementById("error-msg-complete-param").classList.remove("opacity-100");
        document.getElementById("error-msg-complete-param").classList.add("opacity-0");
    }
}