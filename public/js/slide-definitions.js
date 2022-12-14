slideDefinitions = {
    playground_phong_model: {
        displayFunction: displaySlidePhongModel,
        leaveFunction: leaveAndCancelAnimationFrame,
        sceneDescriptions: {
            complex: "Multiple different objects",
            triangle: "RGB triangle",
            cube: "RGB cube",
        },
        defaultParams: {
            canvas_size: "exact",
            canvas_width: 500,
            canvas_height: 500,
            available_scenes: ["complex", "triangle", "cube"],
            available_scenes_descriptions: [],
            slider_camera_angles: false,
            slider_camera_distance: false,
            slider_camera_fov: false,
            slider_lights: false,
            slider_face_culling: false,
            slider_depth_test: false,
            slider_gamma: false,
            slider_tone_mapping: false,
        },
        evaluation: "no_eval",
    },
    playground_shaders: {
        displayFunction: displaySlideShaders,
        leaveFunction: leaveAndCancelAnimationFrame,
        defaultParams: {
            canvas_size: "exact",
            canvas_width: 300,
            canvas_height: 300,
        },
        evaluation: "no_eval",
    },
    question_parametrization: {
        displayFunction: displaySlideParametrization,
        leaveFunction: leaveAndCancelAnimationFrame,
        defaultParams: {
            canvas_size: "exact",
            canvas_width: 500,
            canvas_height: 240,
        },
        evaluation: "teacher",
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
            alpha: {
                startIndex: 0.5,
                endIndex: 3,
                step: 0.5,
            },
            beta: {
                startIndex: 0.5,
                endIndex: 3,
                step: 0.5,
            },
            gamma: {
                startIndex: 0.5,
                endIndex: 5,
                step: 0.5,
            },
        },
        evaluation: "teacher",
        double_canvas: true,
    },
    question_complete_parametrization: {
        displayFunction: displaySlideCompleteParametrization,
        leaveFunction: leaveAndCancelAnimationFrame,
        defaultParams: {
            canvas_size: "exact",
            canvas_width: 500,
            canvas_height: 240,
        },
        evaluation: "no_eval",
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
        defaultParams: {
            showButtons: true,
        },
        evaluation: "teacher",
        answer_container: "answer-list",
    }
}