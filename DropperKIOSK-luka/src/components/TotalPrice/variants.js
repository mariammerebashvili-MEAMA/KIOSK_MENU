const variants = {
  totalPriceBoxVariants: {
    hidden: {
      y: "105%"
    },
    visible: {
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.9,
        type: "tween",
        ease: [0.4, 0.5, 0, 1]
      }
    },
    exit: {
      y: "105%"
    }
  },
  leftBoxVariants: {
    hidden: {
      opacity: 0,
      x: "25%"
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring"
      }
    },
  },
};

export default variants;
