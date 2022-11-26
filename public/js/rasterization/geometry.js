/**
 * This code was primarly created for assignment for Computer Graphics course at USI
 * by Jiří Heller, Marie Kalousková and Xiana Carrera Alonso
 * For Software Atelier 3: The Web project we modified it a little bit to make it more tangible
 */

 var triangle_vertices = [
    0.0,  0.5,  0.0,
   -0.5, -0.5,  0.0,
    0.5, -0.5,  0.0,
];

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
