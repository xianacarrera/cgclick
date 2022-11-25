/**
 * This code was primarly created for assignment for Computer Graphics course at USI
 * by Jiří Heller, Marie Kalousková and Xiana Carrera Alonso
 * For Software Atelier 3: The Web project we modified it a little bit to make it more tangible
 */

var triangle_vao;
var cube_vao;

var is_triangle_shown;
var is_culling_on;
var is_depth_test_on;

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
    gl.clear(gl.DEPTH_BUFFER_BIT);

    // Enable/disable face culling and depth test

    if (is_culling_on) {
        gl.enable(gl.CULL_FACE);
    }
    else {
        gl.disable(gl.CULL_FACE);
    }

    if (is_depth_test_on) {
        gl.enable(gl.DEPTH_TEST);
    }
    else {
        gl.disable(gl.DEPTH_TEST);
    }

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
