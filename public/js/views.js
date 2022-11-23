//EJS Compiled Views - This file was automatically generated on Tue Nov 22 2022 20:04:11 GMT+0100 (Central European Standard Time)
 ejs.views_include = function(locals) {
     console.log("views_include_setup",locals);
     return function(path, d) {
         console.log("ejs.views_include",path,d);
         return ejs["views_"+path.replace(/\//g,"_").replace(/-/g,"_")]({...d,...locals}, null, ejs.views_include(locals));
     }
 };
 