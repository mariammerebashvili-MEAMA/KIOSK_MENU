import { Observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { useKiosk } from "../../contexts/KioskContext";
import { kioskSelectionStore } from "../../stores/KioskSelectionStore";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import type { Product } from "../../lib/kioskApi";

type Tab = "capsules" | "extras" | "payment";

export const KioskFlow = () => {
  const { catalog, products, additionalProducts, qrCode } = useKiosk();
  const [activeTab, setActiveTab] = useState<Tab>("capsules");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");

  useEffect(() => {
    if (catalog && qrCode) kioskSelectionStore.loadFromCatalog(catalog, qrCode);
  }, [catalog, qrCode]);

  const hasAdditional = useMemo(() => (additionalProducts?.length ?? 0) > 0, [additionalProducts]);

  const next = () => {
    if (activeTab === "capsules") {
      if (hasAdditional && kioskSelectionStore.totalSelectedProductQty > 0) setActiveTab("extras");
      else setActiveTab("payment");
    } else if (activeTab === "extras") {
      setActiveTab("payment");
    } else {
      // Stub: order creation will be wired next (card + crypto)
      console.log("Creating order with:", {
        paymentMethod,
        selectedProducts: kioskSelectionStore.selectedData,
        total: kioskSelectionStore.totalPrice.toString(),
      });
      alert("Order creation wiring is next (logic already extracted).");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-white portrait:aspect-[9/16] overflow-x-hidden">
      <main className="flex-1 flex flex-col w-full">
        <div className="w-full flex justify-center p-4 sm:p-5 md:p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} className="w-auto">
            <TabsList className="inline-flex items-center gap-1 bg-[#f2f2f2] rounded-[50px] h-auto p-1">
              <TabsTrigger
                value="capsules"
                className="w-[160px] sm:w-[200px] md:w-[240px] h-[56px] sm:h-[64px] md:h-[72px] px-6 py-4 rounded-[50px] data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-[#f2f2f2] data-[state=inactive]:text-black [font-family:'Inter',Helvetica] font-normal text-base sm:text-lg md:text-xl transition-all"
              >
                Capsules
              </TabsTrigger>
              <TabsTrigger
                value="extras"
                className="w-[160px] sm:w-[200px] md:w-[240px] h-[56px] sm:h-[64px] md:h-[72px] px-6 py-4 rounded-[50px] data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-[#f2f2f2] data-[state=inactive]:text-black [font-family:'Inter',Helvetica] font-normal text-base sm:text-lg md:text-xl transition-all"
              >
                Sugar & Cup
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="w-[160px] sm:w-[200px] md:w-[240px] h-[56px] sm:h-[64px] md:h-[72px] px-6 py-4 rounded-[50px] data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-[#f2f2f2] data-[state=inactive]:text-black [font-family:'Inter',Helvetica] font-normal text-base sm:text-lg md:text-xl transition-all"
              >
                Payment
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <section className="w-screen py-6">
          <div className="w-full max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            {activeTab === "capsules" ? (
              <CapsulesGrid products={products} />
            ) : activeTab === "extras" ? (
              <ExtrasList products={additionalProducts} />
            ) : (
              <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
            )}
          </div>
        </section>
      </main>

      <footer className="w-screen sticky bottom-0 bg-white border-t border-gray-100 p-4 sm:p-5">
        <div className="max-w-[1080px] mx-auto flex items-center justify-between gap-4">
          <Observer
            render={() => (
              <div className="text-black">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-2xl font-bold">{kioskSelectionStore.totalPrice.toFixed(2)}₾</div>
              </div>
            )}
          />
          <Button className="h-[56px] px-8 rounded-[18px]" onClick={next}>
            {activeTab === "payment" ? "Buy" : "Next"}
          </Button>
        </div>
      </footer>
    </div>
  );
};

