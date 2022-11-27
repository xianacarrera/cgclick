const slides = [
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
        title: "Midpoint",
        displayFunction: displaySlideMidpoint,
        leaveFunction: () => {},
    },
    {
        title: "Image parameters",
        displayFunction: displaySlideImageParameters,
        leaveFunction: leaveAndCancelAnimationFrame,
    },
]