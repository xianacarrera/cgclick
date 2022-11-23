/**
 * Three API. Provides:
 * - initScene: initializes the scene
 * - presetGeometries: a list of preset parametric functions
 * - createParametricGeometry: creates the parametric geometry to draw,
 * - animate: starts the animation loop
 */

threeAPI = function(){
    let scene;
    let camera;
    let renderer;
    let controls;

    let presetGeometries = {
        torus: function (u, v, target) {
            u *= 2 * Math.PI;
            v *= 2 * Math.PI;
    
            let R1 = 2;
            let R2 = 10;
            let x = (R2 + R1 * Math.cos(v)) * Math.cos(u);
            let y = (R2 + R1 * Math.cos(v)) * Math.sin(u);
            let z = R1 * Math.sin(v);
    
            target.set(x, y, z);
        },
        klein: THREE.ParametricGeometries.klein,
        staircase: function (u, v, target) {
            u *= 2 * Math.PI;
            v *= 2 * Math.PI;
    
            let x = u * Math.cos(v);
            let y = u * Math.sin(v);
            let z = v;
    
            target.set(x, y, z);
        }
    }

    /**
     * Private function. Sets up the scene and camera.
     */
    function _setupScene(){
        scene = new THREE.Scene();        // Create a scene
        // Parameters:
        // * Field of view (FOV): 45 degrees
        // * Aspect ratio of the display element (in this case, the window)
        // * Near clipping plane: minimum distance from the camera to be rendered
        // * Far clipping plane: maximum distance from the camera to be rendered
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    }

    /**
     * Private function. Creates the renderer and adds it to the DOM.
     */
    function _setupRenderer(){
        // Create a renderer instance
        renderer = new THREE.WebGLRenderer();
        // Set the size of the renderer to the size of the window (can be changed)
        // (To render at a lower resolution, set a third parameter to false)
        renderer.setSize( window.innerWidth, window.innerHeight );

        // Add the canvas element of the renderer to the document
        document.body.appendChild( renderer.domElement );
    }

    /**
     * Private function. Adds illumination with a spot light and ambient light.
     */
    function _addLight(){
        // Create a spot light (a kind of point source that emits light in a cone)
        var spotLight = new THREE.DirectionalLight();
        // Set its position and target
        spotLight.position = new THREE.Vector3(-20, 250, -50);
        spotLight.target.position.x = 30;
        spotLight.target.position.y = -40;
        spotLight.target.position.z = -20;
        spotLight.intensity = 0.3;      // Intensity / color
    
        scene.add(spotLight);

        // Define an ambient light
        const color = 0xFFFFFF;
        const intensity = 1;
        let ambientLight = new THREE.AmbientLight(color, intensity);
        scene.add(ambientLight);
    }

    /**
     * Private function. Creates an instance of OrbitControls (i.e., interactivity) and configures its settings.
     */
    function _setupInteractivity(){
        // Because we're using the /js folder from three.js, OrbitControls are added to the global THREE object
        // The parameter is the camera to be controlled and the element to be used for the event listeners
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        // controls.update() has to be called after any manual changes to the camera's transform
        camera.position.set( -30, 50, 50);       // Position the camera
        camera.lookAt(new THREE.Vector3(0, 0, 0));   // Point the camera towards the origin
        controls.update();
    }

    /**
     * Public function. Creates a parametric geometry and adds it to the scene.
     */
    function createParametricGeometry(func){
    
        const geometry = new THREE.ParametricGeometry(func, 120, 120, false);
        var material = new THREE.MeshBasicMaterial( { color: 0xFF0000} );
        const mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0, 0, 0);
        scene.add(mesh);
    }

    /**
     * Public function. Creates a scene with a camera and a renderer.
     */
    function initScene(){
        _setupScene();          // Create the scene and camera
        _addLight();        // Add light to the scene
        _setupRenderer();       // Create the renderer and add it to the DOM
        _setupInteractivity();     // Create an OrbitControls instance
    }

    /**
     * Public function. Starts the animation loop.
     */
    function animate(){
        requestAnimationFrame( animate );

        // This updates the camera position and rotation based on the controls
        controls.update();

        renderer.render(scene, camera);
    }

    return {
        initScene,
        presetGeometries,
        createParametricGeometry,
        animate
    }
}();

