const variants = {
  overlayVariants: {
    hidden: { 
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
    exit: { 
      opacity: 0,
    },
  },
  boxVariants: {
    hidden: { 
      opacity: 0.5,
      y: "100%",
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0
    },
    visible: {
      opacity: 1,
      y: 0,
      borderTopLeftRadius: 1200,
      borderTopRightRadius: 1200,
      transition: {
        duration: 0.9,
        type: "tween",
        ease: [0.2, 0.4, 0, 1]
      }
    },
    exit: { 
      opacity: 0,
      y: "100%",
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0
    },
  },
  imgBoxVariants: {
    hidden: { 
      opacity: 0,
      y: "30vw",
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        type: "spring",
        stiffness: 200,
        damping: 30,
        mass: 0.1,
        duration: 2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.1
      }
    }
  },
  imgVariants: {
    hidden: { 
      rotate: 0
    },
    visible: {
      rotate: 20,
      transition: {
        delay: 0.2,
        ease: "easeOut",
        duration: 0.9
      }
    }
  },
  topInfoVariants: {
    hidden: { 
      opacity: 0,
      scale: 0.85
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.7
      }
    }
  },
  lineVariants: {
    hidden: { 
      scaleX: 0
    },
    visible: {
      scaleX: 1,
      transition: {
        delay: 0.2,
        duration: 0.7,
        ease: "easeOut"
      }
    }
  },
  scrollerVariants: {
    hidden: { 
      opacity: 0,
      y: "5vw"
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.9,
      }
    }
  }
}

export default variants;
