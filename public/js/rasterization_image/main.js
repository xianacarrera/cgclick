

function start(){
    // Initialize WebGL
    initWebGL();                // webgl-context.js
    // Create GLSL programs
    createGLSLPrograms();       // shaders.js
    // Initialize all the buffers and set up the vertex array objects (VAO)
    initBuffers();              // buffers.js & geometry.js
    // Draw
    draw();                     // drawing.js
}