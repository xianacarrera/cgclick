let spansText = {};

function addCompleteParametrizationListeners(){
    // Preload the text of the spans so that we can use the raw latex for later (MathJax will change the DOM text and we can't change it back)
    ["x", "y", "z"].forEach((symbol) => {
        spansText[symbol] = Array.from(document.querySelectorAll(`span[data-symbol="${symbol}"]`)).map(t => t.textContent);
    });

    document.getElementById("form-complete-param").addEventListener("submit", (e) => {
        e.preventDefault();

        let loadingSpinner = document.querySelector("div.spinner-border");
        loadingSpinner.classList.remove("opacity-0");
        loadingSpinner.classList.add("opacity-100");

        setTimeout(() => {                
            threeAPI.clear();
            displayErrorMessage(false);
            const formData = new FormData(e.target);
            try {
                buildCustomFunction(formData);
                threeAPI.createParametricGeometry(buildCustomFunction(formData));
                threeAPI.animate();
            } catch (e) {
                displayErrorMessage(true);
                threeAPI.clear();
            }
            loadingSpinner.classList.add("opacity-0");
            loadingSpinner.classList.remove("opacity-100");
        }, 10);     // To give time to the spinner to appear
    });
}

function buildLine(symbol, input, constant){
    let line = `${spansText[symbol][0] || ""} ${input || ""}`;        // Handle the case where there are no spans and/or no input
    for (let i = 1; i < spansText[symbol].length; i++){
        line += ` ${spansText[symbol][i]}`;
    }
    if (constant) line = line.replaceAll(constant.constSymbol, constant.constVal);
    line = line.replace("\\(", "");
    line = line.replace("\\)", "");
    return line.trim();
}

function buildCustomFunction(formData){
    let constant;
    if (formData.get("const-symbol")) constant = {constSymbol: formData.get("const-symbol"), constVal: formData.get("const-value")};

    const umin = parseFloat(formData.get("u-min"));
    const umax = parseFloat(formData.get("u-max"));
    const vmin = parseFloat(formData.get("v-min"));
    const vmax = parseFloat(formData.get("v-max"));

    return function (u, v, target) {
        u *= (umax - umin) + umin;           // Translate and scale u to [u_min, u_max]
        v *= (vmax - vmin) + vmin;           // Translate and scale v to [v_min, v_max]

        let x = buildLine("x", formData.get("x"), constant);             // Build the x function
        let y = buildLine("y", formData.get("y"), constant);             // Build the y function
        let z = buildLine("z", formData.get("z"), constant);             // Build the z function    

        x = evaluatex(x, {u, v}, {latex: true})();        // Compile a function for x and evaluate it
        y = evaluatex(y, {u, v}, {latex: true})();        // Compile a function for y and evaluate it
        z = evaluatex(z, {u, v}, {latex: true})();        // Compile a function for z and evaluate it

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

