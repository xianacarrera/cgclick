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
const DEGREES_TO_RADIANS = 1 / 360 * 2 * Math.PI;

// default values
const CAMERA_AZIMUTHAL_ANGLE = -45 * DEGREES_TO_RADIANS;
const CAMERA_POLAR_ANGLE = 60 * DEGREES_TO_RADIANS;
const CAMERA_DISTANCE = 100 / 10;
const CAMERA_FOV = 45 * DEGREES_TO_RADIANS;
const LIGHT_AZIMUTHAL_ANGLE = -70 * DEGREES_TO_RADIANS;
const LIGHT_POLAR_ANGLE = 60 * DEGREES_TO_RADIANS;
const LIGHT_DISTANCE = 10;
const GAMMA = 2;
const ALPHA = 1;
const BETA = 1;

/* A function which takes the arrays containing values of the attributes,
             * and then, creates VBOa, VAOs, and sets up the attributes. 
             */
function createVAO(vao, shader, vertices, normals, colors) {

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

    if (!(currentSlideInfo.rasterizationType == "custom_shaders") || document.getElementById("a_color")?.checked) {
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "a_color");
        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    }

    if (normals !== undefined && (!(currentSlideInfo.rasterizationType == "custom_shaders") || document.getElementById("a_normal")?.checked)) {
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        var normalAttributeLocation = gl.getAttribLocation(shaderProgram, "a_normal");
        gl.enableVertexAttribArray(normalAttributeLocation);
        gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    }
}

function initBuffers() {
    triangle_vao = gl.createVertexArray();
    createVAO(triangle_vao, shaderProgram, triangle_vertices, triangle_normals, triangle_colors);

    cube_vao = gl.createVertexArray();
    createVAO(cube_vao, shaderProgram, cube_vertices, cube_normals, cube_colors);

    sphere_vao = gl.createVertexArray();
    createVAO(sphere_vao, shaderProgram, sphere_vertices, sphere_normals, sphere_colors);

    plane_vao = gl.createVertexArray();
    createVAO(plane_vao, shaderProgram, plane_vertices, plane_normals, plane_colors);
}

function getCameraPosition(params) {
    // input variables for controling camera
    let camera_azimuthal_angle = CAMERA_AZIMUTHAL_ANGLE;
    let camera_polar_angle = CAMERA_POLAR_ANGLE;
    if (params.slider_camera_angles) {
        camera_azimuthal_angle = document.getElementById("camera_azimuthal_angle").value * DEGREES_TO_RADIANS;
        camera_polar_angle = document.getElementById("camera_polar_angle").value * DEGREES_TO_RADIANS;
    }
    let camera_distance = CAMERA_DISTANCE;
    if (params.slider_camera_distance) {
        camera_distance = document.getElementById("camera_distance").value / 10;
    }

    // computation of camera position
    let camera_x = camera_distance * Math.sin(camera_polar_angle) * Math.cos(camera_azimuthal_angle);
    let camera_y = camera_distance * Math.cos(camera_polar_angle);
    let camera_z = - camera_distance * Math.sin(camera_polar_angle) * Math.sin(camera_azimuthal_angle);
    return vec3.fromValues(camera_x, camera_y, camera_z);
}

function getLightDirection(params) {
    // input variables for controling light
    let light_azimuthal_angle = LIGHT_AZIMUTHAL_ANGLE;
    let light_polar_angle = LIGHT_POLAR_ANGLE;
    if (params.slider_lights) {
        light_azimuthal_angle = document.getElementById("light_azimuthal_angle").value * DEGREES_TO_RADIANS;
        light_polar_angle = document.getElementById("light_polar_angle").value * DEGREES_TO_RADIANS;
    }

    // computation of light position
    let light_x = LIGHT_DISTANCE * Math.sin(light_polar_angle) * Math.cos(light_azimuthal_angle);
    let light_y = LIGHT_DISTANCE * Math.cos(light_polar_angle);
    let light_z = - LIGHT_DISTANCE * Math.sin(light_polar_angle) * Math.sin(light_azimuthal_angle);
    return vec3.fromValues(light_x, light_y, light_z);
}

function setUniform(unif, unifname, func, nargs) {
    if (currentSlideInfo.rasterizationType == "custom_shaders" && !document.getElementById(unifname).checked) return;

    if (nargs == 2) {
        (func.bind(gl, gl.getUniformLocation(shaderProgram, unifname), unif))();
    } else if (nargs == 3) {
        (func.bind(gl, gl.getUniformLocation(shaderProgram, unifname), false, unif))();
    }
}

