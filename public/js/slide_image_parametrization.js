let image_parameters_answers = { alpha: {}, beta_gamma: {} };
let memory_students = {};
let target_alpha, target_beta_gamma;
let alpha_p, beta_gamma_p;
let canvas_size, canvas_width, canvas_height, alpha, beta, gamma;

let x_values_alpha;
let y_values_alpha;
let bar_colors_alpha;


let x_values_beta_gamma = [];
let y_values_beta_gamma = []; 
let bar_colors_beta_gamma;


function displaySlideImageParameters(params) {
    document.getElementById("content").className = cardClasses;
    params.showButtons = true;
    params.alpha_p = 0;
    params.beta_gamma_p = 0;
    params.isTeacher = isTeacher;
    // params.target_alpha is already set in params, but we need to divide beta by gamma to obtain the correct ratio
    params.target_beta_gamma = params.target_beta / params.target_gamma;
    memory_students = {};
    [canvas_size, canvas_width, canvas_height, alpha, beta, gamma] = [params.canvas_size, params.canvas_width, params.canvas_height, params.alpha, params.beta, params.gamma];

    document.getElementById("content").innerHTML = ejs.views_slide_image_parameters(params);
    MathJax.typeset();

    if (isTeacher) {
        x_values_alpha = [];
        x_values_beta_gamma = [];
        target_alpha = params.target_alpha;
        target_beta_gamma = params.target_beta / (params.target_gamma || 1);    // Avoid division by 0
        for (let i = params.alpha.startIndex; i <= params.alpha.endIndex; i += params.alpha.step) {
            image_parameters_answers.alpha[i] = 0;
            x_values_alpha.push(i);
        };

        for (let j = params.beta.startIndex; j <= params.beta.endIndex; j += params.beta.step) {
            for (let k = params.gamma.startIndex; k <= params.gamma.endIndex; k += params.gamma.step) {
                image_parameters_answers.beta_gamma[j / k] = 0;
                x_values_beta_gamma.push(+(j / k).toFixed(2));       // 2 decimal places (the + eliminates 0s at the end)
            }
        }
        x_values_beta_gamma = [...new Set(x_values_beta_gamma)];    // Delete duplicates   
        x_values_beta_gamma.sort();

        addListenerShowAnswersImageParameters();
    } else if (params?.model?.isAnswer) {        // The teacher is showing the answers to the students
        // Needs to be set here and adjusted in the graphs function
        document.getElementById("content").innerHTML = ejs.views_slide_image_parameters(params.model.results);
        console.log(params.model);
        [x_values_alpha, y_values_alpha, bar_colors_alpha] = [params.model.results.x_values_alpha, params.model.results.y_values_alpha, params.model.results.bar_colors_alpha];
        [alpha_p, beta_gamma_p] = [params.model.results.alpha_p, params.model.results.beta_gamma_p];
        x_values_beta_gamma = params.model.results.x_values_beta_gamma;   
        y_values_beta_gamma = params.model.results.y_values_beta_gamma;
        bar_colors_beta_gamma = params.model.results.bar_colors_beta_gamma;

        setTimeout(() => {
            updateImageParametersGraphs(false, false, params.model.results.alpha_p, params.model.results.beta_gamma_p);
            document.querySelector("button[data-action='show-images-answers']").classList.add("d-none");
            // document.getElementById("phong-done-btn").classList.add("d-none");
            document.getElementById("student_answers_div_image").classList.remove("d-none");
        }, 100);

    } else {
        document.getElementById("phong-done-btn").addEventListener("click", () => {
            const alpha = document.getElementById("alpha_input").value;
            const beta = document.getElementById("beta_input").value;
            const gamma = document.getElementById("gamma_input").value;
            console.log(`` + alpha + ` ` + beta + ` ` + gamma);
            emitAnswerToTeacher({ alpha, beta, gamma, slide: currentSlideNumber });
            emitSubmit();
        });
    }


    ip_start(
        { azimuthal: -70, polar: 60 },                           // Directional light
        { x: -200, y: 150, z: -40, intensity: 30 },              // Point light
        { azimuthal: -45, polar: 60, distance: 150, fov: 45 },   // Camera
        { gamma: params.target_gamma, tone_mapping_alpha: params.target_alpha, tone_mapping_beta: params.target_beta }
    );
}

