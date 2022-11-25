


var ip_cube_vao;     // The vertex array object for the cube
var ip_sphere_vao;   // The vertex array object for the sphere
var ip_plane_vao;    // The vertex array object for the plane

/**
 * Define all the necessary buffers and set them up in vertex array objects (VAOs).
 */
function ip_initBuffers(){
    // Create a VAO for the cube, setting up the vertices, normals and colors
    ip_cube_vao = gl.createVertexArray();
    ip_createVAO(ip_cube_vao, ip_shaderProgram, ip_cube_vertices, ip_cube_normals, ip_cube_colors);

    // Create a VAO for the sphere, setting up the vertices, normals and colors
    ip_sphere_vao = gl.createVertexArray();
    ip_createVAO(ip_sphere_vao, ip_shaderProgram, ip_sphere_vertices, ip_sphere_normals, ip_sphere_colors);

    // Create a VAO for the plane, setting up the vertices, normals and colors
    ip_plane_vao = gl.createVertexArray();
    ip_createVAO(ip_plane_vao, ip_shaderProgram, ip_plane_vertices, ip_plane_normals, ip_plane_colors);
}


/**
 * Create a VAO for an object with vertices, normals and colors data.
 * @param {WebGLVertexArrayObject} vao - The VAO to set up.
 * @param {WebGLProgram} shader - The shader program to use.
 * @param {Array} vertices - The vertices data (3 components, floats).
 * @param {Array} normals - The normals data (3 components, floats).
 * @param {Array} colors - The colors data (3 components, floats).
 */
function ip_createVAO(vao, shader, vertices, normals, colors){
    // Create a VBO for each attribute
    var vertexBuffer = ip_create_buffer(vertices);
    var normalBuffer = ip_create_buffer(normals);
    var colorBuffer = ip_create_buffer(colors);

    /* At this point, the data is already on the GPU, but the shaders don't know how to access it. 
     * We need to specify the data flow through the graphics pipeline.
     * To do so, we set up the VAO . They will indicate the state of attributes, which buffers (VBOs)
     * they are bound to, and how to access them. VAOs allow us to easily switch between different objects
     * without having to set the attributes each time we render.
     * In this case, we have three attributes: a_position, a_normal and a_color.
     */


    gl.bindVertexArray(vao);        // Bind the VAO
    // Connect each buffer with the respective attribute. All are vec3, so we have 3 components per vertex, all of them floats.
    ip_setupArrayBuffer(vertexBuffer, shader, "a_position", 3, gl.FLOAT);
    ip_setupArrayBuffer(normalBuffer, shader, "a_normal", 3, gl.FLOAT);
    ip_setupArrayBuffer(colorBuffer, shader, "a_color", 3, gl.FLOAT);
}


/**
 * Create a buffer in the GPU and send there the related data.
 * @param {Array} data - The data to fill the buffer with (positions, colors, etc.).
 */
function ip_create_buffer(data){
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
function ip_setupArrayBuffer(buffer, shader, attributeLocation, numElemsPerVertex, type){
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

