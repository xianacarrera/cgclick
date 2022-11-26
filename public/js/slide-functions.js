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

function displaySlideMidpoint(){
    document.getElementById("slide").innerHTML = ejs.views_slide_midpoint({});
    changeActiveClass(2);
    selectStartTile();
    addTileListeners();
}