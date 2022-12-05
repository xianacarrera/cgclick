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
    },
    {
        name: "Shape Parametrization",
        title: "Shape Parametrization",
        type: "question_parametrization",
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
        name: "Shaders",
        title: "Shaders",
        descriptionBefore: "Try to complete the vertex and fragment shaders to display a scene!",
        type: "playground_shaders",
    },
    {
        name: "Midpoint",
        title: "Midpoint Algorithm Game",
        type: "question_midpoint",
    },
    {
        name: "Image Comparison",
        title: "Comparison of Gamma Correction and Tone Mapping",
        type: "question_image_parameters",
    },
    {
        name: "Complete Parametrization",
        title: "Complete Parametrization",
        descriptionBefore: "Complete the blank spaces to create a valid sphere parametrization:",
        type: "question_complete_parametrization",
    },
    {
        name: "About: Idea",
        type: "slide_about",
        params: {
            subslide: "idea",
        },
    },
    {
        name: "About: Story",
        type: "slide_about",
        params: {
            subslide: "story",
        },
    },
    {
        name: "About: Technology",
        type: "slide_about",
        params: {
            subslide: "technology",
        },
    },
]