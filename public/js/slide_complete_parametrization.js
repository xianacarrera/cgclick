function addCompleteParametrizationListeners(){
    document.getElementById("form-complete-param").addEventListener("submit", function(e){
        e.preventDefault();

        displayErrorMessage(false);
        const formData = new FormData(e.target);
        let js_code;
        try {
            //console.log(formData.get("x"));
            js_code = latex_to_js(formData.get("x"));
            //console.log(js_code);
            let customFunction = buildCustomFunction(formData);
        } catch (e) {
            displayErrorMessage(true);
        }
    });
}

function buildLine(symbol, input, constant){
    let spansText = document.querySelectorAll(`span[data-symbol="${symbol}"]`).map(t => t.textContent);
    let line = `${spansText[0] || ""} ${input}`;        // Handle the case where there are no spans
    for (let i = 1; i < spansText.length; i++){
        line += ` ${spansText[i]}`;
    }
    line.replaceAll(constant.symbol, constant.value);
    return line;
}

function buildCustomFunction(formData){
    return function (u, v, target) {
        u *= (formData.get("u-max") - formData.get("u-min")) + formData.get("u-min");           // Translate and scale u to [u_min, u_max]
        v *= (formData.get("v-max") - formData.get("v-min")) + formData.get("v-min");           // Translate and scale v to [v_min, v_max]
        
        let constant = {constSymbol: formData.get("const-symbol"), constVal: formData.get("const-value")};
        let x = buildLine("x", formData.get("x"), constant);             // Build the x function
        let y = buildLine("y", formData.get("y"), constant);             // Build the y function
        let z = buildLine("z", formData.get("z"), constant);             // Build the z function
        
        target.set(x, y, z);
    };
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