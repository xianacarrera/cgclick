

var precomputed_directional_light = {};
var precomputed_camera = {};
var precomputed_point_light = {};
var answers = {};

function ip_start(dl, pl, camera, ans){
    precomputed_directional_light = dl;
    precomputed_point_light = pl;
    precomputed_camera = camera;
    answers = ans;

    // Initialize WebGL
    ip_initWebGL("question-webgl-canvas");                // webgl-context.js
    // Create GLSL programs
    ip_createGLSLPrograms();       // shaders.js
    // Initialize all the buffers and set up the vertex array objects (VAO)
    ip_initBuffers();              // buffers.js & geometry.js
    // Draw
    ip_draw(true);                 // drawing.js using answers

}