/*
function displaySlideOpenQuestion() {
    let question = "How are you?";
    document.getElementById("slide").innerHTML = ejs.views_slide_open_question({ question });
}
*/

function displaySlideTriangleCube(params) {
    document.getElementById("slide").innerHTML = ejs.views_slide_triangle_cube(params);
    start_slide_triangle_cube(params);
}

// The element starts to be dragged
function boxDragStart(e) {
    // Data is transferred between dragstart and drop events using dataTransfer
    // In this case, it will have a plain text format. The information passed is the id of the option
    e.dataTransfer.setData("text/plain", e.target.id);
    e.target.classList.add("bg-dark")      // Add a background color
    e.target.classList.add("text-white")   // Add a text color

    // Remove the background from previous drags
    e.target.classList.remove("bg-white");
    e.target.classList.remove("text-dark");

    setTimeout(() => {      // So that the dragged element is not affected
        e.target.classList.add("bg-white");
        e.target.classList.add("text-white");

        // The original option doesn't react to drag events
        e.target.removeEventListener("dragenter", boxDragEnter);
        e.target.removeEventListener("dragover", boxDragOver);
        e.target.removeEventListener("dragleave", boxDragLeave);
    }, 0);
}

// The element is dragged over an area where it can be dropped 
// e.target is the area 
function boxDragEnter(e) {
    e.preventDefault();     // Make the drop target valid
    e.target.classList.remove("bg-white");
    e.target.classList.add("bg-info");
}

// The element is being dragged over an area where it can be dropped (fires continuously)
// e.target is the area 
function boxDragOver(e) {
    e.preventDefault();     // Make the drop target valid
    e.target.classList.remove("bg-white");
    e.target.classList.add("bg-info");
}

// The element is dragged out of an area where it could have been dropped
// e.target is the area 
function boxDragLeave(e) {
    e.target.classList.remove("bg-info");
    e.target.classList.add("bg-white");
}

// The element is dropped on a target
// e.target is the area 
function boxDrop(e) {
    // Get the id of the option
    let optionId = e.dataTransfer.getData("text/plain");
    let option = document.getElementById(optionId);

    // Swap the option with the target
    [e.target.textContent, option.textContent] = [option.textContent, e.target.textContent];

    e.preventDefault();  

    // Restore drag events on the original option
    option.addEventListener("dragenter", boxDragEnter);
    option.addEventListener("dragover", boxDragOver);
    option.addEventListener("dragleave", boxDragLeave);

    // Remove the background color and make the element visible
    e.target.classList.remove("bg-info");
    option.classList.remove("hide");
    option.classList.remove("bg-dark")      // Remove the background
    option.classList.remove("text-white")   // Remove the text color
    option.classList.add("text-dark")       // Reset the text color
}

function displaySlideParametrization() {
    document.getElementById("slide").innerHTML = ejs.views_slide_parametrization({});
    document.querySelectorAll("input[name='param_options']").forEach(input => input.addEventListener("change", showShape));
    document.querySelectorAll(".drop-box.card").forEach(box => {
        box.addEventListener("dragstart", boxDragStart);
        box.addEventListener("dragenter", boxDragEnter);
        box.addEventListener("dragover", boxDragOver);
        box.addEventListener("dragleave", boxDragLeave);
        box.addEventListener("drop", boxDrop);
    });

    MathJax.typeset();
    showShape();
}

function displaySlidePhongModel() {
    document.getElementById("slide").innerHTML = ejs.views_slide_phong_model({});
    start_slide_phong_model();
}

function showShape() {
    threeAPI.initScene();
    let checkedOption = document.querySelector("input[name='param_options']:checked");
    if (checkedOption) {
        let shapeIndex = checkedOption.value;
        threeAPI.createParametricGeometry(threeAPI.presetGeometries[shapeIndex]);
        threeAPI.animate();
    } else {
        threeAPI.clear();
    }
}

function displayAboutSlide(params) {
    document.getElementById("slide").innerHTML = ejs.views_slide_about(params);
    document.querySelectorAll("img").forEach(img => img.addEventListener("click", (event) => {
        document.querySelectorAll("img").forEach(img => {
            if (img !== event.target) {
                img.classList.remove("clicked_image");
            } else {
                img.classList.toggle("clicked_image");
            }
        });
    }));
}


function leaveAndCancelAnimationFrame() {
    // console.log("Canceling animation frame with requestID = " + currentSlideInfo.requestID);
    window.cancelAnimationFrame(currentSlideInfo.requestID);
}

function displaySlideMidpoint() {
    document.getElementById("slide").innerHTML = ejs.views_slide_midpoint({});
    startMidpoint();
    addMidpointListeners();
}

function displaySlideImageParameters() {
    document.getElementById("slide").innerHTML = ejs.views_slide_image_parameters({});
    ip_start(
        { azimuthal: -70, polar: 60 },                           // Directional light
        { x: -200, y: 150, z: -40, intensity: 30 },              // Point light
        { azimuthal: -45, polar: 60, distance: 150, fov: 45 },   // Camera
        { gamma: 2, tone_mapping_alpha: 1, tone_mapping_beta: 1 }
    );

    // The student provides a right answer if alpha is 1 and beta / gamma is 1/2
}
