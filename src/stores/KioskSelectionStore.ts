import { makeAutoObservable } from "mobx";
import Decimal from "decimal.js";
import sumBy from "lodash/sumBy";
import type { KioskCatalog, Product } from "../lib/kioskApi";

type CategoryType = "CAPSULE" | "ADDITIONAL_PRODUCT";

/**
 * A MobX store that ports Dropper's selection/constraint logic,
 * but operates on our normalized `KioskCatalog` data.
 *
 * This is intentionally separate from `ProductsStore.ts` to keep your
 * existing logic intact.
 */
export class KioskSelectionStore {
  // Loaded from catalog
  qrCode: string | null = null;
  pointId: number = 0;
  pointName: string | null = null;

  productsList: Array<Product & SelectionFields> = [];
  additionalProductsList: Array<Product & SelectionFields & AdditionalSelectionFields> = [];

  maxPurchaseQuantity: number = 0;
  purchasePerCapsuleQuantity: number = 0;

  // Derived / runtime state
  totalSelectedProductQty: number = 0;
  totalPrice: Decimal = new Decimal(0);
  selectedData: Array<{ id: number; quantity: number }> = [];

  constructor() {
    makeAutoObservable(this);
  }

  reset() {
    this.qrCode = null;
    this.pointId = 0;
    this.pointName = null;
    this.productsList = [];
    this.additionalProductsList = [];
    this.maxPurchaseQuantity = 0;
    this.purchasePerCapsuleQuantity = 0;
    this.totalSelectedProductQty = 0;
    this.totalPrice = new Decimal(0);
    this.selectedData = [];
  }

  loadFromCatalog(catalog: KioskCatalog, qrCode: string) {
    this.reset();
    this.qrCode = qrCode;
    this.pointId = catalog.pointId ?? 0;
    this.pointName = catalog.pointName ?? null;
    this.maxPurchaseQuantity = catalog.maxPurchaseQuantity ?? 0;
    this.purchasePerCapsuleQuantity = catalog.purchasePerCapsuleQuantity ?? 0;

    this.productsList = (catalog.products ?? []).map((p) => ({
      ...p,
      selectedQty: 0,
      disableInc: false,
      outOfStock: (p.availableQuantity ?? 1) <= 0,
    }));

    this.additionalProductsList = (catalog.additionalProducts ?? []).map((p) => ({
      ...p,
      selectedQty: 0,
      disableInc: true,
      outOfStock: (p.availableQuantity ?? 1) <= 0,
      maxSelectableQty: 0,
    }));

    this.recomputeAll();
  }

  incProductQty(categoryType: CategoryType, productId: number) {
    this.productQty(categoryType, productId, +1);
  }

  decProductQty(categoryType: CategoryType, productId: number) {
    this.productQty(categoryType, productId, -1);
  }

  private productQty(categoryType: CategoryType, productId: number, diff: 1 | -1) {
    const product = this.getCurrentProduct(categoryType, productId);
    if (!product) return;

    if (categoryType === "CAPSULE") {
      const available = product.availableQuantity ?? Number.POSITIVE_INFINITY;
      const maxPurchase = this.maxPurchaseQuantity || Number.POSITIVE_INFINITY;
      const perCapsuleMax = this.purchasePerCapsuleQuantity || Number.POSITIVE_INFINITY;

      if (diff === 1) {
        if (
          product.selectedQty < available &&
          product.selectedQty < maxPurchase &&
          product.selectedQty < perCapsuleMax &&
          this.totalSelectedProductQty < maxPurchase
        ) {
          product.selectedQty += 1;
          this.totalSelectedProductQty += 1;
          this.enableOrDisableProductInc();
        }
      } else {
        if (product.selectedQty !== 0) {
          product.selectedQty -= 1;
          this.totalSelectedProductQty -= 1;
          this.enableOrDisableProductInc();
        }
      }
    }

    if (categoryType === "ADDITIONAL_PRODUCT") {
      const available = product.availableQuantity ?? Number.POSITIVE_INFINITY;
      const maxSelectable = (product as any).maxSelectableQty ?? Number.POSITIVE_INFINITY;

      if (diff === 1) {
        if (product.selectedQty < available && product.selectedQty < maxSelectable) {
          product.selectedQty += 1;
        }
      } else {
        if (product.selectedQty !== 0) {
          product.selectedQty -= 1;
        }
      }
    }

    if (this.additionalProductsList.length) {
      const byClass = this.getProductsQtyByClassification();
      this.setAdditionalProductsQty(byClass.amCapsulesQty, byClass.euCapsulesQty);
      this.enableOrDisableAdditionalProductInc();
    }

    this.recomputeAll();
  }

  private recomputeAll() {
    this.addSelectedProducts();
    this.calcTotalPrice();
  }

