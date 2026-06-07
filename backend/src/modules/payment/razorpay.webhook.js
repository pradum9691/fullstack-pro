import crypto from "crypto";
import { Payment } from "./payment.model.js";
import { Product } from "../product/product.model.js";

export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (signature && secret) {
      const rawBody = req.rawBody || JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        console.log(" Invalid signature");
     
        console.log(" Running in test mode - skipping signature check");
      } else {
        console.log(" Signature VERIFIED ");
      }
    } else {
      console.log(" No signature provided - test mode");
    }

    const event = req.body.event;
    console.log(" Event:", event);

    if (event === "payment.captured") {
      const paymentEntity = req.body.payload.payment.entity;
      console.log(" Payment ID:", paymentEntity.id, "Order ID:", paymentEntity.order_id);

      const payment = await Payment.findOne({
        gatewayOrderId: paymentEntity.order_id,
        gateway: "RAZORPAY",
      }).populate("order");

      console.log(" Payment found:", payment?._id, "Status:", payment?.status);

      if (!payment) {
        console.log(" Payment not found");
        return res.json({ ok: true });
      }

      if (payment.status === "SUCCESS") {
        console.log(" Already processed");
        return res.json({ ok: true });
      }

       
      payment.status = "SUCCESS";
      payment.gatewayPaymentId = paymentEntity.id;
      await payment.save();
      console.log(" Payment updated to SUCCESS");

      const order = payment.order;

  
      if (order && order.status === "PENDING_PAYMENT") {
        order.status = "PAID";
        await order.save();
        console.log(" ORDER --> PAID ");

        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }
        console.log(" Stock deducted");
      }
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(" Webhook error:", err.message);
    res.json({ ok: true });
  }
};
