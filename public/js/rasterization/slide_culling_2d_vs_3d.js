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
var triangle_vao;
var cube_vao;

var is_triangle_shown;
var is_culling_on;

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

/**
* @param[in] vertices, color, vao
*/
function initBuffers(vertices, colors, shape){
 // Create buffers on the GPU and copy there our data
 var vertexBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
 // copy the data from the CPU to the buffer (GPU)
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


 // Create a buffer for color
 var colorBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


 // Specify how the data will flow through the graphics pipeline by setting up
 // the vertex array objects which store information about buffers and how the connect to attributes.

 if (shape == "cube") {
     // create a vertex array object (VAO) to store information about buffers and attributes
     cube_vao = gl.createVertexArray();
     // bind the VAO
     gl.bindVertexArray(cube_vao);
 } else if (shape == "triangle") {
     triangle_vao = gl.createVertexArray();
     gl.bindVertexArray(triangle_vao);
 } else {
     console.error("Unknown shape in initBuffers()");
 }

 // Set up all the buffers and attributes for rendering
 gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
 var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
 gl.enableVertexAttribArray(positionAttributeLocation);
 gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);


 // Configure the attributes for color 
 gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
 var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "a_color");
 gl.enableVertexAttribArray(colorAttributeLocation);
 gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
}

/**
* @param
*/
function draw(){
 var rotation = document.getElementById("rotation");
 var rotationMatrix = mat4.create();
 mat4.fromRotation(rotationMatrix, -(rotation.value-100)/100*Math.PI, vec3.fromValues(-0.2,1,0));

 // set the size of our rendering area
 gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

 // setting the background color
 gl.clearColor(0.2, 0.2, 0.2, 1.0);
 // clear the rendering area
 gl.clear(gl.COLOR_BUFFER_BIT);

 // Enable/disable face culling and depth test

 if (is_culling_on) {
     gl.enable(gl.CULL_FACE);
 }
 else {
     gl.disable(gl.CULL_FACE);
 }

 gl.enable(gl.DEPTH_TEST);

 // enable the GLSL program for the rendering
 gl.useProgram(shaderProgram);
 gl.uniformMatrix4fv(shaderProgram.rotationMatrix, false, rotationMatrix); // extra code for interactive rotation, it does need to be modified

 // bind the VAO
 if (is_triangle_shown) {
     gl.bindVertexArray(triangle_vao);
     gl.drawArrays(gl.TRIANGLES, 0, 3);
 } else {
     gl.bindVertexArray(cube_vao);
     gl.drawArrays(gl.TRIANGLES, 0, 12*3);
 }

 window.requestAnimationFrame(draw);
}

function start() {
 // initialze WebGL
 initWebGL();
 // create GLSL programs
 createGLSLPrograms();

 // init both VAOs
 initBuffers(triangle_vertices, triangle_colors, "triangle");
 initBuffers(cube_vertices, cube_colors, "cube");

 // default (first) shape is a triangle
 is_triangle_shown = true;
 is_culling_on = true;

 let shape_selector = document.getElementById("shape-selector");
 shape_selector.addEventListener("change", (e) => {
     if (shape_selector.checked) {
         is_triangle_shown = false;
     }
     else {
         is_triangle_shown = true;
     }
 });

 let culling_button_on = document.getElementById("culling_on");
 culling_button_on.addEventListener("change", (e) => {
     if (culling_button_on.checked) {
         is_culling_on = true;
     }
 });

 let culling_button_off = document.getElementById("culling_off");
 culling_button_off.addEventListener("change", (e) => {
     if (culling_button_off.checked) {
         is_culling_on = false;
     }
 });

 draw();
}
