const variants = {
  titleVariants: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.8
      },
    },
    exit: {
      opacity: 0,
    },
  },
  helperTextVariants: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.4,
        duration: 0.8
      },
    },
    exit: {
      opacity: 0,
    },
  },
  loaderBoxVariants: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.8,
        duration: 0.6
      },
    },
    exit: {
      opacity: 0,
    },
  },
}

export default variants;
