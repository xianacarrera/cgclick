/**
 * This code was primarly created for assignment for Computer Graphics course at USI
 * by Jiří Heller, Marie Kalousková and Xiana Carrera Alonso
 * For Software Atelier 3: The Web project we modified it to make it more customizable and tangible 
 */

function start_slide_phong_model(params) {
    currentSlideInfo.rasterizationType = "phong_model";

    initWebGL();
    createGLSLPrograms();
    initBuffers();

    is_culling_on = false;
	is_depth_test_on = true;

	if (params.slider_face_culling) {
		let culling_checkbox = document.getElementById("culling");
		culling_checkbox.addEventListener("change", (e) => {
			if (culling_checkbox.checked) {
				is_culling_on = true;
			}
			else {
				is_culling_on = false;
			}
		});
	}

	if (params.slider_depth_test) {
		let depth_test_checkbox = document.getElementById("depth_test");
		depth_test_checkbox.addEventListener("change", (e) => {
			if (depth_test_checkbox.checked) {
				is_depth_test_on = true;
			}
			else {
				is_depth_test_on = false;
			}
		});
	}

    draw(params);
}
