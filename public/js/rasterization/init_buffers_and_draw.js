/**
 * This code was primarly created for assignment for Computer Graphics course at USI
 * by Jiří Heller, Marie Kalousková and Xiana Carrera Alonso
 * For Software Atelier 3: The Web project we modified it to make it more customizable and tangible 
 */

var triangle_vao;
var cube_vao;
var sphere_vao;
var plane_vao;

var is_triangle_shown;
var is_culling_on;
var is_depth_test_on;
var degrees_to_radians = 1 / 360 * 2 * Math.PI;

/* A function which takes the arrays containing values of the attributes,
             * and then, creates VBOa, VAOs, and sets up the attributes. 
             */
function createVAO(vao, shader, vertices, normals, colors){

    // a buffer for positions
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // a buffer for colors
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // a buffer for normals
    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "a_color");
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    if (normals !== undefined) {
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        var normalAttributeLocation = gl.getAttribLocation(shaderProgram, "a_normal");
        gl.enableVertexAttribArray(normalAttributeLocation);
        gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    } 
}

function initBuffers() {
    switch (currentSlideInfo.rasterizationType) {
        case "triangle_cube":
            cube_vao = gl.createVertexArray();
            createVAO(cube_vao, shaderProgram, cube_vertices, undefined, cube_colors);
        
            triangle_vao = gl.createVertexArray();
            createVAO(triangle_vao, shaderProgram, triangle_vertices, undefined, triangle_colors);
            break;
        case "phong_model":    
            cube_vao = gl.createVertexArray();
            createVAO(cube_vao, shaderProgram, cube_vertices_PM, cube_normals, cube_colors);
        
            sphere_vao = gl.createVertexArray();
            createVAO(sphere_vao, shaderProgram, sphere_vertices, sphere_normals, sphere_colors);
        
            plane_vao = gl.createVertexArray();
            createVAO(plane_vao, shaderProgram, plane_vertices, plane_normals, plane_colors);
            break;
        default:
            console.error("For this slide initBuffers is not supported.");
    }
}

function draw(params) {
    switch (currentSlideInfo.rasterizationType) {
        case "triangle_cube":
            draw_TC();
            break;
        case "phong_model":
            draw_PM(params);
    }
}

function draw_TC(){
    shaderProgram.rotationMatrix= gl.getUniformLocation(shaderProgram, "rotationMatrix");
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

    let requestID = window.requestAnimationFrame(draw_TC);
    // console.log("Requested animation frame with requestID = " + requestID);
    currentSlideInfo.requestID = requestID;
}

function getCameraPosition(params) {
    // input variables for controling camera
    let camera_azimuthal_angle = -45 * degrees_to_radians;
    let camera_polar_angle = 60 * degrees_to_radians;
    if (params.slider_camera_angles) {
        camera_azimuthal_angle = document.getElementById("camera_azimuthal_angle").value * degrees_to_radians;
        camera_polar_angle = document.getElementById("camera_polar_angle").value * degrees_to_radians;
    }
    let camera_distance = 100 / 10;
    if (params.slider_camera_distance) {
        camera_distance = document.getElementById("camera_distance").value / 10;
    }

    // computation of camera position
    let camera_x = camera_distance * Math.sin(camera_polar_angle) * Math.cos(camera_azimuthal_angle);
    let camera_y = camera_distance * Math.cos(camera_polar_angle);
    let camera_z = - camera_distance * Math.sin(camera_polar_angle) * Math.sin(camera_azimuthal_angle);
    return camera_position = vec3.fromValues(camera_x, camera_y, camera_z);
}

