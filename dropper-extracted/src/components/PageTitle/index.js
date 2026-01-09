import React from "react";
import styles from "./styles.module.css";

const PageTitle = ({ label }) => {
  return (
    label 
      ? <h2 className={`${styles.pageTitle} f-lgv`}>{label ?? ""}</h2>
      : null

  );
}

export default PageTitle;
