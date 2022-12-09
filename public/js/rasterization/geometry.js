/**
 * This code was primarly created for assignment for Computer Graphics course at USI
 * by Jiří Heller, Marie Kalousková and Xiana Carrera Alonso
 * For Software Atelier 3: The Web project we modified it a little bit to make it more tangible
 */

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

var triangle_vertices = [
    0.0,  0.5,  0.0,
   -0.5, -0.5,  0.0,
    0.5, -0.5,  0.0,
];

var triangle_normals = [
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
    0.0,  0.0,  1.0,
]

var triangle_colors = [
   1.0, 0.0, 0.0,
   0.0, 1.0, 0.0,
   0.0, 0.0, 1.0,
];

// cube's vertices (L = left, R = right, U = up/top, D = down/bottom, F = front, B = back)
var LUF = [-0.3952845, 0.25, -0.5];
var LUB = [-0.3952845, 0.5, 0.25];
var LDF = [-0.3952845, -0.5, -0.25];
var LDB = [-0.3952845, -0.25, 0.5];
var RUF = [0.3952845, 0.25, -0.5];
var RUB = [0.3952845, 0.5, 0.25];
var RDF = [0.3952845, -0.5, -0.25];
var RDB = [0.3952845, -0.25, 0.5];

var cube_vertices = [
    
    // front side
    ...RDF, ...LUF, ...LDF,
    ...LUF, ...RDF, ...RUF,

    // back side
    ...LDB, ...LUB, ...RDB,
    ...LUB, ...RUB, ...RDB, 

    // left side
    ...LDF, ...LUF, ...LDB,
    ...LUF, ...LUB, ...LDB,

    // right side
    ...RDB, ...RUF, ...RDF,
    ...RUF, ...RDB, ...RUB,

    // top side
    ...RUF, ...LUB, ...LUF,
    ...LUB, ...RUF, ...RUB,

    // bottom side
    ...LDF, ...LDB, ...RDF,
    ...LDB, ...RDB, ...RDF,

];

// cube's vertices (L = left, R = right, U = up/top, D = down/bottom, F = front, B = back)
// looking to along -z
var LUF_PM = [-0.5, 0.5, 0.5];
var LUB_PM = [-0.5, 0.5, -0.5];
var LDF_PM = [-0.5, -0.5, 0.5];
var LDB_PM = [-0.5, -0.5, -0.5];
var RUF_PM = [0.5, 0.5, 0.5];
var RUB_PM = [0.5, 0.5, -0.5];
var RDF_PM = [0.5, -0.5, 0.5];
var RDB_PM = [0.5, -0.5, -0.5];

var cube_vertices_PM = [
    
    // front side
    ...RDF_PM, ...LUF_PM, ...LDF_PM,
    ...LUF_PM, ...RDF_PM, ...RUF_PM,

    // back side
    ...LDB_PM, ...LUB_PM, ...RDB_PM,
    ...LUB_PM, ...RUB_PM, ...RDB_PM, 

    // left side
    ...LDF_PM, ...LUF_PM, ...LDB_PM,
    ...LUF_PM, ...LUB_PM, ...LDB_PM,

    // right side
    ...RDB_PM, ...RUF_PM, ...RDF_PM,
    ...RUF_PM, ...RDB_PM, ...RUB_PM,

    // top side
    ...RUF_PM, ...LUB_PM, ...LUF_PM,
    ...LUB_PM, ...RUF_PM, ...RUB_PM,

    // bottom side
    ...LDF_PM, ...LDB_PM, ...RDF_PM,
    ...LDB_PM, ...RDB_PM, ...RDF_PM,

];

var red = [1.0, 0.0, 0.0];
var green = [0.0, 1.0, 0.0]
var blue = [0.0, 0.0, 1.0];
var cyan = [0.0, 1.0, 1.0];
var magenta = [1.0, 0.0, 1.0];
var yellow = [1.0, 1.0, 0.0];

var cube_colors = [

    // front side
    ...red, ...red, ...red,
    ...red, ...red, ...red,

    // back side
    ...cyan, ...cyan, ...cyan,
    ...cyan, ...cyan, ...cyan,
    
    // left side
    ...green, ...green, ...green,
    ...green, ...green, ...green, 

    // right side
    ...magenta, ...magenta, ...magenta,
    ...magenta, ...magenta, ...magenta,

    // top side
    ...blue, ...blue, ...blue,
    ...blue, ...blue, ...blue, 

    // bottom side
    ...yellow, ...yellow, ...yellow,
    ...yellow, ...yellow, ...yellow,

];
var cube_normals = [];

function crossProduct(vect_A, vect_B) {
    let cross_P = [];
    cross_P[0] = vect_A[1] * vect_B[2]
    - vect_A[2] * vect_B[1];
    cross_P[1] = vect_A[2] * vect_B[0]
    - vect_A[0] * vect_B[2];
    cross_P[2] = vect_A[0] * vect_B[1]
    - vect_A[1] * vect_B[0];
    return cross_P;
}

function compute_normals(vertices, normals) {
    for (let i = 0; i < vertices.length; i += 9) {
        let A = [vertices[i+0], vertices[i+1], vertices[i+2]];
        let B = [vertices[i+3], vertices[i+4], vertices[i+5]];
        let C = [vertices[i+6], vertices[i+7], vertices[i+8]];
        
        let normal = crossProduct([B[0]-A[0], B[1]-A[1], B[2]-A[2]], [C[0]-A[0], C[1]-A[1], C[2]-A[2]]);

        normals[i] = normals[i+3] = normals[i+6] = normal[0];
        normals[i+1] = normals[i+4] = normals[i+7] = normal[1];
        normals[i+2] = normals[i+5] = normals[i+8] = normal[2];
    }
}
compute_normals(cube_vertices_PM, cube_normals);

var sphere_vertices = [];
var sphere_colors = [];
var sphere_normals = [];
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

            sphere_vertices.push(x1,y1,z1,x3,y3,z3,x2,y2,z2);
            sphere_vertices.push(x1,y1,z1,x4,y4,z4,x3,y3,z3);

            for(let k = 0; k < 6; k++){
                sphere_colors.push(1,1,1);
            }

        }
    }
    //making the sphere a unit sphere
    for(let i = 0; i < sphere_vertices.length; i++){
        sphere_vertices[i] = sphere_vertices[i]/2;
    }
}

create_sphere();
compute_normals(sphere_vertices, sphere_normals);

