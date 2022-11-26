function changeActiveClass(newSlide){
    for (let i = 0; i < 3; i++){
        if (i == newSlide) {
            document.querySelector(`a[href="${newSlide}"]`).classList.add("active");
        } else {
            document.querySelector(`a[href="${i}"]`).classList.remove("active");
        }
    }
}

function displaySlideOpenQuestion(){
    let question = "How are you?";
    document.getElementById("slide").innerHTML = ejs.views_slide_open_question({question});
    changeActiveClass(0);
}

function displaySlideTriangleCube(){
    let culling = true;
    let depth_test = true;
    document.getElementById("slide").innerHTML = ejs.views_slide_triangle_cube({culling, depth_test});
    start_slide_triangle_cube(culling, depth_test);
    changeActiveClass(1);
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

    changeActiveClass(2);
}