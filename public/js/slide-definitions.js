slideDefinitions = {
    playground_triangle_cube: {
        displayFunction: displaySlideTriangleCube,
        leaveFunction: leaveAndCancelAnimationFrame,
        defaultParams: {
            canvas_size: "exact",
            canvas_width: 500,
            canvas_height: 500,
            slider_face_culling: false,
            slider_depth_test: false,
        },
        evaluation: "teacher",
    },
    question_parametrization: {
        displayFunction: displaySlideParametrization,
        leaveFunction: leaveAndCancelAnimationFrame,
        defaultParams: {
            canvas_size: "exact",
            canvas_width: 300,
            canvas_height: 300,
        },
        evaluation: "teacher",
    },
    playground_phong_model: {
        displayFunction: displaySlidePhongModel,
        leaveFunction: leaveAndCancelAnimationFrame,
        defaultParams: {
            canvas_size: "exact",
            canvas_width: 500,
            canvas_height: 500,
            slider_camera_angles: false,
            slider_camera_distance: false,
            slider_camera_fov: false,
            slider_lights: false,
            slider_face_culling: false,
            slider_depth_test: false,
            slider_gamma: false,
            slider_tone_mapping: false,
        },
        evaluation: "teacher",
    },
    playground_shaders: {
        displayFunction: displaySlideShaders,
        leaveFunction: leaveAndCancelAnimationFrame,
        defaultParams: {
            canvas_size: "exact",
            canvas_width: 300,
            canvas_height: 300,
        },
    },
    question_midpoint: {
        displayFunction: displaySlideMidpoint,
        leaveFunction: () => {},
        evaluation: "auto",
    },
    question_image_parameters: {
        displayFunction: displaySlideImageParameters,
        leaveFunction: leaveAndCancelAnimationFrame,
        defaultParams: {
            canvas_size: "exact",
            canvas_width: 600,
            canvas_height: 300,
            target_alpha: 2,
            target_beta: 2,
            target_gamma: 2,
        },
        evaluation: "teacher",
        double_canvas: true,
    },
    question_complete_parametrization: {
        displayFunction: displaySlideCompleteParametrization,
        leaveFunction: leaveAndCancelAnimationFrame,
        defaultParams: {
            canvas_size: "exact",
            canvas_width: 300,
            canvas_height: 300,
        },
        evaluation: "teacher",
    },
    slide_about: {
        displayFunction: displayAboutSlide,
        leaveFunction: () => {},
        defaultParams: {
            subslide: "idea",
        },
        evaluation: "no_eval",
    },
}