function getImageHiddenShownArray(){
    let answers_div = document.getElementById("student_answers_div_image");
    let sendAnswersButton = document.querySelector("button[data-action='send-answers']");
    return [answers_div, sendAnswersButton];
}

function addListenerShowAnswersImageParameters() {
    let arr = getImageHiddenShownArray();

    let showAnswersButton = document.querySelector("button[data-action='show-images-answers']");
    showAnswersButton.addEventListener("click", () => { showAnswersButtonFunction(showAnswersButton, arr) });


    document.querySelector("button[data-action='see-solution']").addEventListener("click", () => {              // See solution
        let div_solutions = document.getElementById("solution");
        if (div_solutions.classList.contains("d-none")){
            div_solutions.classList.remove("d-none");
        } else {
            div_solutions.classList.add("d-none");
        }
    });
    arr[1].addEventListener("click", () => {             // Send answers
        let model = {
            results: {
                x_values_alpha,
                y_values_alpha,
                bar_colors_alpha,
                x_values_beta_gamma,
                y_values_beta_gamma,
                bar_colors_beta_gamma,
                showButtons: false,
                isTeacher: true,
                alpha_p,
                beta_gamma_p,
                slide: currentSlideNumber,
                canvas_size,
                canvas_width,
                canvas_height
            },
            slide: currentSlideNumber
        };
        emitAnswersToStudents(model);
    })
}

function drawCharts(reload) {
    // Discrete cuantitative variables -> bar charts
    if (reload) {
        console.log("reloading");
        y_values_alpha = [];
        x_values_alpha.forEach(x => {
            y_values_alpha.push(image_parameters_answers.alpha[x]);
        })
        bar_colors_alpha = generateRandomColors(x_values_alpha.length);
        y_values_beta_gamma = [];
        x_values_beta_gamma.forEach(bg => {
            y_values_beta_gamma.push(image_parameters_answers.beta_gamma[bg]);
        })
        bar_colors_beta_gamma = generateRandomColors(x_values_beta_gamma.length);
    }

    new Chart("alpha_chart", {
        type: "bar",
        data: {
            labels: x_values_alpha,
            datasets: [{
                backgroundColor: bar_colors_alpha,
                data: y_values_alpha
            }]
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: "Alpha"
            }
        }
    });

    new Chart("beta_gamma_chart", {
        type: "bar",
        data: {
            labels: x_values_beta_gamma,
            datasets: [{
                backgroundColor: bar_colors_beta_gamma,
                data: y_values_beta_gamma
            }]
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: "Beta / Gamma"
            }
        }
    });
}

function generateRandomColors(n) {
    let colors = [];
    while (colors.length < n) {
        // colors.push(`hsl(${rand(0, 359)}, 100%, 50%)`);
        colors.push(`rgb(13, 110, 253)`);
    }
    return colors;
}

function rand(from, to) {
    // ~~ is a faster Math.floor() for positive numbers -> double NOT bitwise operator
    return ~~(Math.random() * (to - from)) + from;
}


function updateImageParametersGraphs(showButtons = true, reload = true, new_alpha_p, new_beta_gamma_p) {
    let total = Object.values(image_parameters_answers.alpha).reduce((a, b) => a + b, 0);
    if (new_alpha_p === undefined || new_beta_gamma_p === undefined){
        alpha_p = image_parameters_answers.alpha[target_alpha] / total * 100;
        beta_gamma_p = image_parameters_answers.beta_gamma[target_beta_gamma] / total * 100;
    } else {
        alpha_p = new_alpha_p;
        beta_gamma_p = new_beta_gamma_p;
    }

    let storedid = document.querySelector("button[data-action='show-images-answers']").id;
    document.getElementById("teacher-controls").innerHTML = ejs.views_includes_teacher_image_parameters({ 
        alpha_p, beta_gamma_p, showButtons, 
        target_alpha,
        target_beta_gamma       // Avoid division by 0
    });
    if (isTeacher && storedid === "shown"){
        let arr = getImageHiddenShownArray();
        showAnswersButtonFunction(document.querySelector("button[data-action='show-images-answers']"), arr);
    }
    drawCharts(reload);
    MathJax.typeset();
}