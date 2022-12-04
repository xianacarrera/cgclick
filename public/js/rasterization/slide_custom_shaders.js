
function start_slide_custom_shaders(params) {
	currentSlideInfo.rasterizationType = "custom_shaders";
	
	initWebGL();
	createGLSLPrograms(params);
	initBuffers();

    is_culling_on = false;
	is_depth_test_on = true;

	/*
	if (params.slider_face_culling) {
		let culling_button_on = document.getElementById("culling_on");
		culling_button_on.addEventListener("change", (e) => {
			if (culling_button_on.checked) {
				is_culling_on = true;
			}
		});

		let culling_button_off = document.getElementById("culling_off");
		culling_button_off.addEventListener("change", (e) => {
			if (culling_button_off.checked) {
				is_culling_on = false;
			}
		});
	}

	if (params.slider_depth_test) {
		let depth_test_button_on = document.getElementById("depth_test_on");
		depth_test_button_on.addEventListener("change", (e) => {
			if (depth_test_button_on.checked) {
				is_depth_test_on = true;
			}
		});

		let depth_test_button_off = document.getElementById("depth_test_off");
		depth_test_button_off.addEventListener("change", (e) => {
			if (depth_test_button_off.checked) {
				is_depth_test_on = false;
			}
		});
	}*/

	draw(params);
}
