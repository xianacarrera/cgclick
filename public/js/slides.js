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
        name: "Parametrization",
        title: "Shape Parametrization",
        type: "question_parametrization",
        evaluation: "auto",
    },
    {
        name: "Phong",
        title: "Phong Model Parameters",
        type: "playground_phong_model",
        evaluation: "teacher",
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