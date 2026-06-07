import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import {toast} from 'react-toastify'

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const loadAddresses = async () => {
    try {
      const res = await api.get("/addresses");
      setAddresses(res.data.data || []);
      toast.success("Address saved");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const addAddress = async (e) => {
    e.preventDefault();
    await api.post("/addresses", form);
    setForm({
      name: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
    });
    loadAddresses();
    toast.success("Address added");
    useNavigate("/checkout")
  };

  const deleteAddress = async (id) => {
    await api.delete(`/addresses/${id}`);
    toast.success("Address deleted");
    loadAddresses();
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-3xl mx-auto pt-28 px-6 pb-20">
        <h1 className="text-2xl font-semibold mb-6">My Addresses</h1>
 
        <form
          onSubmit={addAddress}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
        >
          {Object.keys(form).map((key) => (
            <input
              key={key}
              required
              placeholder={key}
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
              className="border px-4 py-3 rounded-lg"
            />
          ))}

          <button
            type="submit"
            className="md:col-span-2 bg-black text-white py-3 rounded-lg"
          >
            Add Address
          </button>
        </form>
 
        {loading ? (
          <p>Loading...</p>
        ) : addresses.length === 0 ? (
          <p className="text-sm opacity-60">
            No address added yet.
          </p>
        ) : (
          <div className="space-y-4">
            {addresses.map((a) => (
              <div
                key={a._id}
                className="border p-4 rounded-xl flex justify-between"
              >
                <div className="text-sm">
                  <p className="font-medium">{a.name}</p>
                  <p>{a.addressLine}</p>
                  <p>
                    {a.city}, {a.state} - {a.pincode}
                  </p>
                  <p>{a.phone}</p>
                </div>

                <button
                  onClick={() => deleteAddress(a._id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-10 underline text-sm"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Addresses;