function draw(params) {
    let camera_position = getCameraPosition(params);

    // camera fov
    let camera_fov = CAMERA_FOV;
    if (params.slider_camera_fov) {
        camera_fov = document.getElementById("camera_fov").value * DEGREES_TO_RADIANS;
    }

    let light_direction = getLightDirection(params);

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
    if (is_culling_on) { gl.enable(gl.CULL_FACE); }
    else { gl.disable(gl.CULL_FACE); }

    if (is_depth_test_on) { gl.enable(gl.DEPTH_TEST); }
    else { gl.disable(gl.DEPTH_TEST); }

    // enable the GLSL program for the rendering
    gl.useProgram(shaderProgram);

    // setting all uniforms
    setUniform(view_matrix, "view_matrix", gl.uniformMatrix4fv, 3);
    setUniform(projection_matrix, "projection_matrix", gl.uniformMatrix4fv, 3);
    setUniform(light_direction, "light_direction", gl.uniform3fv, 2);

    // gamma
    let gamma = GAMMA;
    if (params.slider_gamma) {
        gamma = document.getElementById("gamma_correction").value;
    }
    setUniform(gamma, "gamma", gl.uniform1f, 2);

    // tone mapping
    let alpha = ALPHA;
    let beta = BETA;
    if (params.slider_tone_mapping) {
        alpha = document.getElementById("alpha").value;
        beta = document.getElementById("beta").value;
    }
    setUniform(alpha, "alpha", gl.uniform1f, 2);
    setUniform(beta, "beta", gl.uniform1f, 2);

    let scene_dropdown = document.getElementById("scene");
    let scene = scene_dropdown?.options[scene_dropdown.selectedIndex].value || "complex";
    // let scene = "complex";

    if (scene == "triangle") {

        gl.bindVertexArray(triangle_vao);

        mat4.fromTranslation(model_matrix, vec3.fromValues(0, 0, 0));
        mat4.fromScaling(scaling_matrix, vec3.fromValues(5, 5, 5))
        mat4.multiply(model_matrix, translation_matrix, scaling_matrix);
        setUniform(model_matrix, "model_matrix", gl.uniformMatrix4fv, 3);

        gl.drawArrays(gl.TRIANGLES, 0, 3);

    } else if (scene == "cube") {

        gl.bindVertexArray(cube_vao);

        mat4.fromTranslation(model_matrix, vec3.fromValues(0, 0, 0));
        mat4.fromScaling(scaling_matrix, vec3.fromValues(3, 3, 3))
        mat4.multiply(model_matrix, translation_matrix, scaling_matrix);
        setUniform(model_matrix, "model_matrix", gl.uniformMatrix4fv, 3);

        gl.drawArrays(gl.TRIANGLES, 0, 12 * 3);

    } else if (scene == "complex") {

        // CUBE 1

        gl.bindVertexArray(cube_vao);

        mat4.fromTranslation(model_matrix, vec3.fromValues(1.5, 0, 0));
        setUniform(model_matrix, "model_matrix", gl.uniformMatrix4fv, 3);

        gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length / 3);

        // CUBE 2

        mat4.fromTranslation(model_matrix, vec3.fromValues(-1.5, 0, 0));
        setUniform(model_matrix, "model_matrix", gl.uniformMatrix4fv, 3);

        gl.drawArrays(gl.TRIANGLES, 0, cube_vertices.length / 3);

        // SPHERE 1

        gl.bindVertexArray(sphere_vao);

        mat4.fromTranslation(model_matrix, vec3.fromValues(0, 0, 0));
        setUniform(model_matrix, "model_matrix", gl.uniformMatrix4fv, 3);

        gl.drawArrays(gl.TRIANGLES, 0, sphere_vertices.length / 3);

        // PLANE

        gl.bindVertexArray(plane_vao);

        mat4.fromTranslation(translation_matrix, vec3.fromValues(0, -1, 0));
        mat4.fromScaling(scaling_matrix, vec3.fromValues(6, 6, 6));
        mat4.multiply(model_matrix, translation_matrix, scaling_matrix);
        setUniform(model_matrix, "model_matrix", gl.uniformMatrix4fv, 3);

        gl.drawArrays(gl.TRIANGLES, 0, plane_vertices.length / 3);

    }

    let requestID = window.requestAnimationFrame(function () { draw(params) });
    currentSlideInfo.requestID = requestID;
}
