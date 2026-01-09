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
  textVariants: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.25,
        duration: 0.8
      },
    },
    exit: {
      opacity: 0,
    },
  },
}

export default variants;
