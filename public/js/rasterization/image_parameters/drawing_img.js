

var ip_viewMatrix;             // Viewing transformation (from world to viewing coordinates)
var ip_projectionMatrix;       // Projection transformation (from viewing to normalized coordinates)

/**
 * Draw the scene
 */
function ip_draw(drawX = 0){
    /******************** Get input from the user and define view and projection matrices   *******************/

    let [camera_position, camera_fov] = ip_get_camera_input();

    // Compute the view and projection matrices based on the camera position and field of view.
    ip_defineViewProjectionMatrices(camera_position, camera_fov);

    let [light_direction, plight_position, plight_position_vec4, plight_intensity] = ip_get_light_input();

    for (let i = 0; i < 2; i += 1){
        let gamma, tone_mapping_alpha, tone_mapping_beta;
        if (i == 0){                // Use answers
            gamma = answers.gamma;
            tone_mapping_alpha = answers.tone_mapping_alpha;
            tone_mapping_beta = answers.tone_mapping_beta;
        } else {
           [gamma, tone_mapping_alpha, tone_mapping_beta] = ip_get_student_answers();
        }

        /**************************************** Settings ********************************************************/


        // Set the size of our rendering area and the background color
        // Activate depth test and face culling for drawing the spheres and cubes
        ip_set_general_settings(drawX);     
        drawX = (drawX + gl.viewportWidth) % (gl.viewportWidth * 2);


        /*********************************** Initiate the rendering ***********************************************/

        // Enable the GLSL program for the rendering
        gl.useProgram(ip_shaderProgram);

        // console.log(`${i}: gamma: ${gamma}, alpha: ${tone_mapping_alpha}, beta: ${tone_mapping_beta}`);

        // Set most of the shader uniforms: view and projection matrices, light direction, point light position and point light intensity
        ip_set_general_uniforms(light_direction, plight_position_vec4, plight_intensity, gamma, tone_mapping_alpha, tone_mapping_beta);

        // Draw all the objects. Also set the model matrix for each object as a shader uniform.
        // The plane is drawn without face culling.
        ip_draw_shapes(plight_position);
    }

    let requestID = window.requestAnimationFrame(function() {ip_draw(drawX);});
    // console.log("Requested animation frame with requestID = " + requestID);
    currentSlideInfo.requestID = requestID;
    // window.requestAnimationFrame(function() {ip_draw(drawX);});
}


/**
 * Get the input from the student for the questions asked.
 */
function ip_get_student_answers(){
    let gamma = document.getElementById("gamma_input").value;
    let tone_mapping_alpha = document.getElementById("alpha_input").value;
    let tone_mapping_beta = document.getElementById("beta_input").value;
    return [gamma, tone_mapping_alpha, tone_mapping_beta];
}


/**
 * Get the user input from the camera sliders and return the camera position and field of view.
 */
function ip_get_camera_input(){
    let [x, y, z] = polar_to_cartesian(
        precomputed_camera.azimuthal / 360 * 2 * Math.PI,
        precomputed_camera.polar / 360 * 2 * Math.PI,
        precomputed_camera.distance / 10
    );
    
    let camera_position = vec3.fromValues(x, y, z);
    let camera_fov = precomputed_camera.fov / 360 * 2 * Math.PI;
    return [camera_position, camera_fov];
}

/**
 * Get the user input for the directional and point lights and return the light direction, point light position and point light intensity.
 */
function ip_get_light_input(){
    let [light_x, light_y, light_z] = polar_to_cartesian(
        precomputed_directional_light.azimuthal / 360 * 2 * Math.PI, 
        precomputed_directional_light.polar / 360 * 2 * Math.PI
    );
    let light_direction = vec4.fromValues(light_x, light_y, light_z, 0.0);   // Add a 4th component to be multiplied by the view matrix
    vec4.transformMat4(light_direction, light_direction, ip_viewMatrix);        // Transform the light direction from wold to view coordinates

    // Get the cartesian coordinates of the point light source
    let plight_x = precomputed_point_light.x / 100;
    let plight_y = precomputed_point_light.y / 100 + 0.7;       // Add 0.7 so that the light is above all other objects
    let plight_z = precomputed_point_light.z / 100;
    // Create two vectors with the same value, but one with 1.0 as the last component to be multiplied by the view matrix
    let plight_position = vec3.fromValues(plight_x, plight_y, plight_z);
    let plight_position_vec4 = vec4.fromValues(plight_x, plight_y, plight_z, 1.0);
    vec4.transformMat4(plight_position_vec4, plight_position_vec4, ip_viewMatrix);

    let int = precomputed_point_light.intensity / 100;        
    // The point light color will be in gray scale, since it has the same value in all components
    let plight_intensity = vec3.fromValues(int, int, int);         

    return [light_direction, plight_position, plight_position_vec4, plight_intensity];
}

