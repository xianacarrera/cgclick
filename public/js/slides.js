const slides = [
    {
        name: "Culling",
        title: "Face Culling",
        descriptionBefore: "Watch what happens when you turn off face culling and look at the triangle from behind.",
        descriptionAfter: "Cool, right?",
        type: "playground_triangle_cube",
        params: {
            slider_face_culling: true,
        },
        evaluation: "auto",
    },
    {
        name: "Depth",
        title: "Depth Test",
        descriptionBefore: "Now try both face culling AND depth test!",
        type: "playground_triangle_cube",
        params: {
            slider_face_culling: true,
            slider_depth_test: true,
        },
        evaluation: "auto",
    },
    {
        name: "Shape Parametrization",
        title: "Shape Parametrization",
        descriptionBefore: "Check the right parametrization for a torus",
        type: "question_parametrization",
        evaluation: "auto",
    },
    {
        name: "Gamma",
        title: "Gamma Correction",
        type: "playground_phong_model",
        params: {
            slider_gamma: true,
        },
    },
    {
        name: "Tone Mapping",
        title: "Tone Mapping",
        type: "playground_phong_model",
        params: {
            slider_tone_mapping: true,
        },
    },
    {
        name: "Field Of View",
        title: "Field Of View",
        descriptionAfter: "Do you see how the ratio of sides of the cube doesn't change?",
        type: "playground_phong_model",
        params: {
            slider_camera_fov: true,
        },
    },
    {
        name: "Moving camera",
        title: "Moving the camera around",
        type: "playground_phong_model",
        params: {
            slider_camera_angles: true,
            slider_camera_distance: true,
        },
    },
    {
        name: "Moving light",
        title: "Moving the light around",
        type: "playground_phong_model",
        params: {
            slider_lights: true,
        },
    },
    {
        name: "Phong",
        title: "Phong Model Parameters",
        type: "playground_phong_model",
        evaluation: "teacher",
        params: {
            slider_camera_angles: true,
            slider_camera_distance: true,
            slider_camera_fov: true,
            slider_lights: true,
            slider_face_culling: true,
            slider_depth_test: true,
            slider_gamma: true,
            slider_tone_mapping: true,
        },
    },
    {
        name: "Midpoint",
        title: "Midpoint Algorithm Game",
        type: "question_midpoint",
        evaluation: "auto",
    },
    {
        name: "Gamma",
        title: "Gamma Correction and Tone Mapping",
        type: "question_image_parameters",
        evaluation: "teacher",
    },
    {
        name: "About: Idea",
        type: "slide_about",
        params: {
            subslide: "idea",
        },
        evaluation: "no_eval",
    },
    {
        name: "About: Story",
        type: "slide_about",
        params: {
            subslide: "story",
        },
        evaluation: "no_eval",
    },
    {
        name: "About: Technology",
        type: "slide_about",
        params: {
            subslide: "technology",
        },
    },
]