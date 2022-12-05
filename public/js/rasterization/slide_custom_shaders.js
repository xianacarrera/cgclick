
function start_slide_custom_shaders() {
	currentSlideInfo.rasterizationType = "custom_shaders";
	
	let params = {
		slider_camera_angles: false,
		slider_camera_distance: false,
		slider_camera_fov: false,
		slider_lights: false,
		slider_face_culling: false,
		slider_depth_test: false,
		slider_gamma: false,
		slider_tone_mapping: false,
		compilation_msgs: true,
	};

	initWebGL();
	createGLSLPrograms(params);
	initBuffers();

    is_culling_on = false;
	is_depth_test_on = true;

	draw(params);
}
