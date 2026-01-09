const variants = {
  mainTitleVariants: {
    hidden: { 
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 0.9
      }
    }
  },
  textBoxVariants: {
    hidden: { 
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.9
      }
    }
  }
}

export default variants;
