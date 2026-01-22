import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Product, CapsuleType } from "../../lib/kioskApi";
import { OrderDataScript, parsePriceString, type OrderItemData } from "../../components/OrderDataScript";

// Default products for backward compatibility (non-kiosk mode)
const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Berry Hibiscus",
    type: "Black Tea",
    price: "2.25₾",
    image: "/lead-09-20--20copy-1638346565438-png.png",
    capsuleType: "european",
  },
  {
    id: 2,
    name: "Green Tea Mint",
    type: "Green Tea",
    price: "2.25₾",
    image: "/lead-09-20--20copy-1638346565438-png-1.png",
    capsuleType: "european",
  },
  {
    id: 3,
    name: "American Coffee",
    type: "Coffee",
    price: "2.50₾",
    image: "/lead-09-20--20copy-1638346565438-png-2.png",
    capsuleType: "american",
  },
  {
    id: 4,
    name: "Espresso Bold",
    type: "Coffee",
    price: "2.50₾",
    image: "/lead-09-20--20copy-1638346565438-png-3.png",
    capsuleType: "american",
  },
];

interface BoxProps {
  products?: Product[];
}

export const Box = ({ products = defaultProducts }: BoxProps): JSX.Element => {
  // Initialize quantities dynamically based on products
  const initializeQuantities = (productList: Product[]) => {
    return productList.reduce((acc, product) => {
      acc[product.id] = 0;
      return acc;
    }, {} as Record<number, number>);
  };

  const [quantities, setQuantities] = useState<Record<number, number>>(
    initializeQuantities(products)
  );

  // Update quantities when products change
  useEffect(() => {
    setQuantities(initializeQuantities(products));
  }, [products]);
  
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<"capsules" | "sugar">("capsules");
  const [sugarCount, setSugarCount] = useState<number>(0);
  const [cupCount, setCupCount] = useState<number>(0);

  const handleIncrement = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const handleDecrement = (id: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] - 1),
    }));
  };

  const handleNext = () => {
    const hasProducts = Object.values(quantities).some((qty) => qty > 0);
    if (hasProducts) {
      setShowPopup(true);
    }
  };

  // Determine capsule type based on selected products
  const getSelectedCapsuleType = (): CapsuleType | null => {
    const selectedProducts = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id]) => products.find((p) => p.id === Number(id)))
      .filter(Boolean);

    if (selectedProducts.length === 0) return null;

    // Check if all selected products have the same capsule type
    const capsuleTypes = selectedProducts.map((p) => p!.capsuleType);
    const uniqueTypes = [...new Set(capsuleTypes)];

    // If mixed types, default to the first one (or handle differently)
    return uniqueTypes[0];
  };

  const handlePopupResponse = (addExtras: boolean) => {
    setShowPopup(false);
    if (addExtras) {
      // Switch to Sugar & Cup tab
      setActiveTab("sugar");
    } else {
      // Proceed to checkout or next step
      console.log("User declined extras, proceeding to checkout");
    }
  };

  const handleSugarChange = (increment: boolean) => {
    setSugarCount((prev) => {
      if (increment) {
        return Math.min(3, prev + 1); // Max 3 units
      } else {
        return Math.max(0, prev - 1); // Min 0 units
      }
    });
  };

  const handleCupChange = (increment: boolean) => {
    setCupCount((prev) => {
      if (increment) {
        return prev + 1; // No max limit for cups
      } else {
        return Math.max(0, prev - 1); // Min 0 units
      }
    });
  };

  // Calculate total price
  const calculateTotal = () => {
    return Object.entries(quantities).reduce((total, [id, qty]) => {
      const product = products.find((p) => p.id === Number(id));
      if (product) {
        const price = parseFloat(product.price.replace("₾", ""));
        return total + price * qty;
      }
      return total;
    }, 0);
  };

  const totalPrice = calculateTotal();

  const orderItems = useMemo<OrderItemData[]>(() => {
    const items: OrderItemData[] = [];

    for (const p of products) {
      const qty = quantities[p.id] ?? 0;
      if (qty <= 0) continue;

      const unit = parsePriceString(p.price);
      const total = unit * qty;

      items.push({
        productId: p.id,
        variantId: p.priceVariants?.[0]?.id ?? null,
        quantity: qty,
        total: Number(total.toFixed(2)),
      });
    }

    // Box-mode extras don't have real backend IDs; include stable negative IDs so
    // integrators can still detect them if needed.
    if (cupCount > 0) {
      items.push({
        productId: -100,
        variantId: null,
        quantity: cupCount,
        total: 0,
      });
    }
    if (sugarCount > 0) {
      items.push({
        productId: -101,
        variantId: null,
        quantity: sugarCount,
        total: 0,
      });
    }

    return items;
  }, [products, quantities, cupCount, sugarCount]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-white portrait:aspect-[9/16] overflow-x-hidden">
      <OrderDataScript orderData={{ items: orderItems }} />
      <main className="flex-1 flex flex-col w-full">
        <div className="w-full flex justify-center p-4 sm:p-5 md:p-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "capsules" | "sugar")} className="w-auto">
            <TabsList className="inline-flex items-center gap-1 bg-[#f2f2f2] rounded-[50px] h-auto p-1">
              <TabsTrigger
                value="capsules"
                className="w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] h-[56px] sm:h-[64px] md:h-[72px] px-8 py-4 rounded-[50px] data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-[#f2f2f2] data-[state=inactive]:text-black [font-family:'Inter',Helvetica] font-normal text-base sm:text-lg md:text-xl transition-all"
              >
                Select Capsules
              </TabsTrigger>
              <TabsTrigger
                value="sugar"
                className="w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px] h-[56px] sm:h-[64px] md:h-[72px] px-8 py-4 rounded-[50px] data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-[#f2f2f2] data-[state=inactive]:text-black [font-family:'Inter',Helvetica] font-normal text-base sm:text-lg md:text-xl transition-all"
              >
                Sugar & Cup
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <section className="w-screen py-6">
          <div className="w-full max-w-[1080px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            {activeTab === "capsules" ? (
              <div className="grid grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-14">
                {products.map((product) => (
              <Card
                key={product.id}
                className="w-full aspect-[3/4] bg-webdroppermeamagealabaster rounded-[16px] sm:rounded-[18px] md:rounded-[20px] border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent className="p-0 relative h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-10">
                    <div
                      className="w-full h-full max-h-[180px] sm:max-h-[220px] md:max-h-[260px] lg:max-h-[300px] bg-contain bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url("${encodeURI(product.image || product.media?.[0]?.url || "/cup.png")}")`,
                      }}
                    />
                  </div>

                  <div className="flex flex-col items-center gap-2 pb-6 sm:pb-8 md:pb-10">
                    <div className="[font-family:'ABeeZee',Helvetica] text-black text-lg sm:text-xl md:text-2xl font-normal tracking-[0] text-center">
                      {product.name}
                    </div>

                    <div className="font-webdropper-meama-ge-meama-sans-LGV-regular-11-9 text-[#00000080] text-sm sm:text-base md:text-lg text-center">
                      {product.type}
                    </div>

                    <div className="[font-family:'Albert_Sans',Helvetica] font-semibold text-black text-lg sm:text-xl md:text-2xl tracking-[0] text-center mt-1">
                      {product.price}
                    </div>

                    <div className="inline-flex items-center gap-4 sm:gap-5 md:gap-6 mt-3 sm:mt-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] md:w-[52px] md:h-[52px] p-0 hover:bg-transparent hover:scale-110 transition-transform"
                        onClick={() => handleDecrement(product.id)}
                      >
                        <img
                          className="w-full h-full"
                          alt="Decrease"
                          src="/frame-1321316898.svg"
                        />
                      </Button>

                      <div className="w-10 sm:w-12 md:w-14 h-8 sm:h-10 md:h-12 flex items-center justify-center [font-family:'Albert_Sans',Helvetica] font-bold text-black text-xl sm:text-2xl md:text-3xl">
                        {quantities[product.id]}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-[36px] h-[36px] sm:w-[44px] sm:h-[44px] md:w-[52px] md:h-[52px] p-0 hover:bg-transparent hover:scale-110 transition-transform"
                        onClick={() => handleIncrement(product.id)}
                      >
                        <img
                          className="w-full h-full"
                          alt="Increase"
                          src="/frame-1321316899.svg"
                        />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
                ))}
              </div>
            ) : (
              /* Sugar & Cup Tab Content - Card Style */
              <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                {/* Multi Capsule Cup - with quantity controls */}
                <div className="bg-white rounded-[20px] p-4 sm:p-5 md:p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
                    {/* Cup Image */}
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                      <img 
                        src="/cup.png" 
                        alt="Multi Capsule Cup" 
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          console.error('❌ Cup image failed to load from /cup.png');
                          e.currentTarget.src = '/lead-09-20--20copy-1638346565438-png.png';
                        }}
                        onLoad={() => console.log('✅ Cup image loaded successfully')}
                      />
                    </div>

                    {/* Cup Info */}
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 [font-family:'Meama LGV',Helvetica] mb-1">
                        Multi Capsule Cup
                      </h3>
                      <p className="text-sm sm:text-base text-gray-500 mb-2">Multi Capsule</p>
                      <p className="text-base sm:text-lg md:text-xl font-medium text-gray-800">0.00₾</p>
                    </div>

                    {/* Quantity Controls or Select Button */}
                    {cupCount > 0 ? (
                      <div className="flex items-center gap-3 sm:gap-4">
                        <button
                          onClick={() => handleCupChange(false)}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-200 hover:bg-green-300 flex items-center justify-center transition-all"
                        >
                          <span className="text-2xl sm:text-3xl text-white font-light">−</span>
                        </button>
                        <span className="text-xl sm:text-2xl md:text-3xl font-medium min-w-[30px] text-center">{cupCount}</span>
                        <button
                          onClick={() => handleCupChange(true)}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-400 hover:bg-green-500 flex items-center justify-center transition-all"
                        >
                          <span className="text-2xl sm:text-3xl text-white font-light">+</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCupCount(1)}
                        className="px-8 sm:px-10 md:px-12 py-3 sm:py-4 bg-black text-white rounded-full text-base sm:text-lg md:text-xl font-medium hover:bg-gray-800 transition-all"
                      >
                        Select
                      </button>
                    )}
                  </div>
                </div>

                {/* Appropriate Cup Based on Capsule Type - ONLY ONE SHOWN */}
                {(() => {
                  const capsuleType = getSelectedCapsuleType();
                  const isEuropean = capsuleType === "european";
                  const cupName = isEuropean ? "European Capsule Cup" : "American Capsule Cup";
                  const cupDescription = isEuropean ? "European Capsule" : "American Capsule";
                  
                  return (
                    <div className="bg-white rounded-[20px] p-4 sm:p-5 md:p-6 shadow-md border border-gray-100">
                      <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
                        {/* Cup Image */}
                        <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                          <img 
                            src="/cup.png" 
                            alt={cupName}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              console.error('❌ Cup image failed to load from /cup.png');
                              e.currentTarget.src = '/lead-09-20--20copy-1638346565438-png.png';
                            }}
                            onLoad={() => console.log('✅ Cup image loaded successfully')}
                          />
                        </div>

                        {/* Cup Info */}
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 [font-family:'Meama LGV',Helvetica] mb-1">
                            {cupName}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-500 mb-2">{cupDescription}</p>
                          <p className="text-base sm:text-lg md:text-xl font-medium text-gray-800">0.00₾</p>
                        </div>

                        {/* Quantity Controls - Same as Multi Capsule Cup */}
                        {cupCount > 0 ? (
                          <div className="flex items-center gap-3 sm:gap-4">
                            <button
                              onClick={() => handleCupChange(false)}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-200 hover:bg-green-300 flex items-center justify-center transition-all"
                            >
                              <span className="text-2xl sm:text-3xl text-white font-light">−</span>
                            </button>
                            <span className="text-xl sm:text-2xl md:text-3xl font-medium min-w-[30px] text-center">{cupCount}</span>
                            <button
                              onClick={() => handleCupChange(true)}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-400 hover:bg-green-500 flex items-center justify-center transition-all"
                            >
                              <span className="text-2xl sm:text-3xl text-white font-light">+</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setCupCount(1)}
                            className="px-8 sm:px-10 md:px-12 py-3 sm:py-4 bg-black text-white rounded-full text-base sm:text-lg md:text-xl font-medium hover:bg-gray-800 transition-all"
                          >
                            Select
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Sugar - with Select button */}
                <div className="bg-white rounded-[20px] p-4 sm:p-5 md:p-6 shadow-md border border-gray-100">
                  <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
                    {/* Sugar Image */}
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                      <img 
                        src="/suggar.png" 
                        alt="Sugar" 
                        className="w-full h-full object-contain p-3"
                        onError={(e) => {
                          console.error('❌ Sugar image failed to load from /suggar.png');
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={() => console.log('✅ Sugar image loaded successfully')}
                      />
                    </div>

                    {/* Sugar Info */}
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 [font-family:'Meama LGV',Helvetica] mb-1">
                        Sugar
                      </h3>
                      <p className="text-sm sm:text-base text-gray-500 mb-2">Sugar Stick</p>
                      <p className="text-base sm:text-lg md:text-xl font-medium text-gray-800">0.00₾</p>
                    </div>

                    {/* Sugar Counter or Select */}
                    {sugarCount > 0 ? (
                      <div className="flex items-center gap-3 sm:gap-4">
                        <button
                          onClick={() => handleSugarChange(false)}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-200 hover:bg-green-300 flex items-center justify-center transition-all"
                        >
                          <span className="text-2xl sm:text-3xl text-white font-light">−</span>
                        </button>
                        <span className="text-xl sm:text-2xl md:text-3xl font-medium min-w-[30px] text-center">{sugarCount}</span>
                        <button
                          onClick={() => handleSugarChange(true)}
                          disabled={sugarCount >= 3}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                            sugarCount >= 3 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-400 hover:bg-green-500'
                          }`}
                        >
                          <span className="text-2xl sm:text-3xl text-white font-light">+</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSugarCount(1)}
                        className="px-8 sm:px-10 md:px-12 py-3 sm:py-4 bg-black text-white rounded-full text-base sm:text-lg md:text-xl font-medium hover:bg-gray-800 transition-all"
                      >
                        Select
                      </button>
                    )}
                  </div>
                  {sugarCount === 3 && (
                    <p className="text-sm text-orange-600 mt-2 text-center">Maximum 3 units</p>
                  )}
                </div>

                {/* Back to Capsules Button */}
                <button
                  onClick={() => setActiveTab("capsules")}
                  className="w-full py-4 mt-4 text-gray-600 hover:text-black text-base sm:text-lg font-medium transition-all"
                >
                  ← Back to Capsules
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-gray-200 w-full">
        <div className="w-full max-w-[1080px] mx-auto flex items-center justify-between px-8 sm:px-12 md:px-16 lg:px-20 py-6 sm:py-7 md:py-8">
          <div className="flex flex-col gap-2">
            <div className="[font-family:'Inter',Helvetica] font-normal text-[#c0c0c0] text-base sm:text-lg md:text-xl tracking-[0] leading-[normal]">
              Total Price
            </div>

            <div className="[font-family:'Inter',Helvetica] font-bold text-black text-3xl sm:text-4xl md:text-5xl tracking-[0] leading-[normal]">
              {totalPrice.toFixed(2)} GEL
            </div>
          </div>

          <Button 
            onClick={handleNext}
            className="w-36 sm:w-40 md:w-44 h-[64px] sm:h-[72px] md:h-[80px] px-10 py-5 bg-black rounded-[50px] hover:bg-black/90 transition-all hover:scale-105"
          >
            <span className="[font-family:'Inter',Helvetica] font-medium text-white text-lg sm:text-xl md:text-2xl text-center tracking-[0] leading-[normal]">
              Next
            </span>
          </Button>
        </div>
      </footer>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative w-[90%] max-w-[400px] bg-white rounded-[24px] shadow-2xl p-8 transform transition-all duration-300 animate-scale-in">
            {/* Coffee Cup Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-14 h-14 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 21h18v-2H2v2zM20 8h-2V5h2c1.1 0 2 .9 2 2s-.9 2-2 2zm-2 10H4V5h12v13zm0-15H4c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4h-2V5c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
            </div>

            {/* Question Text */}
            <h2 className="text-center text-gray-800 text-xl sm:text-2xl font-normal mb-8 [font-family:'Meama Sans LGV',Helvetica]">
              Would you like to add cup or sugar?
            </h2>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => handlePopupResponse(false)}
                variant="outline"
                className="flex-1 h-[56px] rounded-[28px] border-2 border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-lg font-medium transition-all hover:scale-105"
              >
                No
              </Button>
              <Button
                onClick={() => handlePopupResponse(true)}
                className="flex-1 h-[56px] rounded-[28px] bg-black hover:bg-black/90 text-white text-lg font-medium transition-all hover:scale-105"
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
