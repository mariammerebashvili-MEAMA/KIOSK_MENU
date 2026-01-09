import React, { useEffect, useState, useRef } from "react";
import styles from "./styles.module.css";

const BusyLayer = () => {
  const dataFetchedRef = useRef(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    setTimeout(() => setDisabled(true), 700);
  }, []);

  return (
    <div className={`${styles.layer} ${disabled ? styles.disabled : ""}`}></div>
  );
}

export default BusyLayer;
