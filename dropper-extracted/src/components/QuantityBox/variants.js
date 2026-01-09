const variants = {
  quantityBoxVariants: {
    hidden: { 
      opacity: 0, 
      scale: 0.2
    },
    visible: {
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 0.07,
        type: "spring",
        duration: 0.6,
        bounce: 0.45
      }
    }
  },
  quantityBtnVariants: {
    whileTap: {
      scale: 0.9,
      duration: 0.1
    }
  }
}

export default variants;
