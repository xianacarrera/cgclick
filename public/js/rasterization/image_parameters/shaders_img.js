


/* The shaders are written in GLSL (OpenGL Shading Language).
 *
 * The vertex shader has new variables:
 *   - in a_normal: the normal at the vertex in model coordinates, used for lighting
 *   - out v_normal: the normal at the vertex in world coordinates, used for lighting
 *   - out v_viewDirection: the normalized vector from the vertex to the camera, used for the lightning
 *   - out v_pointLightDirection: the normalized vector from the vertex to the point light, used for the point lightning
 *   - out v_position: the position of the vertex in world coordinates, used for the point lightning
 * 
 * Additionally, the position of the point light source in is passed as a uniform to the vertex shader. It is necessary to obtain
 * the pointLightDirection. Because it is also used in the fragment shader with a different precision (mediump), the precision 
 * has to also be specified here. It has been passed to viewing coordinates beforehand to avoid doing the same multiplication for 
 * every vertex.
 * 
 * To avoid repeating calculations, the light direction in viewing coordinates is obtained in the application stage and passed directly
 * to the fragment shader.
 * 
 * The normalization process is done in the fragment shader, since interpolating could lead to non-normalized vectors anyways.
 */

var ip_vertexShaderCode =
    `#version 300 es
    in vec3 a_position;
    in vec3 a_color;
    in vec3 a_normal;

    out vec3 v_color;
    out vec3 v_normal;
    out vec3 v_viewDirection;
    out vec3 v_pointLightDirection;
    out vec3 v_position;

    // Uniforms for the transformation matrices
    uniform mat4 modelMatrix;               // From model to world coordinates
    uniform mat4 viewMatrix;                // From world to viewing coordinates
    uniform mat4 projectionMatrix;          // From viewing to normalized coordinates

    // Uniforms for the light
    uniform mediump vec4 pointLightPosition;     

    void main(){
        v_color = a_color;      

        // We need to pass the normal from model to viewing coordinates, as lighting will be computed in viewing coordinates in the fragment shader.
        // Since the view matrix can be decomposed into a rotation and a translation, it is orthogonal. And the model matrix will always consist of 
        // translations and / or uniform scalings. Therefore, we don't need to calculate the transpose of the inverse to obtain the normal matrix.
        v_normal = (viewMatrix * modelMatrix * vec4(a_normal, 0.0)).xyz;
        
        // We also need the position of the vertex to obtain the distance to the point light (necessary for attenuation). Note that this position arrives
        // at the fragment shader after being interpolated. Another option would be to directly obtain the distance in the vertex shader and pass it to 
        // the fragment shader, but it would be interpolated anyways.
        v_position = (viewMatrix * modelMatrix * vec4(a_position, 1.0)).xyz;

        // Because the camera is at (0,0,0) in viewing coordinates, the view direction is simply the negative of the position of the vertex
        v_viewDirection = -v_position;

        // The point light direction is the vector from the vertex to the point light source (which is already in viewing coordinates).
        v_pointLightDirection = pointLightPosition.xyz - v_position;

        gl_Position = projectionMatrix * vec4(v_position, 1.0);       // v_position is in viewing coordinates, so we only need to multiply by the projection matrix
    }`;


/* The fragment shader is executed for each fragment (candidate for a pixel value) of the geometry.
 * Its receives as input the interpolated results of the vertex shaders.
 *
 * The coefficients and global data needed for the Phong model are defined as constants, except for the diffuse coefficient,
 * which is the v_color obtained from the vertex shader.
 * 
 * The point light source lightning calculations include attenuation. To avoid division by 0, two measures were taken:
 *    - The slider for the y coordinate is limited in a way that the source is always above all the objects.
 *    - The distance to the source is taken as the maximum between the actual distance and 0.1 (so that the code keeps working if the
 *      sliders change).
 * Additionally, the distance^2 is scaled by 0.1 to increase the intensity of the light and make the attenuation effect more visible,
 * specially from positions where the distance is high.
 * 
 * For computing the attenuation, we use the interpolated v_position, which gives an approximate fragment position. We could also compute
 * the distance to the point light source in the vertex shader, but as it would be also interpolated, we can instead save some calculations
 * by computing it only once per fragment, in the fragment shader.
 * 
 * After the calculations for the Phong model, a gamma correction by a 2.2 factor is applied.
 */

