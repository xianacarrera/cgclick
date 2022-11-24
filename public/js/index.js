document.getElementById("navbar").innerHTML = ejs.views_slide_figures({});

threeAPI.initScene();
// Torus example
threeAPI.createParametricGeometry(threeAPI.presetGeometries.torus);
threeAPI.animate();


