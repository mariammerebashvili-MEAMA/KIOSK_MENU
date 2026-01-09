const variants = {
  exitBtnVariants: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.8
      },
    },
    exit: {
      opacity: 0,
    },
    whileTap: {
      scale: 0.9,
      duration: 0.1
    }
  },
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
        delay: 0.2,
        duration: 0.8
      },
    },
    exit: {
      opacity: 0,
    },
  },
  numberBoxVariants: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.8
      },
    },
    exit: {
      opacity: 0,
    },
  },
  agreeCheckboxVariants: {
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
  keyboardBoxVariants: {
    hidden: {
      opacity: 0,
      y: "6vw"
    },
    visible: {
      opacity: 1,
      y: "0",
      transition: {
        delay: 0.1,
        duration: 0.6
      },
    },
    exit: {
      opacity: 0,
    }
  }
}

export default variants;
