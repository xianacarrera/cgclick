function main(){
    const scene = new THREE.Scene();        // Create a scene
    // Parameters:
    // * Field of view (FOV): 45 degrees
    // * Aspect ratio of the display element (in this case, the window)
    // * Near clipping plane: minimum distance from the camera to be rendered
    // * Far clipping plane: maximum distance from the camera to be rendered
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

    // Create a renderer instance
    const renderer = new THREE.WebGLRenderer();
    // Set the size of the renderer to the size of the window (can be changed)
    // (To render at a lower resolution, set a third parameter to false)
    renderer.setSize( window.innerWidth, window.innerHeight );

    addSpotLight(scene);

    // Add the canvas element of the renderer to the document
    document.body.appendChild( renderer.domElement );


    // Add interactivity using OrbitControls
    // Because we're using the /js folder from three.js, OrbitControls are added to the global THREE object
    // The parameter is the camera to be controlled and the element to be used for the event listeners
    const controls = new THREE.OrbitControls(camera, renderer.domElement);

    // controls.update() has to be called after any manual changes to the camera's transform
    camera.position.set( -30, 50, 50);       // Position the camera
    camera.lookAt(new THREE.Vector3(0, 0, 0));   // Point the camera towards the origin
    controls.update();

    //let cube = createCube(camera, scene);
    //createKleinBottle(scene);
    /*
    let func = function (u, v, target) {
            //Play with these 2 values to get the exact result you want
            //The height variable is pretty self-explanatory, the size variable acts like a scale on the x/z axis.
            var height = 300; //Limit the height
            var size = 1; //Limit the x/z size, try the value 10 for example

            var u = u * height;
            var v = (v * 2 * Math.PI);

            var x = size * Math.sqrt(u) * Math.cos(v);
            var y = u;
            var z = size * 2 * Math.sqrt(u) * Math.sin(v);     
            target.set(x, y, z);
    }*/
    let torus = function (u, v, target) {
        u *= 2 * Math.PI;
        v *= 2 * Math.PI;

        let R1 = 2;
        let R2 = 10;
        let x = (R2 + R1 * Math.cos(v)) * Math.cos(u);
        let y = (R2 + R1 * Math.cos(v)) * Math.sin(u);
        let z = R1 * Math.sin(v);

        target.set(x, y, z);
    };
    createParametricGeometry(torus, scene);


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

function createKleinBottle(scene){
    // Create a parametric geometry
    const geometry = new THREE.ParametricGeometry( THREE.ParametricGeometries.klein, 25, 25 );
    // Create a material with a wireframe
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, wireframe: true } );
    // Create a mesh applying the material to the geometry
    const klein = new THREE.Mesh( geometry, material );
    scene.add(klein);
}

function createParametricGeometry(func, scene){

    const color = 0xFFFFFF;
    const intensity = 1;
    let light = new THREE.AmbientLight(color, intensity);
    scene.add(light);

    const geometry = new THREE.ParametricGeometry(func, 120, 120, false);
    var material = new THREE.MeshBasicMaterial( { color: 0xFF0000} );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(0, 0, 0);
    scene.add(mesh);

}

function addSpotLight(scene){
    // Create a spot light
    var spotLight = new THREE.DirectionalLight();
    // Set its position and target
    spotLight.position = new THREE.Vector3(-20, 250, -50);
    spotLight.target.position.x = 30;
    spotLight.target.position.y = -40;
    spotLight.target.position.z = -20;
    spotLight.intensity = 0.3;      // Intensity / color

    scene.add(spotLight);
}


main();