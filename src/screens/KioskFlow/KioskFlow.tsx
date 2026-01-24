import { Observer } from "mobx-react-lite";
import { useEffect, useMemo, useRef, useState } from "react";
import { useKiosk } from "../../contexts/KioskContext";
import { kioskSelectionStore } from "../../stores/KioskSelectionStore";
import { OrderDataFromKioskSelectionStore } from "../../components/OrderDataScript";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import type { Product } from "../../lib/kioskApi";

type Tab = "capsules" | "extras";

export const KioskFlow = () => {
  const { catalog, products, additionalProducts, qrCode } = useKiosk();
  const [activeTab, setActiveTab] = useState<Tab>("capsules");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Payment part disabled for now (per request)
  // const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");

  useEffect(() => {
    if (catalog && qrCode) kioskSelectionStore.loadFromCatalog(catalog, qrCode);
  }, [catalog, qrCode]);

  const hasAdditional = useMemo(() => (additionalProducts?.length ?? 0) > 0, [additionalProducts]);

  const next = () => {
    if (isSubmitting) return;

    if (activeTab === "capsules") {
      if (hasAdditional && kioskSelectionStore.totalSelectedProductQty > 0) {
        setActiveTab("extras");
        return;
      }

      // No extras step → treat as final "Buy"
      setIsSubmitting(true);
      return;
    } else if (activeTab === "extras") {
      // Buy action: show loader until backend refreshes/reloads the page.
      setIsSubmitting(true);
      return;
    }
  };

  const isLastStep = activeTab === "extras" || !hasAdditional;

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <OrderDataFromKioskSelectionStore />

      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center px-8">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
            </div>
            <h2 className="text-xl sm:text-2xl font-normal text-gray-800 [font-family:'Meama Sans LGV',Helvetica]">
              Working with terminal
            </h2>
            
          </div>
        </div>
      )}

      <main className="flex-1 min-h-0 flex flex-col w-full overflow-hidden">
        <div className="w-full flex justify-center p-4 sm:p-5 md:p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} className="w-auto">
            <TabsList className="inline-flex items-center gap-1 bg-[#f2f2f2] rounded-[50px] h-auto p-1">
              <TabsTrigger
                value="capsules"
                className="w-[160px] sm:w-[200px] md:w-[240px] h-[56px] sm:h-[64px] md:h-[72px] px-6 py-4 rounded-[50px] data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-[#f2f2f2] data-[state=inactive]:text-black [font-family:'Meama LGV',Helvetica] font-medium text-base sm:text-lg md:text-xl transition-all"
              >
                Capsules
              </TabsTrigger>
              <TabsTrigger
                value="extras"
                className="w-[160px] sm:w-[200px] md:w-[240px] h-[56px] sm:h-[64px] md:h-[72px] px-6 py-4 rounded-[50px] data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-[#f2f2f2] data-[state=inactive]:text-black [font-family:'Meama LGV',Helvetica] font-medium text-base sm:text-lg md:text-xl transition-all"
              >
                Sugar & Cup
              </TabsTrigger>
              {/*
                Payment part disabled for now (per request)
                <TabsTrigger
                  value="payment"
                  className="w-[160px] sm:w-[200px] md:w-[240px] h-[56px] sm:h-[64px] md:h-[72px] px-6 py-4 rounded-[50px] data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-[#f2f2f2] data-[state=inactive]:text-black [font-family:'Meama LGV',Helvetica] font-medium text-base sm:text-lg md:text-xl transition-all"
                >
                  Payment
                </TabsTrigger>
              */}
            </TabsList>
          </Tabs>
        </div>

        <section className="w-full flex-1 min-h-0 overflow-hidden py-4 sm:py-5 md:py-6">
          <div className="w-full h-full max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden">
            {activeTab === "capsules" ? (
              <CapsulesGrid products={products} />
            ) : activeTab === "extras" ? (
              <ExtrasList products={additionalProducts} />
            ) : null /* Payment part disabled */}
          </div>
        </section>
      </main>

      <footer className="flex-none w-full bg-white border-t border-gray-100 p-3 sm:p-4 md:p-5 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        <div className="max-w-[1080px] mx-auto flex items-center justify-between gap-4 pr-[50px]">
          <Observer
            render={() => (
              <div className="text-black">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-2xl font-bold">{kioskSelectionStore.totalPrice.toFixed(2)}₾</div>
              </div>
            )}
          />
          <Button id={activeTab === "extras" ? "next-extras" : "next-capsules"} className="w-[112px] h-[49px] rounded-[38px] px-0" onClick={next}>
          {isLastStep ? "Buy" : "Next"}
          </Button>
        </div>
      </footer>
    </div>
  );
};

function getProductImage(product: Product): string {
  return (
    product.image ||
    product.media?.[0]?.url ||
    product.imageUrl ||
    "/cup.png"
  );
}

