document.getElementById("navbar").innerHTML = ejs.views_includes_navbar({});
let culling = true;
let depth_test = true;
document.getElementById("slide").innerHTML = ejs.views_slide_triangle_cube({culling, depth_test});
start_slide_triangle_cube(culling, depth_test);
