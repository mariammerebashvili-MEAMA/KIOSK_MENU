import React, { useState } from "react";

import styles from "./AppDownloadPopup.module.css";
import { useTranslation } from "react-i18next";
import { getAppStoreUrl } from "../../utils/deviceDetection";

const AppDownloadPopupComponent = () => {
    const { t } = useTranslation();
    const [showPopup, setShowPopup] = useState(true);

  return (
    <div className={styles.popup_body + " " + (!showPopup ? styles.hide_app_download_popup : "")}>
        <div className={styles.app_download_logo}>
            <img src='/App-Logo.svg' alt='app-logo' />
        </div>
        <div>
            <div>
                <p style={{fontWeight: "bold", marginBottom: 5}}>MEAMA</p>
            </div>
            <div>
                <p className={styles.subTitle}>{t("download-app")}</p>
                <p className={styles.subTitle}>{t("download-app1")}</p>
            </div>
        </div>

        <div onClick={() => setShowPopup(false)} className={styles.close_button} aria-label="Close app download popup" role="button">
            &#x2715;
        </div>
        <div className={styles.app_get_button}>
            <a style={{color: "white"}} target="blank" href={getAppStoreUrl()}>GET</a>
        </div>
    </div>
  );
};

export default AppDownloadPopupComponent;
