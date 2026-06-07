import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { XCircle } from "lucide-react";

const OrderFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="pt-32 px-6 flex flex-col items-center text-center">
    
        <XCircle size={80} className="text-red-500 mb-6" />
 
        <h1 className="text-3xl font-semibold mb-2">
          Payment Failed 
        </h1>

        <p className="text-sm opacity-70 mb-6 max-w-md">
          Something went wrong while processing your payment.
          Don’t worry — no money has been deducted.
        </p>
 
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/checkout")}
            className="px-6 py-3 rounded-full bg-black text-white text-sm"
          >
            Retry Payment
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="px-6 py-3 rounded-full border border-black text-sm"
          >
            Go to Cart
          </button>
        </div>
 
        <button
          onClick={() => navigate("/orders")}
          className="mt-6 text-sm underline opacity-70"
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderFailed;