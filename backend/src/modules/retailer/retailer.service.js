  import { Retailer } from "./retailer.model.js";
  import { User } from "../../models/user.model.js";

  export const applyForRetailer = async (userId, data) => {
    const user = await User.findById(userId);
    if (!user || user.role !== "CUSTOMER") {
      throw new Error("Only active customers can apply as retailer");
    }
    const existing = await Retailer.findOne({ user: userId });
    if (existing) {
      throw new Error("Retailer request already submitted");
    }
    const gstExists = await Retailer.findOne({ gstNumber: data.gstNumber });
    if (gstExists) {
      throw new Error("GST number already registered");
    }
    const retailer = await Retailer.create({
      user: userId,
      ...data,
    });

    return retailer;
  };
