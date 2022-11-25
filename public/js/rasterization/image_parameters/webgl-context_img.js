
var gl; // WebGL context (object for controlling WebGL through its functions)

/**
 * Initialize the WebGL canvas
 */
function ip_initWebGL(){
    var canvas = document.getElementById("question-webgl-canvas");
    gl = canvas.getContext("webgl2");

    // Keep the size of the canvas for leter rendering
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

    // Check for errors
    if(gl){
        console.log("WebGL succesfully initialized.");
    }else{
        console.log("Failed to initialize WebGL.")
    }
}