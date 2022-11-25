


var cube_vao;     // The vertex array object for the cube
var sphere_vao;   // The vertex array object for the sphere
var plane_vao;    // The vertex array object for the plane

/**
 * Define all the necessary buffers and set them up in vertex array objects (VAOs).
 */
function initBuffers(){
    // Create a VAO for the cube, setting up the vertices, normals and colors
    cube_vao = gl.createVertexArray();
    createVAO(cube_vao, shaderProgram, cube_vertices, cube_normals, cube_colors);

    // Create a VAO for the sphere, setting up the vertices, normals and colors
    sphere_vao = gl.createVertexArray();
    createVAO(sphere_vao, shaderProgram, sphere_vertices, sphere_normals, sphere_colors);

    // Create a VAO for the plane, setting up the vertices, normals and colors
    plane_vao = gl.createVertexArray();
    createVAO(plane_vao, shaderProgram, plane_vertices, plane_normals, plane_colors);
}


/**
 * Create a VAO for an object with vertices, normals and colors data.
 * @param {WebGLVertexArrayObject} vao - The VAO to set up.
 * @param {WebGLProgram} shader - The shader program to use.
 * @param {Array} vertices - The vertices data (3 components, floats).
 * @param {Array} normals - The normals data (3 components, floats).
 * @param {Array} colors - The colors data (3 components, floats).
 */
function createVAO(vao, shader, vertices, normals, colors){
    // Create a VBO for each attribute
    var vertexBuffer = create_buffer(vertices);
    var normalBuffer = create_buffer(normals);
    var colorBuffer = create_buffer(colors);

    /* At this point, the data is already on the GPU, but the shaders don't know how to access it. 
     * We need to specify the data flow through the graphics pipeline.
     * To do so, we set up the VAO . They will indicate the state of attributes, which buffers (VBOs)
     * they are bound to, and how to access them. VAOs allow us to easily switch between different objects
     * without having to set the attributes each time we render.
     * In this case, we have three attributes: a_position, a_normal and a_color.
     */


    gl.bindVertexArray(vao);        // Bind the VAO
    // Connect each buffer with the respective attribute. All are vec3, so we have 3 components per vertex, all of them floats.
    setupArrayBuffer(vertexBuffer, shader, "a_position", 3, gl.FLOAT);
    setupArrayBuffer(normalBuffer, shader, "a_normal", 3, gl.FLOAT);
    setupArrayBuffer(colorBuffer, shader, "a_color", 3, gl.FLOAT);
}


/**
 * Create a buffer in the GPU and send there the related data.
 * @param {Array} data - The data to fill the buffer with (positions, colors, etc.).
 */
function create_buffer(data){
    // Create a WebGLBuffer
    var buffer = gl.createBuffer();             
    // Mark the buffer as active
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);     
    // Copy the data from the CPU to the buffer (GPU)
    // gl.ARRAY_BUFFER (i.e., vertex attributes) is the target. Then we provide an ArrayBuffer with the data itself, and finally we specify the
    // usage (in this case, we won't change the data, so we use STATIC_DRAW).
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return buffer;
}

/**
 * Set up an array buffer and the attributes for rendering.
 * @param {WebGLBuffer} buffer - The buffer to set up.
 * @param {WebGLProgram} shader - The shader program to use.
 * @param {String} attributeLocation - The name of the attribute in the vertex shader GLSL code.
 * @param {Number} numElemsPerVertex - The number of components per attribute.
 * @param {Number} type - The data type of the attribute.
 */
function setupArrayBuffer(buffer, shader, attributeLocation, numElemsPerVertex, type){
    // Bind the buffer with vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Get position of the attribute in the vertex shader using its name
    var positionAttributeLocation = gl.getAttribLocation(shader, attributeLocation);
    // Enable attribute for the positions / colors
    gl.enableVertexAttribArray(positionAttributeLocation);
    // Bind the vertex buffer with positions / colors to the position / color attribute
    // The last 3 parameters are normalized, stride and offset, but we don't need them
    gl.vertexAttribPointer(positionAttributeLocation, numElemsPerVertex, type, false, 0, 0);
}

