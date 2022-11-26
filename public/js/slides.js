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
        displayFunction: displaySlidePhongModel,
        leaveFunction: leaveAndCancelAnimationFrame
    },
]