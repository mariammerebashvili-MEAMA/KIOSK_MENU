const variants = {
  svgVariants: {
    hidden: {
      scale: 0,
    },
    visible : {
      scale: 1,
      opacity: 1,
      originX: 0,
      transition: {
        type: "spring",
        bounce: 0.5,
        duration: 1,
        delay: 0.2,
      }
    },
    exit: {
      scale: [1, 0],
      opacity: 0
    }
  }
}

export default variants;