function toCssUrl(rawUrl: string): string {
  // CSS url(...) breaks on spaces unless quoted/encoded.
  const encoded = encodeURI(rawUrl);
  return `url("${encoded}")`;
}

function CapsulesGrid({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState({ cols: 2, rows: 2 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const items = kioskSelectionStore.productsList.length || 1;
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);

      // Heuristic: choose cols near sqrt(n * w/h) to keep cells close to square.
      const rawCols = Math.ceil(Math.sqrt((items * w) / h));
      const cols = Math.min(6, Math.max(2, rawCols));
      const rows = Math.ceil(items / cols);
      setLayout({ cols, rows });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Observer
      render={() => (
        <div ref={containerRef} className="h-full w-full overflow-hidden">
          <div
            className="grid h-full w-full"
            style={{
              gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
              gap: "clamp(8px, 1.2vh, 16px)",
            }}
          >
          {kioskSelectionStore.productsList.map((product) => (
            <Card
              key={product.id}
              className="w-full h-full bg-webdroppermeamagealabaster rounded-[16px] sm:rounded-[18px] md:rounded-[20px] border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-0 relative h-full flex flex-col">
                <div className="flex-1 min-h-0 flex items-center justify-center p-[clamp(8px,1.4vh,18px)]">
                  <div
                    className="w-full h-full bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: toCssUrl(getProductImage(product)),
                      // EU capsule images are visually larger; size responsively
                      backgroundSize:
                        product.productClassification === "EUROPEAN_CAPSULE"
                          ? "clamp(70px, 8vh, 90px) clamp(70px, 8vh, 90px)"
                          : "contain",
                    }}
                  />
                </div>

                <div className="flex-none flex flex-col items-center gap-[0.4vh] pb-[clamp(8px,1.2vh,16px)] px-[clamp(8px,1vw,16px)]">
                  <div className="[font-family:'Meama LGV',Helvetica] text-black text-[clamp(12px,1.8vh,22px)] font-medium tracking-[0] text-center leading-tight line-clamp-2">
                    {product.name}
                  </div>
                  <div className="text-[#00000080] text-[clamp(10px,1.4vh,18px)] text-center leading-tight line-clamp-1">
                    {product.type}
                  </div>
                  <div className="[font-family:'Meama Sans LGV',Helvetica] font-medium text-black text-[clamp(12px,1.8vh,22px)] tracking-[0] text-center mt-[0.2vh]">
                    {product.unitPrice != null ? `${product.unitPrice}₾` : product.price}
                  </div>

                  <div className="inline-flex items-center gap-[clamp(8px,1vw,16px)] mt-[clamp(6px,0.8vh,12px)]">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-0 hover:bg-transparent hover:scale-110 transition-transform w-[clamp(28px,3.4vh,46px)] h-[clamp(28px,3.4vh,46px)]"
                      onClick={() => kioskSelectionStore.decProductQty("CAPSULE", product.id)}
                    >
                      <img className="w-full h-full" alt="Decrease" src="/frame-1321316898.svg" />
                    </Button>

                    <div className="w-[clamp(34px,4.5vh,60px)] h-[clamp(26px,3.6vh,44px)] flex items-center justify-center [font-family:'Meama Sans LGV',Helvetica] font-medium text-black text-[clamp(14px,2.2vh,28px)]">
                      {product.selectedQty}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-0 hover:bg-transparent hover:scale-110 transition-transform disabled:opacity-40 disabled:hover:scale-100 w-[clamp(28px,3.4vh,46px)] h-[clamp(28px,3.4vh,46px)]"
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
        </div>
      )}
    />
  );
}

function ExtrasList({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cols, setCols] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      // Force single-column layout so "Cups" and "Sugar" quantity bars
      // are stacked under each other with a fixed gap.
      setCols(1);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Observer
      render={() => (
        <div ref={containerRef} className="h-full w-full overflow-hidden">
          <div
            className="grid h-full w-full"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              // Use auto rows so items don't stretch and create huge "visual gaps"
              // when the container has extra vertical space.
              gridAutoRows: "max-content",
              alignContent: "start",
              rowGap: "15px",
            }}
          >
          {kioskSelectionStore.additionalProductsList.map((p) => (
            <div key={p.id} className="bg-white rounded-[20px] p-[clamp(10px,1.6vh,18px)] shadow-md border border-gray-100 h-full overflow-hidden">
              <div className="flex items-center gap-[clamp(10px,1.6vh,18px)] h-full">
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                  <img src={getProductImage(p)} alt={p.name} className="w-full h-full object-contain p-2" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[clamp(12px,1.8vh,20px)] font-semibold text-black leading-tight line-clamp-2">{p.name}</div>
                  <div className="text-[clamp(10px,1.4vh,16px)] text-gray-500">Max: {p.maxSelectableQty ?? 0}</div>
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
        </div>
      )}
    />
  );
}

/*
  PaymentMethod component disabled for now (per request).
  Keeping it commented for easy re-enable later.
*/


