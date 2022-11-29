const slides = [
    {
        name: "Culling & Depth",
        title: "Face Culling and Depth Test",
        descriptionBefore: "Watch what happens when you turn off face culling and look at the triangle from behind.",
        descriptionAfter: "Cool, right?",
        displayFunction: displaySlideTriangleCube,
        leaveFunction: leaveAndCancelAnimationFrame,
    },
    {
        name: "Parametrization",
        title: "Shape Parametrization",
        displayFunction: displaySlideParametrization,
        leaveFunction: leaveAndCancelAnimationFrame,
    },
    {
        name: "Phong Model",
        title: "Phong Model Parameters",
        displayFunction: displaySlidePhongModel,
        leaveFunction: leaveAndCancelAnimationFrame,
    },
    {
        name: "Midpoint Algorithm",
        title: "Midpoint Algorithm Game",
        displayFunction: displaySlideMidpoint,
        leaveFunction: () => {},
    },
    {
        name: "Image parameters",
        title: "Gamma Correction and Tone Mapping",
        displayFunction: displaySlideImageParameters,
        leaveFunction: leaveAndCancelAnimationFrame,
    },
    {
        name: "About: Idea",
        displayFunction: displayAboutSlide.bind(null, "idea"),
        leaveFunction: () => {}
    },
    {
        name: "About: Story",
        displayFunction: displayAboutSlide.bind(null, "story"),
        leaveFunction: () => {}
    },
    {
        name: "About: Technology",
        displayFunction: displayAboutSlide.bind(null, "technology"),
        leaveFunction: () => {}
    }
]