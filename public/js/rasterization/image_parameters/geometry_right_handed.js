
/**
 * Code adapted from a computer graphics assignment.
 * Geometry definition for a cube, sphere and plane using a right handed coordinate system.
 */


/*******************************************************************
 * Cube
 *******************************************************************/

/* To define a cube, we need to define 2 triangles for each face. I have used the triangles with vertices (bottom-left, bottom-right, upper-left)
 * and (upper-right, upper-left, bottom-right), always in that (counter-clockwise) order, looking from the outside of the cube. This way, every
 * face will be visible.
 * A cube has 6 faces, and each face has 2 triangles -> 12 triangles -> 36 vertices
 * The right-hand coordinate system is used: x-axis pointing right, y-axis pointing up, and z-axis pointing towards the screen.
 * The rendering application is defined only for the [-1, 1]x[-1, 1]x[-1, 1] volume. The cube is defined in a way such that, when rotated, it will
 * still be inside this volume. 
 * 
 * The z component had to be inverted with respect to assignment 8 to account for the right hand coordinate system.
*/

const cube_vertices = [
    // Front face (z = 0.5)
    -0.5, -0.5, 0.5,     // Triangle 1
    0.5,  -0.5, 0.5,
    -0.5, 0.5, 0.5,
    0.5, 0.5, 0.5,      // Triangle 2
    -0.5, 0.5, 0.5,
    0.5,  -0.5, 0.5,

    // Back face (z = -0.5)
    0.5, -0.5,  -0.5,     // Triangle 1
    -0.5, -0.5,  -0.5,
    0.5,  0.5,  -0.5,
    -0.5, 0.5,  -0.5,     // Triangle 2
    0.5,  0.5,  -0.5,
    -0.5, -0.5,  -0.5,

    // Top face (y = 0.5)
    -0.5, 0.5, 0.5,     // Triangle 1
    0.5, 0.5, 0.5,
    -0.5, 0.5, -0.5,
    0.5, 0.5, -0.5,      // Triangle 2
    -0.5, 0.5, -0.5,
    0.5, 0.5, 0.5,

    // Bottom face (y = -0.5)
    -0.5, -0.5, -0.5,     // Triangle 1
    0.5, -0.5, -0.5,
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,     // Triangle 2
    -0.5, -0.5, 0.5,
    0.5, -0.5, -0.5,

    // Right face (x = 0.5)
    0.5, -0.5, 0.5,     // Triangle 1
    0.5, -0.5, -0.5,
    0.5, 0.5, 0.5,
    0.5, 0.5, -0.5,      // Triangle 2
    0.5, 0.5, 0.5,
    0.5, -0.5, -0.5,

    // Left face (x = -0.5)
    -0.5, -0.5, -0.5,     // Triangle 1
    -0.5, -0.5, 0.5,
    -0.5, 0.5, -0.5,
    -0.5, 0.5, 0.5,     // Triangle 2
    -0.5, 0.5, -0.5,
    -0.5, -0.5, 0.5,
];


// Colors for each vertex of a cube. Each triplet corresponds to a vertex, so the same color will be used for the vertices in each face.
// The colors for the rest of the points on the cube will be interpolated automaticaly between the vertex and fragment shaders.
const cube_colors = [
    // Front face (z = 0.5) -> red
    0.9,  0.24,  0.24,
    0.9,  0.24,  0.24,
    0.9,  0.24,  0.24,
    0.9,  0.24,  0.24,
    0.9,  0.24,  0.24,
    0.9,  0.24,  0.24,

    // Back face (z = -0.5) -> violet
    0.6,  0.15,  0.71,
    0.6,  0.15,  0.71,
    0.6,  0.15,  0.71,
    0.6,  0.15,  0.71,
    0.6,  0.15,  0.71,
    0.6,  0.15,  0.71,

    // Top face (y = 0.5) -> green
    0.35,  0.77,  0.0,
    0.35,  0.77,  0.0,
    0.35,  0.77,  0.0,
    0.35,  0.77,  0.0,
    0.35,  0.77,  0.0,
    0.35,  0.77,  0.0,

    // Bottom face (y = -0.5) -> indigo
    0.0,  0.73,  0.49,
    0.0,  0.73,  0.49,
    0.0,  0.73,  0.49,
    0.0,  0.73,  0.49,
    0.0,  0.73,  0.49,
    0.0,  0.73,  0.49,

    // Right face (x = 0.5) -> blue
    0.0, 0.61, 0.87,
    0.0, 0.61, 0.87,
    0.0, 0.61, 0.87,
    0.0, 0.61, 0.87,
    0.0, 0.61, 0.87,
    0.0, 0.61, 0.87,

    // Left face (x = -0.5) -> yellow
    1.0,  0.85,  0.0,
    1.0,  0.85,  0.0,
    1.0,  0.85,  0.0,
    1.0,  0.85,  0.0,
    1.0,  0.85,  0.0,
    1.0,  0.85,  0.0,
];


