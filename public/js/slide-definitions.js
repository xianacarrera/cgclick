slideDefinitions = {
    playground_triangle_cube: {
        displayFunction: displaySlideTriangleCube,
        leaveFunction: leaveAndCancelAnimationFrame,
        defaultParams: {
            slider_face_culling: false,
            slider_depth_test: false,
        },
    },
    question_parametrization: {
        displayFunction: displaySlideParametrization,
        leaveFunction: leaveAndCancelAnimationFrame,
    },
    playground_phong_model: {
        displayFunction: displaySlidePhongModel,
        leaveFunction: leaveAndCancelAnimationFrame,
        defaultParams: {
            slider_camera_angles: false,
            slider_camera_distance: false,
            slider_camera_fov: false,
            slider_lights: false,
            slider_face_culling: false,
            slider_depth_test: false,
            slider_gamma: false,
            slider_tone_mapping: false,
        },
    },
    question_midpoint: {
        displayFunction: displaySlideMidpoint,
        leaveFunction: () => {},
    },
    question_image_parameters: {
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