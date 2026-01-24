import { Observer } from "mobx-react-lite";
import Decimal from "decimal.js";
import { kioskSelectionStore } from "../stores/KioskSelectionStore";

export type OrderItemData = {
  productId: number;
  variantId: number | string | null;
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
          .map((p) => {
            let quantity = p.selectedQty ?? 0;

            // Backend often requires cups to be explicitly included.
            // If user didn't select cups, default to the computed maxSelectableQty (1 cup per capsule, etc.).
            const classification = (p as any).productClassification as string | undefined;
            const maxSelectableQty = (p as any).maxSelectableQty as number | undefined;
            const isCup = classification === "AMERICAN_CUP" || classification === "EUROPEAN_CUP";

            if (isCup && quantity === 0 && (maxSelectableQty ?? 0) > 0) {
              quantity = maxSelectableQty ?? 0;
            }

            const total = getUnitPrice(p).mul(quantity);

            return {
              productId: p.id,
              // catalog-with-variants returns `priceVariants`; take the first one as default
              variantId: p.priceVariants?.[0]?.id ?? null,
              quantity,
              total: Number(total.toFixed(2)),
            };
          })
          // Keep payload small: omit 0-qty lines (except cups will be auto-defaulted above)
          .filter((i) => i.quantity > 0);

        return <OrderDataScript orderData={{ items }} />;
      }}
    />
  );
};