function CapsulesGrid({ products }: { products: Product[] }) {
  return (
    <Observer
      render={() => (
        <div className="grid grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-14">
          {kioskSelectionStore.productsList.map((product) => (
            <Card key={product.id} className="w-full aspect-[3/4] bg-webdroppermeamagealabaster rounded-[16px] sm:rounded-[18px] md:rounded-[20px] border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0 relative h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-10">
                  <div
                    className="w-full h-full max-h-[180px] sm:max-h-[220px] md:max-h-[260px] lg:max-h-[300px] bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${product.imageUrl || product.image})` }}
                  />
                </div>

                <div className="flex flex-col items-center gap-2 pb-6 sm:pb-8 md:pb-10">
                  <div className="[font-family:'ABeeZee',Helvetica] text-black text-lg sm:text-xl md:text-2xl font-normal tracking-[0] text-center">{product.name}</div>
                  <div className="font-webdropper-meama-ge-meama-sans-LGV-regular-11-9 text-[#00000080] text-sm sm:text-base md:text-lg text-center">{product.type}</div>
                  <div className="[font-family:'Albert_Sans',Helvetica] font-semibold text-black text-lg sm:text-xl md:text-2xl tracking-[0] text-center mt-1">
                    {product.unitPrice != null ? `${product.unitPrice}₾` : product.price}
                  </div>

                  <div className="inline-flex items-center gap-4 sm:gap-5 md:gap-6 mt-3 sm:mt-4">
                    <Button variant="ghost" size="icon" className="w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] md:w-[52px] md:h-[52px] p-0 hover:bg-transparent hover:scale-110 transition-transform" onClick={() => kioskSelectionStore.decProductQty("CAPSULE", product.id)}>
                      <img className="w-full h-full" alt="Decrease" src="/frame-1321316898.svg" />
                    </Button>

                    <div className="w-10 sm:w-12 md:w-14 h-8 sm:h-10 md:h-12 flex items-center justify-center [font-family:'Albert_Sans',Helvetica] font-bold text-black text-xl sm:text-2xl md:text-3xl">
                      {product.selectedQty}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] md:w-[52px] md:h-[52px] p-0 hover:bg-transparent hover:scale-110 transition-transform disabled:opacity-40 disabled:hover:scale-100"
                      disabled={product.disableInc || product.outOfStock}
                      onClick={() => kioskSelectionStore.incProductQty("CAPSULE", product.id)}
                    >
                      <img className="w-full h-full" alt="Increase" src="/frame-1321316899.svg" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {products.length === 0 && <div className="text-gray-500">No products</div>}
        </div>
      )}
    />
  );
}

function ExtrasList({ products }: { products: Product[] }) {
  return (
    <Observer
      render={() => (
        <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
          {kioskSelectionStore.additionalProductsList.map((p) => (
            <div key={p.id} className="bg-white rounded-[20px] p-4 sm:p-5 md:p-6 shadow-md border border-gray-100">
              <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                  <img src={p.imageUrl || p.image || "/cup.png"} alt={p.name} className="w-full h-full object-contain p-2" />
                </div>

                <div className="flex-1">
                  <div className="text-lg sm:text-xl font-semibold text-black">{p.name}</div>
                  <div className="text-sm text-gray-500">Max: {p.maxSelectableQty ?? 0}</div>
                </div>

                <div className="inline-flex items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => kioskSelectionStore.decProductQty("ADDITIONAL_PRODUCT", p.id)}>
                    <img className="w-8 h-8" alt="Decrease" src="/frame-1321316898.svg" />
                  </Button>
                  <div className="w-10 text-center text-xl font-bold">{p.selectedQty}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={p.disableInc || p.outOfStock}
                    onClick={() => kioskSelectionStore.incProductQty("ADDITIONAL_PRODUCT", p.id)}
                  >
                    <img className="w-8 h-8" alt="Increase" src="/frame-1321316899.svg" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && <div className="text-gray-500">No extras</div>}
        </div>
      )}
    />
  );
}

function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
}: {
  paymentMethod: "card" | "crypto";
  setPaymentMethod: (m: "card" | "crypto") => void;
}) {
  return (
    <div className="bg-white rounded-[20px] p-6 shadow-md border border-gray-100">
      <div className="text-xl font-semibold mb-4">Payment method</div>
      <div className="flex gap-3">
        <Button variant={paymentMethod === "card" ? "default" : "secondary"} onClick={() => setPaymentMethod("card")}>
          Card / Apple Pay / Google Pay
        </Button>
        <Button variant={paymentMethod === "crypto" ? "default" : "secondary"} onClick={() => setPaymentMethod("crypto")}>
          Crypto
        </Button>
      </div>
    </div>
  );
}


