import React, { useState,  useEffect } from "react";
import { Observer } from "mobx-react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import variants from "./variants";
import productsStore from "../../../stores/productsStore";
import { useTranslation } from 'react-i18next';
import Item from "./Item";
import Details from "./Details";
import styles from "./styles.module.css";

const ProductsList = () => {
  const { t } = useTranslation();

  const [showProductDetails, setShowProductDetails] = useState(false);
  const [productId, setProductId] = useState();
  const [currentProductDetails, setCurrentProductDetails] = useState([]);

  useEffect(() => {
    setCurrentProductDetails(productsStore.productsList?.filter(item => item?.id === productId)[0]?.description);
    return () => setCurrentProductDetails([]);
  }, [productId]);
  
  showProductDetails !== false 
    ? document.getElementsByTagName('body')[0].classList.add('disable-scroll')
    : document.getElementsByTagName('body')[0].classList.remove('disable-scroll')

  return (
    <React.Fragment>
      <motion.div className={styles.items} variants={variants.itemsVariants} initial="hidden" animate="visible" exit="exit">
        <div className="row">
          <Observer render={() => (
            productsStore.productsList.length ? (
              productsStore.productsList?.map((item, index) => {
                return (
                  <div className="col-6" key={index}>
                    <Observer render={() => (
                      <Item 
                        item={item} 
                        onInfoClick={() => {
                          setTimeout(() => setShowProductDetails(true), 50);
                          setProductId(item.id);
                        }}
                        incQty={() => { productsStore.incProductQty(productsStore.categoryTypeEnums.capsule, item.id) }}
                        decQty={() => { productsStore.decProductQty(productsStore.categoryTypeEnums.capsule, item.id) }}
                      />
                    )} />
                  </div>
                )
              })
            ) : (
              <div className={styles.noProductsFound}>{t('no-products-found')}</div>
            )
          )} />
        </div>
      </motion.div>
      
      {createPortal(
        <AnimatePresence mode='wait'>
          {showProductDetails !== false && <Details item={currentProductDetails} isOpen={showProductDetails !== false} onClick={() => setShowProductDetails(false)} />}
        </AnimatePresence>,
        document.getElementById('productDetailsBox')
      )}
      
    </React.Fragment>
  );
};

export default ProductsList;