var cube_normals = [];

function compute_normals(vertices, normals){
    // Compute the normals for each face of the cube
    for (let i = 0; i < vertices.length; i += 9) {
        // Create vectors for each vertex from their individual coordinates
        let v1 = vec3.fromValues(vertices[i], vertices[i+1], vertices[i+2]);
        let v2 = vec3.fromValues(vertices[i+3], vertices[i+4], vertices[i+5]);
        let v3 = vec3.fromValues(vertices[i+6], vertices[i+7], vertices[i+8]);

        let v1_2 = vec3.create();       // Vector from v1 to v2
        let v1_3 = vec3.create();       // Vector from v1 to v3
        vec3.sub(v1_2, v2, v1);         // v1_2 = v2 - v1
        vec3.sub(v1_3, v3, v1);         // v1_3 = v3 - v1

        let normal = vec3.create();     // Normal vector of the face
        vec3.cross(normal, v1_2, v1_3);     // normal = v1_2 x v1_3
        vec3.normalize(normal, normal);     // Normalize the normal vector
        
        // Save the individual coordinates repeated 3 times (once for each vertex of the face)
        normals.push(normal[0], normal[1], normal[2]);          
        normals.push(normal[0], normal[1], normal[2]);
        normals.push(normal[0], normal[1], normal[2]);
    }
}

compute_normals(cube_vertices,cube_normals);


/*******************************************************************
 * Plane
 *******************************************************************/

var plane_vertices = [
    -0.5,  0.0,  -0.5,
    -0.5, 0.0,  0.5,
     0.5, 0.0,  0.5,
    -0.5,  0.0,  -0.5,
     0.5, 0.0,  0.5,
     0.5,  0.0,  -0.5,
];
var plane_normals = [
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,
];

var plane_colors = [
    0.56, 0.45, 0.4,
    0.56, 0.45, 0.4,
    0.56, 0.45, 0.4,
    0.56, 0.45, 0.4,
    0.56, 0.45, 0.4,
    0.56, 0.45, 0.4,
];




/*******************************************************************
 * Sphere
 *******************************************************************/

var sphere_vertices = [];
var sphere_normals = [];
var sphere_colors = [];

// Define the sphere vertices, normals and colors
// It will result in the sphere x^2 + y^2 + z^2 = 0.5^2
function create_sphere(){
    let step = 0.01;
    for(let u = 0; u < 1; u = u + step){
        for(let v = 0; v < 1; v = v + step){
            let t = Math.sin(Math.PI*v);

            let x1 = t*Math.cos(2*Math.PI*u);
            let z1 = t*Math.sin(2*Math.PI*u);
            let y1 = Math.cos(Math.PI*v);

            let x4 = t*Math.cos(2*Math.PI*(u+step));
            let z4 = t*Math.sin(2*Math.PI*(u+step));
            let y4 = Math.cos(Math.PI*v);



            t = Math.sin(Math.PI*(v+step));
            let x2 = t*Math.cos(2*Math.PI*u);
            let z2 = t*Math.sin(2*Math.PI*u);
            let y2 = Math.cos(Math.PI*(v+step));

            let x3 = t*Math.cos(2*Math.PI*(u+step));
            let z3 = t*Math.sin(2*Math.PI*(u+step));
            let y3 = Math.cos(Math.PI*(v+step));

            // The normal of each vertex is the same as the vertex itself, so we add the same data to sphere_vertices and sphere_normals
            sphere_vertices.push(x1,y1,z1,x3,y3,z3,x2,y2,z2);
            sphere_normals.push(x1,y1,z1,x3,y3,z3,x2,y2,z2);
            sphere_vertices.push(x1,y1,z1,x4,y4,z4,x3,y3,z3);
            sphere_normals.push(x1,y1,z1,x4,y4,z4,x3,y3,z3);

            for(let k = 0; k < 6; k++){
                sphere_colors.push(1,1,1);          // White
            }

        }
    }

    // Making the sphere have radius 0.5
    for(let i = 0; i < sphere_vertices.length; i++){
        sphere_vertices[i] = sphere_vertices[i]/2;
    }
}

create_sphere();
