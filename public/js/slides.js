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
        displayFunction: displaySlideMidpoint,
        leaveFunction: () => {}
    }
]