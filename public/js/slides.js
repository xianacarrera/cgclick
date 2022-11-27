const slides = [
    {
        title: "How are you today?",
        displayFunction: displaySlideOpenQuestion,
        leaveFunction: () => {},
    },
    {
        title: "Face Culling and Depth Test",
        displayFunction: displaySlideTriangleCube,
        leaveFunction: leaveAndCancelAnimationFrame,
    },
    {
        title: "Parametrization",
        displayFunction: displaySlideParametrization,
        leaveFunction: leaveAndCancelAnimationFrame,
    },
    {
        title: "Phong Model",
        displayFunction: displaySlidePhongModel,
        leaveFunction: leaveAndCancelAnimationFrame,
    },
    {
        displayFunction: displaySlideMidpoint,
        leaveFunction: () => {}
    }
]