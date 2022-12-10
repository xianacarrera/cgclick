let image_parameters_answers = { alpha: {}, beta_gamma: {} };
let memory_students = {};
let target_alpha, target_beta_gamma;

let x_values_alpha;
let y_values_alpha;
let bar_colors_alpha;


let x_values_beta_gamma;
let y_values_beta_gamma;
let bar_colors_beta_gamma;


function displaySlideImageParameters(params) {
    document.getElementById("content").className = cardClasses;
    params.showButtons = true;
    params.alpha_p = 0;
    params.beta_gamma_p = 0;
    params.isTeacher = isTeacher;
    memory_students = {};

    document.getElementById("content").innerHTML = ejs.views_slide_image_parameters(params);
    MathJax.typeset();

    if (isTeacher) {
        x_values_alpha = [];
        x_values_beta_gamma = [];
        target_alpha = params.target_alpha;
        target_beta_gamma = params.target_beta / params.target_gamma;
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


        let answers_div = document.getElementById("student_answers_div_image");
        let resetButton = document.querySelector("button[data-action='reset']");
        let sendAnswersButton = document.querySelector("button[data-action='send-answers']");
        let arr = [answers_div, resetButton, sendAnswersButton];

        let showAnswersButton = document.querySelector("button[data-action='show-answers']")
        showAnswersButton.addEventListener("click", () => showAnswersButtonFunction(showAnswersButton, arr));

    } else {
        document.getElementById("phong-done-btn").addEventListener("click", () => {
            const alpha = document.getElementById("alpha_input").value;
            const beta = document.getElementById("beta_input").value;
            const gamma = document.getElementById("gamma_input").value;
            console.log(`` + alpha + ` ` + beta + ` ` + gamma);
            emitAnswerToTeacher({ alpha, beta, gamma, slide: currentSlideNumber });
        });
    }


    ip_start(
        { azimuthal: -70, polar: 60 },                           // Directional light
        { x: -200, y: 150, z: -40, intensity: 30 },              // Point light
        { azimuthal: -45, polar: 60, distance: 150, fov: 45 },   // Camera
        { gamma: params.target_gamma, tone_mapping_alpha: params.target_alpha, tone_mapping_beta: params.target_beta }
    );
}

function drawCharts() {
    // Discrete cuantitative variables -> bar charts
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
        colors.push(`rgb(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)})`);
    }
    return colors;
}

function rand(from, to) {
    // ~~ is a faster Math.floor() for positive numbers -> double NOT bitwise operator
    return ~~(Math.random() * (to - from)) + from;
}


function updateImageParametersGraphs() {
    let total = Object.values(image_parameters_answers.alpha).reduce((a, b) => a + b, 0);
    let alpha_p = image_parameters_answers.alpha[target_alpha] / total * 100;
    let beta_gamma_p = image_parameters_answers.beta_gamma[target_beta_gamma] / total * 100;
    document.getElementById("graphs_results").innerHTML = ejs.views_includes_teacher_image_parameters({ alpha_p, beta_gamma_p, showButtons: true });
    drawCharts();
    MathJax.typeset();
}