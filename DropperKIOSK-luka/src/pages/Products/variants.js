const variants = {
  pageVariants: {
    hidden: {
      // opacity: 0,
    },
    visible: {
      // opacity: 1,
      // transition: {
      //   duration: 0.8,
      // },
    },
    exit: {
      // opacity: 0,
    },
  },
  languagesVariants: {
    hidden: {
      // opacity: 1,
      // transition: {
      //   duration: 0.3
      // },
    },
    visible: {
      // opacity: 1,
      // transition: {
      //   duration: 0.3
      // },
    },
    exit: {
      // opacity: 1,
      // transition: {
      //   duration: 0.3
      // },
    }
  },
  pageTitleVariants: {
    hidden: {
      opacity: 0,
      x: "4vw",
      transition: {
        duration: 0.3
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring"
      },
    },
    exit: {
      opacity: 0,
      x: "-1.5vw",
      transition: {
        duration: 0.3
      },
    }
  },
  backBtnVariants: {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.2
      },
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.1
      },
    },
    whileTap: {
      scale: 0.9,
      duration: 0.1
    }
  },
  tabBgVariants: {
    type: "spring", 
    stiffness: 200, 
    damping: 17
  },
  tabsVariants: {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.2
      },
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.1
      },
    },
  },
  tabContentVariants: {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.2
      },
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.1
      },
    },
  },
}

export default variants;
