slideDefinitions = {
    slide_triangle_cube: {
        displayFunction: displaySlideTriangleCube,
        leaveFunction: leaveAndCancelAnimationFrame,
        defaultParams: {
            slider_face_culling: false,
            slider_depth_test: false,
        },
    },
    slide_parametrization: {
        displayFunction: displaySlideParametrization,
        leaveFunction: leaveAndCancelAnimationFrame,
    },
    slide_phong_model: {
        displayFunction: displaySlidePhongModel,
        leaveFunction: leaveAndCancelAnimationFrame,
        defaultParams: {
            slider_face_culling: false,
            slider_depth_test: false,
        },
    },
    slide_midpoint: {
        displayFunction: displaySlideMidpoint,
        leaveFunction: () => {},
    },
    slide_image_parameters: {
        displayFunction: displaySlideImageParameters,
        leaveFunction: leaveAndCancelAnimationFrame,
    },
    slide_about: {
        displayFunction: displayAboutSlide,
        leaveFunction: () => {},
        defaultParams: {
            subslide: "idea",
        },
    },
}