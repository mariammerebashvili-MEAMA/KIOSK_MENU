const variants = {
  buttonBoxVariants: {
    hidden: {
      opacity: 0,
      scale: 0
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        duration: 1.2,
        bounce: 0.45
      },
    },
    exit: {
      opacity: 0,
    }
  },
  buttonVariants: {
    whileTap: {
      scale: 0.9,
      duration: 0.1,
      delay: 0
    }
  }
}

export default variants;