/**
 * Get the light direction as a vec4 from its azimuthal and polar angles
 * @param {Number} azimuthal
 * @param {Number} polar
 */
function polar_to_cartesian(azimuthal, polar, distance = 1){
    let x = distance * Math.sin(polar) * Math.sin(azimuthal);
    let y = distance * Math.cos(polar);
    let z = distance * Math.sin(polar) * Math.cos(azimuthal);
    return [x, y, z];
}




/**
 * Compute the view and projection matrices based on the camera position and field of view.
 * @param {vec3} camera_position    Camera position in cartesian coordinates
 * @param {float} camera_fov    Camera field of view in radians
 */
function ip_defineViewProjectionMatrices(camera_position, camera_fov){
    // Create matrices for the viewing and projection transformations
    ip_viewMatrix = mat4.create();                       
    ip_projectionMatrix = mat4.create();                   

    // Define the view matrix
    // We pass the camera position (the eye), the point we want to look at (the center) and the up vector (y axis)
    mat4.lookAt(ip_viewMatrix, camera_position, vec3.fromValues(0, 0, 0), vec3.fromValues(0,1,0));

    // We generate a projection matrix with mat4.perspective
    // We pass the camera field of view in radians, the aspect ratio of the viewport and the near and far bounds of the frustrum
    // The near and far bounds (minimum and maximum distance from the viewer still drawn) were chosen to be as tight as possible while maintaining the objects visible
    mat4.perspective(ip_projectionMatrix, camera_fov, gl.viewportWidth / gl.viewportHeight, 0.1, 30.0);
}

/**
 * Set the redering area size, the background color and enable depth test and face culling.
 * Face culling will be deactivated in the draw_shapes function for the plane.
 */
function ip_set_general_settings(drawX){
    // Set the size of our rendering area
    gl.enable(gl.SCISSOR_TEST);

    gl.viewport(drawX, 0, gl.viewportWidth, gl.viewportHeight);
    gl.scissor(drawX, 0, gl.viewportWidth, gl.viewportHeight);

    // Setting the background color
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    // Clear the rendering area
    gl.clear(gl.COLOR_BUFFER_BIT);

    /* Face culling is an optimization tool that allows us to discard the back faces, saving up calculation time.
     * The depth test is what determines which fragments are in front of others, using the z-buffer. A fragment
     * that does not pass the depth test is discarded.
     */

    gl.enable(gl.CULL_FACE);    // Enable face culling
    gl.enable(gl.DEPTH_TEST);   // Enable depth test
}

/**
 * Set the uniforms that are used by all shapes: the view and projection matrices, the light direction and the point light position and intensity. Since the shader
 * programs remembers uniforms after calling gl.drawArrays, they only have to be set once.
 * @param {vec4} light_direction   Directional light direction in view coordinates
 * @param {vec4} plight_position_vec4   Point light position in view coordinates
 * @param {vec3} plight_intensity   Point light intensity
 */
