let spansText = {};

function addCompleteParametrizationListeners(){
    // Preload the text of the spans so that we can use the raw latex for later (MathJax will change the DOM text and we can't change it back)
    ["x", "y", "z"].forEach((symbol) => {
        spansText[symbol] = Array.from(document.querySelectorAll(`span[data-symbol="${symbol}"]`)).map(t => t.textContent);
    });
    console.log(spansText)

    document.getElementById("form-complete-param").addEventListener("submit", (e) => {
        e.preventDefault();

        displayErrorMessage(false);
        const formData = new FormData(e.target);
        //try {
            console.log(formData.get("x"));
            console.log(latex_to_js(formData.get("x")));

            console.log(formData.get("x"));
            //console.log(js_code);
            buildCustomFunction(formData);
            threeAPI.createParametricGeometry(buildCustomFunction(formData));
            threeAPI.animate();
            /*
        } catch (e) {
            displayErrorMessage(true);
            threeAPI.clear();
        }*/
    });
}

function buildLine(symbol, input, constant){
    console.log(spansText)
    let line = `${spansText[symbol][0] || ""} ${input || ""}`;        // Handle the case where there are no spans and/or no input
    for (let i = 1; i < spansText[symbol].length; i++){
        console.log("???" + spansText[symbol][i])
        line += ` ${spansText[symbol][i]}`;
    }
    if (constant) line = line.replaceAll(constant.constSymbol, constant.constVal);
    line = line.replace("\\(", "");
    line = line.replace("\\)", "");
    console.log(line);
    return latex_to_js(line);
}

function buildCustomFunction(formData){
    let constant;
    if (formData.get("const-symbol")) constant = {constSymbol: formData.get("const-symbol"), constVal: formData.get("const-value")};
    console.log("constant = " + constant.constSymbol + " " + constant.constVal);
    let x = buildLine("x", formData.get("x"), constant);             // Build the x function
    let y = buildLine("y", formData.get("y"), constant);             // Build the y function
    let z = buildLine("z", formData.get("z"), constant);             // Build the z function
    
    console.log("x = " + x);
    console.log("y = " + y);
    console.log("z = " + z);

    return function (u, v, target) {
        u *= (formData.get("u-max") - formData.get("u-min")) + formData.get("u-min");           // Translate and scale u to [u_min, u_max]
        v *= (formData.get("v-max") - formData.get("v-min")) + formData.get("v-min");           // Translate and scale v to [v_min, v_max]

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