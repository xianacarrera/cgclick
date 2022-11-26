function displaySlideOpenQuestion() {
    let question = "How are you?";
    document.getElementById("slide").innerHTML = ejs.views_slide_open_question({question});
    if (document.querySelector('a[href="0"]')) {
        document.querySelector('a[href="0"]').classList.add("active");
    }
    if (document.querySelector('a[href="1"]')) {
        document.querySelector('a[href="1"]').classList.remove("active");
    }
    if (document.querySelector('a[href="2"]')) {
        document.querySelector('a[href="2"]').classList.remove("active");
    }
}

function displaySlideTriangleCube() {
    let culling = true;
    let depth_test = true;
    document.getElementById("slide").innerHTML = ejs.views_slide_triangle_cube({culling, depth_test});
    start_slide_triangle_cube(culling, depth_test);
    if (document.querySelector('a[href="1"]')) {
        document.querySelector('a[href="1"]').classList.add("active");
    }
    if (document.querySelector('a[href="0"]')) {
        document.querySelector('a[href="0"]').classList.remove("active");
    }
    if (document.querySelector('a[href="2"]')) {
        document.querySelector('a[href="2"]').classList.remove("active");
    }
}

function displaySlidePhongModel() {
    document.getElementById("slide").innerHTML = ejs.views_slide_phong_model();
    start_slide_phong_model();
    if (document.querySelector('a[href="2"]')) {
        document.querySelector('a[href="2"]').classList.add("active");
    }
    if (document.querySelector('a[href="0"]')) {
        document.querySelector('a[href="0"]').classList.remove("active");
    }
    if (document.querySelector('a[href="1"]')) {
        document.querySelector('a[href="1"]').classList.remove("active");
    }
}

function leaveAndCancelAnimationFrame(){
    // console.log("Canceling animation frame with requestID = " + currentSlideInfo.requestID);
    window.cancelAnimationFrame(currentSlideInfo.requestID);
}
