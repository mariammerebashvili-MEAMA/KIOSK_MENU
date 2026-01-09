export const KioskLoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <h2 className="text-xl sm:text-2xl font-medium text-gray-700 [font-family:'Inter',Helvetica]">
          Loading Kiosk...
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mt-2 [font-family:'Inter',Helvetica]">
          Please wait while we prepare your menu
        </p>
      </div>
    </div>
  );
};

