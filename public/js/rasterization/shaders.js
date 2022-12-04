/**
 * This code was primarly created for assignment for Computer Graphics course at USI
 * by Jiří Heller, Marie Kalousková and Xiana Carrera Alonso
 * For Software Atelier 3: The Web project we modified it to make it more customizable and tangible 
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

 var vertexShaderCode_PM =
    `#version 300 es
    in vec3 a_position;
    in vec3 a_color;
    in vec3 a_normal;

    // uniforms for all transformation matrices
    uniform mat4 model_matrix;
    uniform mat4 view_matrix;
    uniform mat4 projection_matrix;
    
    uniform vec3 light_direction;

    out vec3 v_color;
    out vec3 v_normal;
    out vec3 v_light_direction;
    out vec3 v_view_direction;

    void main(){
        v_color = a_color;

        // compute all the variables required for light computation in the fragment shader
        // all the locations and vectors have to be in a common space - viewing (eye/camera) space
        v_normal = vec3(view_matrix * model_matrix * vec4(a_normal,0.0));
        v_light_direction = vec3(view_matrix * vec4(light_direction,0.0));
        v_view_direction = - vec3((view_matrix * model_matrix * vec4(a_position,1.0)));
        
        gl_Position = projection_matrix * view_matrix * model_matrix * vec4(a_position,1.0);
    }`;

var fragmentShaderCode =
    `#version 300 es
    precision mediump float;
    in vec3 v_color;

    out vec4 out_color;
    void main(){
        out_color = vec4(v_color, 1.0);
    }`;

var fragmentShaderCode_PM =
    `#version 300 es
    precision mediump float;

    // Exercise 3:
    // add all the input variable passed from the vertex shader
    in vec3 v_color;
    in vec3 v_normal;
    in vec3 v_light_direction;
    in vec3 v_view_direction;

    uniform float gamma;
    uniform float alpha;
    uniform float beta;
    
    // you can also add here constants for Phong shading model,
    // e.g., light color, ambient, diffuse, and specular coefficients, gamma value, as well as shininess
    const vec3 light_color = vec3(1.0);
    const float ambient_coeff = 0.05f;
    const float diffuse_coeff = 0.8f;
    const float specular_coeff = 0.15f;
    const float shininess_coeff = 50.0f;

    out vec4 out_color;

    vec3 pow_but_for_vec3(vec3 v, float p) {
        vec3 result = vec3(0.0);
        for (int i = 0; i < 3; i++)
            result[i] = pow(v[i], p);
        return result;
    }
    
    void main(){

        // Computation of Phong shading
        
        // normalize all input vectors
        vec3 normal = normalize(v_normal);
        vec3 light_direction = normalize(v_light_direction);
        vec3 view_direction = normalize(v_view_direction);
        vec3 reflected_direction = reflect(-light_direction, normal);
        reflected_direction = normalize(reflected_direction);

        float NdotL = clamp(dot(normal, light_direction), 0.0f, 1.0f);
        float VdotR = clamp(dot(reflected_direction, view_direction), 0.0f, 1.0f);
        
        vec3 ambient = ambient_coeff * v_color;
        vec3 diffuse = diffuse_coeff * v_color * vec3(NdotL);
        vec3 specular = specular_coeff * vec3(pow(VdotR, shininess_coeff));

        vec3 color = ambient + diffuse + specular;
        
        // Performing gamma correction and tone mapping at the end
        color = alpha * color;
        color = pow_but_for_vec3(color, beta/gamma);

        out_color = vec4(color, 1.0);
    }`;

var gl; // WebGL context
var shaderProgram; // the GLSL program we will use for rendering

function compileShader(shader, source, type, name = "", params){
    // link the source of the shader to the shader object
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(success){
        console.log(name + " shader compiled succesfully.");
        if (params?.compilation_msgs){
            let txtComp = document.getElementById(`${name}-compilation-msg`);
            txtComp.textContent = name + " shader compiled succesfully.";
            txtComp.classList.remove("text-danger");
            txtComp.classList.add("text-success");
        }
    }else{
        console.log(name + " shader error.")
        console.log(gl.getShaderInfoLog(shader));
        if (params?.compilation_msgs){
            let txtComp = document.getElementById(`${name}-compilation-msg`);
            txtComp.textContent = name + " shader error.";
            txtComp.classList.remove("text-success");
            txtComp.classList.add("text-danger");
        }
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
   
function createGLSLPrograms(params){
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    switch (currentSlideInfo.rasterizationType) {
        case "triangle_cube":
            compileShader(vertexShader, vertexShaderCode, gl.VERTEX_SHADER, "Vertex");
            compileShader(fragmentShader, fragmentShaderCode, gl.VERTEX_SHADER, "Fragment");
            break;
        case "phong_model":
            compileShader(vertexShader, vertexShaderCode_PM, gl.VERTEX_SHADER, "Vertex");
            compileShader(fragmentShader, fragmentShaderCode_PM, gl.VERTEX_SHADER, "Fragment");
            break;
        case "custom_shaders":
            let customVertexShaderCode = document.getElementById("vertex-shader-code").textContent;
            let customFragmentShaderCode = document.getElementById("fragment-shader-code").textContent;
            compileShader(vertexShader, customVertexShaderCode, gl.VERTEX_SHADER, "Vertex", params);
            compileShader(fragmentShader, customFragmentShaderCode, gl.VERTEX_SHADER, "Fragment", params);
            break;
        default:
            console.error("For this slide createGLSLPrograms is not supported");
    }
    shaderProgram = gl.createProgram();
    linkProgram(shaderProgram, vertexShader, fragmentShader);
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
