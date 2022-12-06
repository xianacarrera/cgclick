slideDefinitions = {
    playground_triangle_cube: {
        displayFunction: displaySlideTriangleCube,
        leaveFunction: leaveAndCancelAnimationFrame,
        defaultParams: {
            slider_face_culling: false,
            slider_depth_test: false,
        },
        evaluation: "teacher",
    },
    question_parametrization: {
        displayFunction: displaySlideParametrization,
        leaveFunction: leaveAndCancelAnimationFrame,
        evaluation: "teacher",
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
        evaluation: "teacher",
    },
    playground_shaders: {
        displayFunction: displaySlideShaders,
        leaveFunction: leaveAndCancelAnimationFrame,
    },
    question_midpoint: {
        displayFunction: displaySlideMidpoint,
        leaveFunction: () => {},
        evaluation: "auto",
    },
    question_image_parameters: {
        displayFunction: displaySlideImageParameters,
        leaveFunction: leaveAndCancelAnimationFrame,
        evaluation: "teacher",
    },
    question_complete_parametrization: {
        displayFunction: displaySlideCompleteParametrization,
        leaveFunction: leaveAndCancelAnimationFrame,
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
    question_open: {
        displayFunction: displayOpenQuestionSlide,
        leaveFunction: () => {},
        evaluation: "teacher",
        answer_container: "answer-list",
    }
}