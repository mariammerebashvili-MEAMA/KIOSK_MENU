const variants = {
  itemVariants: {
    hidden: { 
      opacity: 0, 
      scale: 0.8
    },
    visible: {
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        duration: 1.2,
        bounce: 0.6
      }
    }
  },
  infoIconVariants: {
    whileTap: {
      scale: 0.9,
      duration: 0.1
    }
  }
}

export default variants;
