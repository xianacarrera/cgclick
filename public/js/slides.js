const slides = [
    {
        displayFunction: displaySlideOpenQuestion,
        leaveFunction: () => {}
    },
    {
        displayFunction: displaySlideTriangleCube,
        leaveFunction: leaveAndCancelAnimationFrame
    },
    {
        displayFunction: displaySlideParametrization,
        leaveFunction: leaveAndCancelAnimationFrame
    },
    {
        displayFunction: displaySlidePhongModel,
        leaveFunction: leaveAndCancelAnimationFrame
    },
    {
        displayFunction: displayAboutSlide.bind(null, "idea"),
        leaveFunction: () => {}
    },
    {
        displayFunction: displayAboutSlide.bind(null, "story"),
        leaveFunction: () => {}
    },
    {
        displayFunction: displayAboutSlide.bind(null, "technology"),
        leaveFunction: () => {}
    }
]