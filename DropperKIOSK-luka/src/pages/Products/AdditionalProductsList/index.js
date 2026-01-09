import React from "react";
import { Observer } from "mobx-react";
import { motion } from "framer-motion";
import variants from "./variants";
import productsStore from "../../../stores/productsStore";
import { useTranslation } from 'react-i18next';
import Item from "./Item";
import styles from "./styles.module.css";

const AdditionalProductsList = () => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <motion.div className={styles.items} variants={variants.itemsVariants} initial="hidden" animate="visible" exit="exit">
        <div className="row">
          <Observer render={() => (
            productsStore.additionalProductsList.length ? (
            productsStore.additionalProductsList?.map((item, index) => {
              return (
                <div className="col-12" key={index}>
                  <Observer render={() => (
                    item?.maxSelectableQty ?
                    <Item 
                      item={item}
                      incQty={() => { productsStore.incProductQty(productsStore.categoryTypeEnums.additionalProduct, item.id) }}
                      decQty={() => { productsStore.decProductQty(productsStore.categoryTypeEnums.additionalProduct, item.id) }}
                    /> : null
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
      
    </React.Fragment>
  );
};

export default AdditionalProductsList;