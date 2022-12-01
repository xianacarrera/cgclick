const slides = [
    {
        name: "Culling",
        title: "Face Culling",
        descriptionBefore: "Watch what happens when you turn off face culling and look at the triangle from behind.",
        descriptionAfter: "Cool, right?",
        type: "slide_triangle_cube",
        params: {
            slider_face_culling: true,
        },
    },
    {
        name: "Depth",
        title: "Depth Test",
        descriptionBefore: "Now try both face culling AND depth test!",
        type: "slide_triangle_cube",
        params: {
            slider_face_culling: true,
            slider_depth_test: true,
        },
    },
    {
        name: "Shape Parametrization",
        title: "Shape Parametrization",
        descriptionBefore: "Check the right parametrization for a torus",
        type: "slide_parametrization",
    },
    {
        name: "Phong",
        title: "Phong Model Parameters",
        type: "slide_phong_model",
    },
    {
        name: "Midpoint",
        title: "Midpoint Algorithm Game",
        type: "slide_midpoint",
    },
    {
        name: "Gamma",
        title: "Gamma Correction and Tone Mapping",
        type: "slide_image_parameters",
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