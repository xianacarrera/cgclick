/**
 * This code was primarly created for assignment for Computer Graphics course at USI
 * by Jiří Heller, Marie Kalousková and Xiana Carrera Alonso
 * For Software Atelier 3: The Web project we modified it to make it more customizable and tangible 
 */

function start_slide_triangle_cube(params) {
	currentSlideInfo.rasterizationType = "triangle_cube";
	
	initWebGL();
	createGLSLPrograms();
	initBuffers();

	// default (first) shape is a triangle
	is_triangle_shown = true;
	is_culling_on = false;
	is_depth_test_on = true;

	let shape_triangle = document.getElementById("shape_triangle");
	shape_triangle.addEventListener("change", (e) => {
		if (shape_triangle.checked) {
			is_triangle_shown = true;
		}
	});

	let shape_cube = document.getElementById("shape_cube");
	shape_cube.addEventListener("change", (e) => {
		if (shape_cube.checked) {
			is_triangle_shown = false;
		}
	});

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
	}

	draw();
}
