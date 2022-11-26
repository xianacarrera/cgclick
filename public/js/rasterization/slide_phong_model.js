/**
 * This code was primarly created for assignment for Computer Graphics course at USI
 * by Jiří Heller, Marie Kalousková and Xiana Carrera Alonso
 * For Software Atelier 3: The Web project we modified it to make it more customizable and tangible 
 */

function start_slide_phong_model() {
    currentSlideInfo.rasterizationType = "phong_model";

    initWebGL();
    createGLSLPrograms();
    initBuffers();
    draw();
}
