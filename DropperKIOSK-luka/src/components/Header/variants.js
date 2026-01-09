const variants = {
  logoVariants: {
    hidden: {
      opacity: 0,
      y: "-100px"
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
      }
    },
    exit: {
      opacity: 0,
    },
    whileTap: {
      scale: 0.9,
      duration: 0.1
    }
  }
}

export default variants;