function draw_PM(params){
    let camera_position = getCameraPosition(params);

    // camera fov
    let camera_fov = 45 * degrees_to_radians;
    if (params.slider_camera_fov) {
        camera_fov = document.getElementById("camera_fov").value * degrees_to_radians;
    }
    
    // lights
    let light_azimuthal_angle = -70 * degrees_to_radians;
    let light_polar_angle = 60 * degrees_to_radians;
    if (params.slider_lights) {
        light_azimuthal_angle = document.getElementById("light_azimuthal_angle").value * degrees_to_radians;
        light_polar_angle = document.getElementById("light_polar_angle").value * degrees_to_radians;
    }
    const light_distance = 10;

    // computation of light position
    let light_x = light_distance * Math.sin(light_polar_angle) * Math.cos(light_azimuthal_angle);
    let light_y = light_distance * Math.cos(light_polar_angle);
    let light_z = - light_distance * Math.sin(light_polar_angle) * Math.sin(light_azimuthal_angle);
    let light_direction = vec3.fromValues(light_x, light_y, light_z);

    // definition of matrices
    var translation_matrix = mat4.create();
    var scaling_matrix = mat4.create();
    var model_matrix = mat4.create();
    var view_matrix = mat4.create();
    var projection_matrix = mat4.create();
    
    // computation of view and projection matrices (because they are the same for all objects)
    mat4.lookAt(view_matrix, camera_position, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
    let aspectRatio = gl.viewportWidth / gl.viewportHeight;
    mat4.perspective(projection_matrix, camera_fov, aspectRatio, 0.2, 30);

    // rendering area
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
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

    // setting all uniforms
    let model_matrix_location = gl.getUniformLocation(shaderProgram, "model_matrix");
    let view_matrix_location = gl.getUniformLocation(shaderProgram, "view_matrix");
    let projection_matrix_location = gl.getUniformLocation(shaderProgram, "projection_matrix");
    let light_direction_location = gl.getUniformLocation(shaderProgram, "light_direction");

    gl.uniformMatrix4fv(view_matrix_location, false, view_matrix);
    gl.uniformMatrix4fv(projection_matrix_location, false, projection_matrix);
    gl.uniform3fv(light_direction_location, light_direction);

    // gamma
    let gammaLocation = gl.getUniformLocation(shaderProgram, "gamma");
    let gamma = 2.2;
    if (params.slider_gamma) {
        gamma = document.getElementById("gamma_correction").value;
    }
    gl.uniform1f(gammaLocation, gamma);

    // tone mapping
    let alphaLocation = gl.getUniformLocation(shaderProgram, "alpha");
    let betaLocation = gl.getUniformLocation(shaderProgram, "beta");
    let alpha = 1;
    let beta = 1;
    if (params.slider_tone_mapping) {
        alpha = document.getElementById("alpha").value;
        beta = document.getElementById("beta").value;
    }
    gl.uniform1f(alphaLocation, alpha);
    gl.uniform1f(betaLocation, beta);
    
    // CUBE 1

    gl.bindVertexArray(cube_vao);

    mat4.fromTranslation(model_matrix, vec3.fromValues(1.5, 0, 0));
    gl.uniformMatrix4fv(model_matrix_location, false, model_matrix);

    gl.drawArrays(gl.TRIANGLES, 0, cube_vertices_PM.length/3);

    // CUBE 2

    mat4.fromTranslation(model_matrix, vec3.fromValues(-1.5, 0, 0));
    gl.uniformMatrix4fv(model_matrix_location, false, model_matrix);

    gl.drawArrays(gl.TRIANGLES, 0, cube_vertices_PM.length/3);

    // SPHERE 1

    gl.bindVertexArray(sphere_vao);

    mat4.fromTranslation(model_matrix, vec3.fromValues(0, 0, 0));
    gl.uniformMatrix4fv(model_matrix_location, false, model_matrix);

    gl.drawArrays(gl.TRIANGLES, 0, sphere_vertices.length/3);
    
    // PLANE

    gl.bindVertexArray(plane_vao);

    mat4.fromTranslation(translation_matrix, vec3.fromValues(0, -1, 0));
    mat4.fromScaling(scaling_matrix, vec3.fromValues(6, 6, 6));
    mat4.multiply(model_matrix, translation_matrix, scaling_matrix);
    gl.uniformMatrix4fv(model_matrix_location, false, model_matrix);

    gl.drawArrays(gl.TRIANGLES, 0, plane_vertices.length/3);

    let requestID = window.requestAnimationFrame(function() {draw_PM(params)});
    currentSlideInfo.requestID = requestID;
}
