import { Observer } from "mobx-react-lite";
import Decimal from "decimal.js";
import { kioskSelectionStore } from "../stores/KioskSelectionStore";

export type OrderItemData = {
  productId: number;
  variantId: null;
  quantity: number;
  total: number;
};

export type OrderData = {
  items: OrderItemData[];
};

export function parsePriceString(price: string | undefined): number {
  if (!price) return 0;
  const numeric = price.replace(/[^\d.,-]/g, "").replace(",", ".");
  const n = Number.parseFloat(numeric);
  return Number.isFinite(n) ? n : 0;
}

function getUnitPrice(product: { unitPrice?: number; price?: string }): Decimal {
  const unit = product.unitPrice ?? parsePriceString(product.price);
  return new Decimal(unit);
}

/**
 * Keeps a hidden DOM element updated with the latest order payload.
 * External services can read `document.getElementById('orderData')?.textContent`.
 */
export const OrderDataScript = ({ orderData }: { orderData: OrderData }) => {
  const json = JSON.stringify(orderData);

  return (
    <script
      id="orderData"
      type="application/json"
      style={{ display: "none" }}
      // application/json isn't executed; using innerHTML avoids React escaping.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
};

/**
 * Convenience wrapper that derives `orderData` from the kiosk selection store.
 */
export const OrderDataFromKioskSelectionStore = () => {
  return (
    <Observer
      render={() => {
        const allProducts = [
          ...kioskSelectionStore.productsList,
          ...kioskSelectionStore.additionalProductsList,
        ];

        const items: OrderItemData[] = allProducts
          .filter((p) => (p.selectedQty ?? 0) > 0)
          .map((p) => {
            const total = getUnitPrice(p).mul(p.selectedQty ?? 0);

            return {
              productId: p.id,
              variantId: null,
              quantity: p.selectedQty ?? 0,
              total: Number(total.toFixed(2)),
            };
          });

        return <OrderDataScript orderData={{ items }} />;
      }}
    />
  );
};

