let image_parameters_answers = { alpha: {}, beta_gamma: {} };
let target_alpha, target_beta_gamma;

function displaySlideImageParameters(params) {
    document.getElementById("content").className = cardClasses;
    target_alpha = params.target_alpha;
    target_beta_gamma = params.target_beta / params.target_gamma;
    params.showButtons = true;
    params.alpha_p = 0;
    params.beta_gamma_p = 0;
    params.isTeacher = isTeacher;

    document.getElementById("content").innerHTML = ejs.views_slide_image_parameters(params);
    MathJax.typeset();

    if (isTeacher){
        for (let i = params.alpha.startIndex; i <= params.alpha.endIndex; i += params.alpha.step) {
            image_parameters_answers.alpha[i] = 0;
        };

        for (let j = params.beta.startIndex; j <= params.beta.endIndex; j += params.beta.step) {
            for (let k = params.gamma.startIndex; k <= params.gamma.endIndex; k += params.gamma.step) {
                image_parameters_answers.beta_gamma[j / k] = 0;
            }
        }
        
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

function updateImageParametersGraphs(){
    let total = Object.values(image_parameters_answers.alpha).reduce((a, b) => a + b, 0);
    let alpha_p = image_parameters_answers[target_alpha] / total;
    let beta_gamma_p = image_parameters_answers[target_beta_gamma] / total;
    document.getElementById("graphs_results").innerHTML = ejs.views_includes_teacher_image_parameters({ alpha_p, beta_gamma_p, showButtons: true});
}