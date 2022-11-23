function main(){
    const scene = new THREE.Scene();        // Create a scene
    // Parameters:
    // * Field of view (FOV): 75 degrees
    // * Aspect ratio of the display element (in this case, the window)
    // * Near clipping plane: minimum distance from the camera to be rendered
    // * Far clipping plane: maximum distance from the camera to be rendered
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    // Create a renderer instance
    const renderer = new THREE.WebGLRenderer();
    // Set the size of the renderer to the size of the window (can be changed)
    // (To render at a lower resolution, set a third parameter to false)
    renderer.setSize( window.innerWidth, window.innerHeight );
    // Add the canvas element of the renderer to the document
    document.body.appendChild( renderer.domElement );

    // Add interactivity using OrbitControls
    // Because we're using the /js folder from three.js, OrbitControls are added to the global THREE object
    // The parameter is the camera to be controlled and the element to be used for the event listeners
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // controls.update() has to be called after any manual changes to the camera's transform
    camera.position.set( 0, 20, 20 );       // Move the camera 20 units up and 20 units back
    controls.update();

    //let cube = createCube(camera, scene);
    createParametricGeometry(scene);


    function animate(){
        requestAnimationFrame( animate );

        //cube.rotation.x += 0.01;
        //cube.rotation.y += 0.01;

        // This updates the camera position and rotation based on the controls
	    controls.update();

        renderer.render( scene, camera );
    }

    animate();
}

function createCube(camera, scene){
    // Create a geometry instance of a cube
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // Create a basic green material
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    // Create a mesh applying the material to the geometry
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );      // By default, added to the origin (0, 0, 0)
    
    camera.position.z = 5; 
    return cube;
}

function createParametricGeometry(scene){
    // Create a parametric geometry
    const geometry = new THREE.ParametricGeometry( THREE.ParametricGeometries.klein, 25, 25 );
    // Create a material with a wireframe
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
    // Create a mesh applying the material to the geometry
    const klein = new THREE.Mesh( geometry, material );
    scene.add(klein);
}


main();