var ip_fragmentShaderCode =
    `#version 300 es
    precision mediump float;

    // Variables passed from the vertex shader
    in vec3 v_color;
    in vec3 v_normal;
    in vec3 v_viewDirection;
    in vec3 v_pointLightDirection;
    in vec3 v_position;

    // Output variables
    out vec4 out_color;

    // Uniforms for the light
    uniform vec4 lightDirection;            // Directional light direction. Already passed to viewing coordinates in the application stage
    uniform vec3 pointLightIntensity;       // Intensity / color of the point light source. It is in grey scale.
    uniform vec4 pointLightPosition;        // Position of the point light source. It is in viewing coordinates.

    // Questions
    uniform float gamma;                    // Gamma correction factor
    uniform float alpha;                    // Tone mapping alpha
    uniform float beta;                     // Tone mapping beta

    // Constants for the Phong shading model
    const vec3 lightColor = vec3(1.0, 1.0, 1.0);                // Color of the directional light source (white)
    const vec3 ambientIntensity = vec3(0.1, 0.1, 0.1);          // Ambient intensity (global)
    const float ambientCoeff = 0.5;       
    const float specularCoeff = 0.8;
    const float shininessCoeff = 50.0;
    //const float gamma = 2.2;                        // Original gamma correction factor

    void main(){

        // First of all, we have to normalize all the vectors, since they are interpolated and could be non-normalized.
        vec3 n_viewDirection = normalize(v_viewDirection);
        vec3 n_normal = normalize(v_normal);
        vec3 n_pointLightDirection = normalize(v_pointLightDirection);
        vec3 n_lightDirection = normalize(lightDirection.xyz);              // The light direction was not normalized in the application stage

        // For the diffuse component, we calculate the dot product between the normal and the light direction (the cosine of the angle between them).
        // We also need to clamp the result to avoid negative values (which would make the color darker than the ambient color)
        float NdotL = clamp(dot(n_normal, n_lightDirection), 0.0, 1.0);
        float NdotL_point = clamp(dot(n_normal, n_pointLightDirection), 0.0, 1.0);

        // For the specular component, we first reflect the light direction around the normal, and then calculate the cosine of the angle between
        // the reflected vector and the view direction using the dot product. We finally need to clamp the result to avoid negative values.
        // To reflect, we use the negative light direction so that it is incident on the surface
        vec3 reflectedDirection = reflect(-n_lightDirection, n_normal);
        vec3 reflectedDirection_point = reflect(-n_pointLightDirection, n_normal);
        float VdotR = clamp(dot(n_viewDirection, reflectedDirection), 0.0, 1.0);
        float VdotR_point = clamp(dot(n_viewDirection, reflectedDirection_point), 0.0, 1.0);

        // Attenuation is added to the point light source. Both pointLightPosition and v_position are in viewing coordinates. We compute the
        // distance between them, use a maximum to avoid division by 0, and then scale its square by 0.1 to increase the intensity of the light.
        float distance = max(length(pointLightPosition.xyz - v_position), 0.1);
        vec3 attenuatedLight = pointLightIntensity / (0.1 * distance * distance);

        // In glsl, a scalar multiplied by a vector is equivalent to multiplying each component of the vector by the scalar.
        vec3 ambient = ambientCoeff * ambientIntensity;
        vec3 diffuse = v_color * NdotL * lightColor;                    // The diffuse coefficient is the color of the vertex
        vec3 diffuse_point = v_color * NdotL_point * attenuatedLight;
        vec3 specular = specularCoeff * pow(VdotR, shininessCoeff) * lightColor;    // The raise the cosine of the angle to the shininess
        vec3 specular_point = specularCoeff * pow(VdotR_point, shininessCoeff) * attenuatedLight;

        // The final color is the sum of the ambient, diffuse and specular components for both directional and point light sources
        vec3 rgb = vec3(ambient + diffuse + diffuse_point + specular + specular_point);

        // Finally, apply tone mapping and gamma correction.
        rgb = alpha * rgb;
        out_color = clamp(vec4(pow(rgb, vec3(beta/gamma)), 1.0), 0.0, 1.0);
    }`;


var ip_shaderProgram; // the GLSL program we will use for rendering

/**
 * Create a shader program with a vertex and a fragment shader.
 */
function ip_createGLSLPrograms(){
    // Creating vertex shader
    var ip_vertexShader = gl.createShader(gl.VERTEX_SHADER);
    ip_compileShader(ip_vertexShader, ip_vertexShaderCode, gl.VERTEX_SHADER, "Vertex shader");

    // Creating fragment shader
    var ip_fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    ip_compileShader(ip_fragmentShader, ip_fragmentShaderCode, gl.VERTEX_SHADER, "Fragment shader");
    
    // Creating and linking the program
    ip_shaderProgram = gl.createProgram();
    ip_linkProgram(ip_shaderProgram, ip_vertexShader, ip_fragmentShader);

    ip_shaderProgram.rotationMatrix= gl.getUniformLocation(ip_shaderProgram, "rotationMatrix"); // extra code for interactive rotation
}

/**
 * Compile a shader
 * @param {WebGLShader} shader The shader to compile
 * @param {string} shaderCode The code of the shader, in GLSL
 * @param shaderType The type of the shader (vertex or fragment)
 * @param {string} shaderName The name of the shader (error-checking)
 */
 function ip_compileShader(shader, source, type, name = ""){
    // Link the source of the shader to the shader object
    gl.shaderSource(shader,source);
    // Compile the shader
    gl.compileShader(shader);
    // Check for success and errors
    let ip_success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(ip_success){
        console.log(name + " shader compiled succesfully.");
    }else{
        console.log(name + " vertex shader error.")
        console.log(gl.getShaderInfoLog(shader));
    }
}

/**
 * Link the GLSL program by combining different shaders
 * @param {WebGLProgram} program The program to link
 * @param {WebGLShader} vertShader The vertex shader that will be attached to the program
 * @param {WebGLShader} fragShader The fragment shader that will be attached to the program
 */
function ip_linkProgram(program,vertShader,fragShader){
    // Attach vertex shader to the program
    gl.attachShader(program,vertShader);
    // Attach fragment shader to the program
    gl.attachShader(program,fragShader);
    // Link the program
    gl.linkProgram(program);
    // Check for success and errors
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("The shaders are initialized.");
    }else{
        console.log("Could not initialize shaders.");
    }
}
