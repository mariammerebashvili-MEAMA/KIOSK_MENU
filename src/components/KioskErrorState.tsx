import { Button } from "./ui/button";

interface KioskErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const KioskErrorState = ({
  title = "Kiosk Not Found",
  message = "The kiosk identifier is invalid or missing. Please scan the QR code again or contact support.",
  onRetry,
  showRetry = false,
}: KioskErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-50 p-8">
      <div className="max-w-md w-full bg-white rounded-[24px] shadow-xl p-8 sm:p-12 text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Error Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 [font-family:'Inter',Helvetica]">
          {title}
        </h1>

        {/* Error Message */}
        <p className="text-base sm:text-lg text-gray-600 mb-8 [font-family:'Inter',Helvetica] leading-relaxed">
          {message}
        </p>

        {/* Retry Button (optional) */}
        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            className="w-full h-[56px] rounded-[28px] bg-black hover:bg-black/90 text-white text-lg font-medium transition-all hover:scale-105"
          >
            Try Again
          </Button>
        )}

        {/* Support Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 [font-family:'Inter',Helvetica]">
            Need help? Contact support
          </p>
        </div>
      </div>
    </div>
  );
};

