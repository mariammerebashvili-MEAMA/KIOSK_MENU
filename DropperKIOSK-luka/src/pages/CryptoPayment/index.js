import React, { useEffect, useRef } from "react";
import { Observer } from "mobx-react";
import { motion } from "framer-motion";
import variants from "./variants";
import prStore from "../Products/store";

import styles from "./styles.module.css";

const CryptoPayment = () => {
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    prStore.createCryptoOrder()
  }, []);

  return (
    <Observer
      render={() => (
        <React.Fragment>
          <motion.div>
            <div className={`page-content`}>
              <main>
                <motion.h2
                  className={styles.iframeBox}
                  variants={variants.iframeBoxVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <iframe
                    allowtransparency="true"
                    style={{ backgroundColor: "#ff00ff" }}
                    frameBorder={0}
                    src={prStore.cryptoPaymentUrl}
                    title="Iframe Example"
                    className={styles.iframe}
                  ></iframe>
                </motion.h2>
              </main>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    />
  );
};

export default CryptoPayment;
