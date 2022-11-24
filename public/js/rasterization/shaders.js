/**
 * This code was primarly created for assignment for Computer Graphics course at USI
 * by Jiří Heller, Marie Kalousková and Xiana Carrera Alonso
 * For Software Atelier 3: The Web project we modified it a little bit to make it more tangible
 */

 var vertexShaderCode =
 `#version 300 es
 in vec3 a_position;
 in vec3 a_color;

 uniform mat4 rotationMatrix;
 out vec3 v_color;
 void main(){
     v_color = a_color;
     gl_Position = rotationMatrix * vec4(a_position,1.0); // extra code for interactive rotation, it does need to be modified
 }`;

var fragmentShaderCode =
 `#version 300 es
 precision mediump float;
 in vec3 v_color;

 out vec4 out_color;
 void main(){
     out_color = vec4(v_color, 1.0);
 }`;

var gl; // WebGL context
var shaderProgram; // the GLSL program we will use for rendering

function compileShader(shader, source, type, name = ""){
    // link the source of the shader to the shader object
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success){
        console.log(name + " shader compiled succesfully.");
    }else{
        console.log(name + " vertex shader error.")
        console.log(gl.getShaderInfoLog(shader));
    }
}
   
   // This function links the GLSL program by combining different shaders
function linkProgram(program,vertShader,fragShader){
    gl.attachShader(program,vertShader);
    gl.attachShader(program,fragShader);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("The shaders are initialized.");
    }else{
        console.log("Could not initialize shaders.");
    }
}
   
function createGLSLPrograms(){
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    compileShader(vertexShader, vertexShaderCode, gl.VERTEX_SHADER, "Vertex shader");
    // Creating fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    compileShader(fragmentShader, fragmentShaderCode, gl.VERTEX_SHADER, "Fragment shader");
    // Creating and linking the program
    shaderProgram = gl.createProgram();
    linkProgram(shaderProgram, vertexShader, fragmentShader);
   
    shaderProgram.rotationMatrix= gl.getUniformLocation(shaderProgram, "rotationMatrix"); // extra code for interactive rotation, it does need to be modified
}

// The function initilize the WebGL canvas
function initWebGL(){
    var canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
   
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
   
    if(gl){
        console.log("WebGL succesfully initialized.");
    }else{
        console.log("Failed to initialize WebGL.")
    }
}
