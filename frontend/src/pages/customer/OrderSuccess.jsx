import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <div className="pt-32 pb-24 flex flex-col items-center text-center px-6">

        <h1 className="text-3xl font-semibold">
          Order Placed Successfully
        </h1>

        <p className="mt-3 text-sm opacity-70">
          Your order has been placed and is being processed.
        </p>

        <p className="mt-4 text-sm">
          <span className="opacity-60">Order ID:</span>{" "}
          <span className="font-medium">{id}</span>
        </p>

        <div className="mt-10 flex gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-3 text-sm rounded-md bg-black text-white"
          >
            View Orders
          </button>

          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 text-sm rounded-md border border-black"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;