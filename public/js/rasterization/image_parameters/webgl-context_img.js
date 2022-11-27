
var gl; // WebGL context (object for controlling WebGL through its functions)

/**
 * Initialize the WebGL canvas
 * @param {string} canvas_id - The id of the canvas element
 */
function ip_initWebGL(canvas_id){
    var canvas = document.getElementById(canvas_id);
    gl = canvas.getContext("webgl2");

    // Keep the size of the canvas for leter rendering
    gl.viewportWidth = canvas.width / 2;
    gl.viewportHeight = canvas.height;

    // Check for errors
    if(gl){
        console.log("WebGL succesfully initialized.");
    }else{
        console.log("Failed to initialize WebGL.")
    }
}