function ip_set_general_uniforms(light_direction, plight_position_vec4, plight_intensity, gamma, tone_mapping_alpha, tone_mapping_beta){
    // Get the location of the light direction uniform in the shader program (used only in the fragment shader)
    let lightDirectionLocation = gl.getUniformLocation(ip_shaderProgram, "lightDirection");
    // Set the uniform value. 4fv indicates that the uniform is a 4 component vector of floats
    // Note that normalization will be done in the shader
    gl.uniform4fv(lightDirectionLocation, light_direction);

    // Get the location of the point light position uniform in the shader program (used in both vertex and fragment shaders)
    let plightPositionLocation = gl.getUniformLocation(ip_shaderProgram, "pointLightPosition");
    // Set the uniform value 
    gl.uniform4fv(plightPositionLocation, plight_position_vec4);    
    // Get the location of the point light intensity uniform in the shader program (used only in the fragment shader)
    let plightIntensityLocation = gl.getUniformLocation(ip_shaderProgram, "pointLightIntensity");
    // Set the uniform value (3fv since it is a 3 component vector of floats)
    gl.uniform3fv(plightIntensityLocation, plight_intensity);


    // Get the location of the view and projection matrix uniforms in the shader program (used only in the vertex shader)
    let viewMatrixLocation = gl.getUniformLocation(ip_shaderProgram, "viewMatrix");
    let projectionMatrixLocation = gl.getUniformLocation(ip_shaderProgram, "projectionMatrix");

    // Set the uniform values. The second parameter is false in order not to transpose 
    gl.uniformMatrix4fv(viewMatrixLocation, false, ip_viewMatrix);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, ip_projectionMatrix);

    // Get the location of the parameters set by the student
    let gammaLocation = gl.getUniformLocation(ip_shaderProgram, "gamma");
    gl.uniform1f(gammaLocation, gamma);
    let toneMappingAlphaLocation = gl.getUniformLocation(ip_shaderProgram, "alpha");
    gl.uniform1f(toneMappingAlphaLocation, tone_mapping_alpha);
    let toneMappingBetaLocation = gl.getUniformLocation(ip_shaderProgram, "beta");
    gl.uniform1f(toneMappingBetaLocation, tone_mapping_beta);
}

/**
 * Draw the shapes in the scene.
 * @param {vec3} plight_position   Point light position in cartesian, model coordinates
 */
function ip_draw_shapes(plight_position){
    var modelMatrix = mat4.create();                 // Create a model matrix
    // Get the location in the shader program (only used in the vertex shader)
    let modelMatrixLocation = gl.getUniformLocation(ip_shaderProgram, "modelMatrix");

    // ************ Cube 1 ************

    // Bind the VAO for the cube
    gl.bindVertexArray(ip_cube_vao);

    // Set the model matrix for the cube, which will translate it to the point (-2, 0, 0)
    mat4.fromTranslation(modelMatrix, vec3.fromValues(-2, 0, 0));
    // Set the uniform value
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

    // Draw triangles starting from the first vertex (0) and using 36 vertices
    gl.drawArrays(gl.TRIANGLES, 0, ip_cube_vertices.length / 3);
    

    // ************ Cube 2 ************

    // We do not need to set the cube VAO again, since it is already bound

    // Set the model matrix, this time at the other side of the x axis
    mat4.fromTranslation(modelMatrix, vec3.fromValues(2, 0, 0));
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, ip_cube_vertices.length / 3);

    // ************ Big sphere ************

    // Bind the VAO for the sphere
    gl.bindVertexArray(ip_sphere_vao);

    // Set the model matrix so that the sphere is centered at the origin
    mat4.fromTranslation(modelMatrix, vec3.fromValues(0, 0, 0));
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

    // Draw the triangles
    gl.drawArrays(gl.TRIANGLES, 0, ip_sphere_vertices.length / 3);

    // ************ Little light sphere ************
    
    // Matrices are multiplied at the right, so the scale is applied first and then the translation
    mat4.fromTranslation(modelMatrix, plight_position);                             // Translate the sphere to the point light position
    mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(0.1, 0.1, 0.1));           // Make it smaller
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, ip_sphere_vertices.length / 3);

    // Plane
    
    /* Face culling is not necessary for the plane, because it is in 2D. In fact, it would prevent the back side
     * to be shown from below. */
    gl.disable(gl.CULL_FACE);

    // Bind the VAO for the plane
    gl.bindVertexArray(ip_plane_vao);

    // Move it exactly below all the other shapes, but add a little displacement (-0.001) to avoid intersections
    mat4.fromTranslation(modelMatrix, vec3.fromValues(0, -0.501, 0));
    // We scale the plane to make it bigger in the x and z directions. The scaling in the y direction does not matter, since the plane is 2D,
    // but it will make the matrix uniform, so that we don't have to calculate the inverse transpose for normals in the vertex shader
    mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(10, 10, 10));       
    gl.uniformMatrix4fv(modelMatrixLocation, false, modelMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, ip_plane_vertices.length / 3);
}
