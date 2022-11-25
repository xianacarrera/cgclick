

function ip_start(directional_light){
    // Initialize WebGL
    ip_initWebGL();                // webgl-context.js
    // Create GLSL programs
    ip_createGLSLPrograms();       // shaders.js
    // Initialize all the buffers and set up the vertex array objects (VAO)
    ip_initBuffers();              // buffers.js & geometry.js
    // Draw
    ip_draw(directional_light);                     // drawing.js
}