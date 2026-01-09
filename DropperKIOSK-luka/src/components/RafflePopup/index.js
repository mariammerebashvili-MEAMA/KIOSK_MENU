import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import useDeviceDetection from "../../hooks/useDeviceDetection";
import styles from "./styles.module.css";
import trophyImage from "../../assets/images/rafflePopupImages/trophy.png";
import starImage from "../../assets/images/rafflePopupImages/star.png";
import ticketImage from "../../assets/images/rafflePopupImages/ticket.png";
import confettiImage from "../../assets/images/rafflePopupImages/Confetti.png";
import grayStarImage from "../../assets/images/rafflePopupImages/graystar.png";
import appleImage from "../../assets/images/rafflePopupImages/apple.png";
import googlePlayImage from "../../assets/images/rafflePopupImages/googleplay.png";

const RafflePopup = () => {
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);
  const { isIOS, isAndroid, isMobile } = useDeviceDetection();

  useEffect(() => {
    // Show popup every time user opens the page
    const showTimer = setTimeout(() => {
      setShowPopup(true);
    }, 1000);

    // Auto-close after 1 hour (3600000 milliseconds)
    const autoCloseTimer = setTimeout(() => {
      setShowPopup(false);
    }, 3600000);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(autoCloseTimer);
    };
  }, []);

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleAppStoreClick = () => {
    window.open("https://apps.apple.com/us/app/meama/id1438754087", "_blank");
  };

  const handleGooglePlayClick = () => {
    window.open("https://play.google.com/store/search?q=meama&c=apps", "_blank");
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.popup}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              duration: 0.5 
            }}
          >
            {/* Logo */}
            <div className={styles.logo}>
              <img src="/App-Logo.svg" alt="MEAMA Logo" />
            </div>

            {/* Participation Banner */}
            <div 
              className={styles.participationBanner}
              style={{ backgroundImage: `url(${ticketImage})` }}
            >
              <div className={styles.trophyIcon}>
                <img src={trophyImage} alt="Trophy" />
              </div>
              <div className={styles.starIcon}>
                <img src={starImage} alt="Star" />
              </div>
              <div className={styles.participationText}>
                {t('raffle-participation-text')}
                <span className={styles.registerText}>{t('register')}</span>
                {' '}{t('raffle-participation-text-2')}
              </div>
            </div>

            {/* Raffle Date Banner */}
            <div className={styles.dateBanner}>
              <div className={styles.confettiLeft}>
                <img src={confettiImage} alt="Confetti" />
              </div>
              <span className={styles.dateText}>{t('raffle-date')}</span>
              <div className={styles.confettiRight}>
                <img src={confettiImage} alt="Confetti" />
              </div>
            </div>

            {/* App Store Button - Show for iOS users or web users */}
            {(isIOS || !isMobile) && (
              <button 
                className={styles.appStoreButton}
                onClick={handleAppStoreClick}
              >
                <img src={appleImage} alt="Apple" className={styles.appleIcon} />
                <span>{t('download-app-store')}</span>
              </button>
            )}

            {/* Google Play Button - Show for Android users or web users */}
            {(isAndroid || !isMobile) && (
              <button 
                className={styles.googlePlayButton}
                onClick={handleGooglePlayClick}
              >
                <img src={googlePlayImage} alt="Google Play" className={styles.googlePlayIcon} />
                <span>{t('get-on-google-play')}</span>
              </button>
            )}

            {/* Close Button */}
            <button 
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Close raffle popup"
            >
              ✕
            </button>

            {/* Background Gray Stars */}
            <div className={styles.grayStar1}>
              <img src={grayStarImage} alt="Gray Star" />
            </div>
            <div className={styles.grayStar2}>
              <img src={grayStarImage} alt="Gray Star" />
            </div>
            <div className={styles.grayStar3}>
              <img src={grayStarImage} alt="Gray Star" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RafflePopup;
