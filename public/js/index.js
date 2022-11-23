//document.getElementById("navbar").innerHTML = ejs.views_includes_navbar({});

threeAPI.initScene();
// Torus example
threeAPI.createParametricGeometry(threeAPI.presetGeometries.torus);
threeAPI.animate();