  private calcTotalPrice() {
    const productsSum = this.productsList
      .filter((o) => o.selectedQty > 0)
      .reduce((accumulator, o) => {
        const unit = o.unitPrice ?? this.parsePriceString(o.price);
        return new Decimal(accumulator).plus(new Decimal(unit).mul(o.selectedQty).toNumber()).toNumber();
      }, 0);

    const additionalProductsSum = this.additionalProductsList
      .filter((o) => o.selectedQty > 0)
      .reduce((accumulator, o) => {
        const unit = o.unitPrice ?? this.parsePriceString(o.price);
        return new Decimal(accumulator).plus(new Decimal(unit).mul(o.selectedQty).toNumber()).toNumber();
      }, 0);

    this.totalPrice = new Decimal(productsSum).plus(additionalProductsSum);
  }

  private parsePriceString(price: string | undefined): number {
    if (!price) return 0;
    const numeric = price.replace(/[^\d.,-]/g, "").replace(",", ".");
    const n = Number.parseFloat(numeric);
    return Number.isFinite(n) ? n : 0;
  }

  private addSelectedProducts() {
    this.selectedData = [];

    for (const o of this.productsList) {
      if (o.selectedQty > 0) this.selectedData.push({ id: o.id, quantity: o.selectedQty });
    }
    for (const o of this.additionalProductsList) {
      if (o.selectedQty > 0) this.selectedData.push({ id: o.id, quantity: o.selectedQty });
    }
  }

  private enableOrDisableProductInc() {
    const maxPurchase = this.maxPurchaseQuantity || Number.POSITIVE_INFINITY;
    const perCapsuleMax = this.purchasePerCapsuleQuantity || Number.POSITIVE_INFINITY;

    this.productsList.forEach((o) => {
      const available = o.availableQuantity ?? Number.POSITIVE_INFINITY;
      o.disableInc =
        o.selectedQty >= maxPurchase ||
        o.selectedQty >= perCapsuleMax ||
        o.selectedQty >= available ||
        this.totalSelectedProductQty >= maxPurchase;
    });
  }

  private enableOrDisableAdditionalProductInc() {
    this.additionalProductsList.forEach((o) => {
      const available = o.availableQuantity ?? Number.POSITIVE_INFINITY;
      const maxSelectable = (o as any).maxSelectableQty ?? Number.POSITIVE_INFINITY;
      o.disableInc = o.selectedQty >= maxSelectable || o.selectedQty >= available;
    });
  }

  private getProductsQtyByClassification() {
    const amCapsulesQty = sumBy(
      this.productsList.filter((o) => o.productClassification === "AMERICAN_CAPSULE"),
      (o) => o.selectedQty ?? 0
    );
    const euCapsulesQty = sumBy(
      this.productsList.filter((o) => o.productClassification === "EUROPEAN_CAPSULE"),
      (o) => o.selectedQty ?? 0
    );
    return { amCapsulesQty, euCapsulesQty };
  }

  private setAdditionalProductsQty(amCapsulesQty: number, euCapsulesQty: number) {
    const amCupItem = this.additionalProductsList.find((o) => o.productClassification === "AMERICAN_CUP");
    const euCupItem = this.additionalProductsList.find((o) => o.productClassification === "EUROPEAN_CUP");
    const sugarItem = this.additionalProductsList.find((o) => o.productClassification === "SUGAR");

    // Defensive: if the backend doesn't provide these SKUs, just skip.
    if (amCupItem) this.setMaxSelectable(amCupItem, amCapsulesQty);
    if (euCupItem) this.setMaxSelectable(euCupItem, euCapsulesQty);
    if (sugarItem) this.setMaxSelectable(sugarItem, this.totalSelectedProductQty);
  }

  private setMaxSelectable(item: Product & SelectionFields & AdditionalSelectionFields, baseQty: number) {
    const available = item.availableQuantity ?? Number.POSITIVE_INFINITY;
    const perCapsule = item.perCapsuleQuantity ?? 0;
    const computed = baseQty * perCapsule;

    item.maxSelectableQty = computed <= available ? computed : available;

    if (item.selectedQty > item.maxSelectableQty) item.selectedQty = item.maxSelectableQty;
  }

  private getCurrentProduct(categoryType: CategoryType, productId: number) {
    switch (categoryType) {
      case "CAPSULE":
        return this.productsList.find((o) => o.id === productId);
      case "ADDITIONAL_PRODUCT":
        return this.additionalProductsList.find((o) => o.id === productId);
      default:
        return undefined;
    }
  }
}

type SelectionFields = {
  selectedQty: number;
  disableInc: boolean;
  outOfStock: boolean;
};

type AdditionalSelectionFields = {
  maxSelectableQty: number;
};

export const kioskSelectionStore = new KioskSelectionStore();


