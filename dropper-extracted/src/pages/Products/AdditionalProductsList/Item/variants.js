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
  }
}

export default variants;
