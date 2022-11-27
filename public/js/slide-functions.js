function displaySlideOpenQuestion(){
    let question = "How are you?";
    document.getElementById("slide").innerHTML = ejs.views_slide_open_question({question});
}

function displaySlideTriangleCube() {
    let culling = true;
    let depth_test = true;
    document.getElementById("slide").innerHTML = ejs.views_slide_triangle_cube({culling, depth_test});
    start_slide_triangle_cube(culling, depth_test);
}

function displaySlideParametrization(){
    document.getElementById("slide").innerHTML = ejs.views_slide_parametrization({});
    document.querySelectorAll("input[name='param_options']").forEach(input => input.addEventListener("change", showShape));
    MathJax.typeset();
    showShape();
}

function displaySlidePhongModel() {
    document.getElementById("slide").innerHTML = ejs.views_slide_phong_model({});
    start_slide_phong_model();
}

function showShape(){
    threeAPI.initScene();
    let checkedOption = document.querySelector("input[name='param_options']:checked");
    if (checkedOption){
        let shapeIndex = checkedOption.value;
        threeAPI.createParametricGeometry(threeAPI.presetGeometries[shapeIndex]);
        threeAPI.animate();
    } else {
        threeAPI.clear();
    }
}

function leaveAndCancelAnimationFrame(){
    // console.log("Canceling animation frame with requestID = " + currentSlideInfo.requestID);
    window.cancelAnimationFrame(currentSlideInfo.requestID);
}

function displaySlideMidpoint(){
    document.getElementById("slide").innerHTML = ejs.views_slide_midpoint({});
    selectStartTile();
    addMidpointListeners();
}

function displaySlideImageParameters(){
    document.getElementById("slide").innerHTML = ejs.views_slide_image_parameters({});
    ip_start(
        {azimuthal: -70, polar: 60},                           // Directional light
        {x: -200, y: 150, z: -40, intensity: 30},              // Point light
        {azimuthal: -45, polar: 60, distance: 150, fov: 45},   // Camera
        {gamma: 2, tone_mapping_alpha: 1, tone_mapping_beta: 1}
    );

    // The student provides a right answer if alpha is 1 and beta / gamma is 1/2
}
