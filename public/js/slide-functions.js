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

function displaySlideParametrization(){
    document.getElementById("slide").innerHTML = ejs.views_slide_parametrization({});
    document.querySelectorAll("input[name='param_options']").forEach(input => input.addEventListener("change", showShape));
    MathJax.typeset();
    showShape();
    changeActiveClass(2);
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
