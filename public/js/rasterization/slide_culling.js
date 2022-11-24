/**
 * This code was primarly created for assignment for Computer Graphics course at USI
 * by Jiří Heller, Marie Kalousková and Xiana Carrera Alonso
 * For Software Atelier 3: The Web project we modified it a little bit to make it more tangible
 */

function start_slide_culling() {
	// initialze WebGL
	initWebGL();
	// create GLSL programs
	createGLSLPrograms();

	// init both VAOs
	initBuffers(triangle_vertices, triangle_colors, "triangle");
	initBuffers(cube_vertices, cube_colors, "cube");

	// default (first) shape is a triangle
	is_triangle_shown = true;
	is_culling_on = true;
	is_depth_test_on = true;

	let shape_selector = document.getElementById("shape-selector");
	shape_selector.addEventListener("change", (e) => {
		if (shape_selector.checked) {
			is_triangle_shown = false;
		}
		else {
			is_triangle_shown = true;
		}
	});

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

	draw();
}
