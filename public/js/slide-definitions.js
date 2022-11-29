slideDefinitions = {
    slide_triangle_cube: {
        displayFunction: displaySlideTriangleCube,
        leaveFunction: leaveAndCancelAnimationFrame,
    },
    slide_parametrization: {
        displayFunction: displaySlideParametrization,
        leaveFunction: leaveAndCancelAnimationFrame,
    },
    slide_phong_model: {
        displayFunction: displaySlidePhongModel,
        leaveFunction: leaveAndCancelAnimationFrame,
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
    },
}