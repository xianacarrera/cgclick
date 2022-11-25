

var ip_viewMatrix;             // Viewing transformation (from world to viewing coordinates)
var ip_projectionMatrix;       // Projection transformation (from viewing to normalized coordinates)

/**
 * Draw the scene
 */
function ip_draw(){
    
    /******************** Get input from the user and define view and projection matrices   *******************/

    // Get the input from the sliders relative to the camera.
    let [camera_position, camera_fov] = ip_get_camera_input();

    // Compute the view and projection matrices based on the camera position and field of view.
    ip_defineViewProjectionMatrices(camera_position, camera_fov);

    let light_direction, plight_position, plight_position_vec4, plight_intensity;
    if (directional_light){
        light_direction = compute_light_direction(directional_light.azimuthal / 360 * 2 * Math.PI, directional_light.polar / 360 * 2 * Math.PI);
        [plight_position, plight_position_vec4, plight_intensity] = ip_get_light_input(false);
    } else {
        // Get the input from the sliders relative to the directional and point light.
        // Also transform the light direction and plight_position_vec4 to view coordinates using the view matrix.
        // plight_position is not transformed since it will be used to translate the sphere that represents the point light source. It's also kept as a vec3.
        [light_direction, plight_position, plight_position_vec4, plight_intensity] = ip_get_light_input(true);
    }


    /**************************************** Settings ********************************************************/

    // Set the size of our rendering area and the background color
    // Activate depth test and face culling for drawing the spheres and cubes
    ip_set_general_settings();     


    /*********************************** Initiate the rendering ***********************************************/

    // Enable the GLSL program for the rendering
    gl.useProgram(ip_shaderProgram);

    // Set most of the shader uniforms: view and projection matrices, light direction, point light position and point light intensity
    ip_set_general_uniforms(light_direction, plight_position_vec4, plight_intensity);

    // Draw all the objects. Also set the model matrix for each object as a shader uniform.
    // The plane is drawn without face culling.
    ip_draw_shapes(plight_position);

    window.requestAnimationFrame(function() {ip_draw();});
}


/**
 * Get the user input from the camera sliders and return the camera position and field of view.
 */
function ip_get_camera_input(){
    // The camera angles are transformed to radians
    let camera_azimuthal_angle = document.getElementById("camera_azimuthal_angle").value / 360 * 2 * Math.PI;
    let camera_polar_angle = document.getElementById("camera_polar_angle").value / 360 * 2 * Math.PI;
    let camera_distance = document.getElementById("camera_distance").value / 10;
    let camera_fov = document.getElementById("camera_fov").value / 360 * 2 * Math.PI;

    
    // We transform the spherical coordinates of the camera to cartesian coordinates
    // camera_distance is the distance to the center of the coordinate system
    // camera_polar_angle is the angle between the x axis and the line from the origin to the camera
    // camera_azimuthal_angle is the angle between the y axis and the projection of the line from the origin to the camera on the yz plane
    let camera_x = camera_distance * Math.sin(camera_polar_angle) * Math.sin(camera_azimuthal_angle);
    let camera_y = camera_distance * Math.cos(camera_polar_angle);
    let camera_z = camera_distance * Math.sin(camera_polar_angle) * Math.cos(camera_azimuthal_angle);
    let camera_position = vec3.fromValues(camera_x, camera_y, camera_z);

    return [camera_position, camera_fov];
}

/**
 * Get the user input for the directional and point lights and return the light direction, point light position and point light intensity.
 */
function ip_get_light_input(get_directional){

    // Get the cartesian coordinates of the point light source
    let plight_x = document.getElementById("point_light_x").value / 100;
    let plight_y = document.getElementById("point_light_y").value / 100 + 0.7;       // Add 0.7 so that the light is above all other objects
    let plight_z = document.getElementById("point_light_z").value / 100;
    // Create two vectors with the same value, but one with 1.0 as the last component to be multiplied by the view matrix
    let plight_position = vec3.fromValues(plight_x, plight_y, plight_z);
    let plight_position_vec4 = vec4.fromValues(plight_x, plight_y, plight_z, 1.0);
    vec4.transformMat4(plight_position_vec4, plight_position_vec4, ip_viewMatrix);

    let int = document.getElementById("point_light_intensity").value / 100;        
    // The point light color will be in gray scale, since it has the same value in all components
    let plight_intensity = vec3.fromValues(int, int, int);         

    if (get_directional){
        // The directional light angles are transformed to radians
        let light_azimuthal_angle = document.getElementById("light_azimuthal_angle").value / 360 * 2 * Math.PI;
        let light_polar_angle = document.getElementById("light_polar_angle").value / 360 * 2 * Math.PI;

        let light_direction = compute_light_direction(light_azimuthal_angle, light_polar_angle);

        return [light_direction, plight_position, plight_position_vec4, plight_intensity];
    }

    return [plight_position, plight_position_vec4, plight_intensity];
}

/**
 * Get the light direction as a vec4 from its azimuthal and polar angles
 * @param {Number} azimuthal
 * @param {Number} polar
 */
function compute_light_direction(azimuthal, polar){
    // Since the directional light is also given in spherical coordinates, we transform them to cartesian coordinates
    // Here, the light distance can be considered to be 1, since the light direction won't change
    let light_x = Math.sin(polar) * Math.sin(azimuthal);
    let light_y = Math.cos(polar);
    let light_z = Math.sin(polar) * Math.cos(azimuthal);
    let light_direction = vec4.fromValues(light_x, light_y, light_z, 0.0);   // Add a 4th component to be multiplied by the view matrix
    vec4.transformMat4(light_direction, light_direction, ip_viewMatrix);        // Transform the light direction from wold to view coordinates

    return light_direction;
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
function ip_set_general_settings(){
    // Set the size of our rendering area
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

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
function ip_set_general_uniforms(light_direction, plight_position_vec4, plight_intensity){
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
