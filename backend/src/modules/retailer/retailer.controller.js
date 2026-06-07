 import { applyForRetailer } from "./retailer.service.js";
import { applyRetailerSchema } from "./retailer.validation.js";

export const applyRetailer = async (req, res) => {
  try {
    const { error, value } = applyRetailerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const retailer = await applyForRetailer(req.user._id, value);
    res.status(201).json({
      success: true,
      message: "Retailer request submitted, pending admin approval",
      data: retailer,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
