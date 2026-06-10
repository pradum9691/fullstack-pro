import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

import { User } from "./models/user.model.js";

async function setupUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    // 1. Create or Update ADMIN user
    const adminEmail = "admin@test.com";
    const adminPassword = "admin123";
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    let adminUser = await User.findOne({ email: adminEmail });
    if (adminUser) {
      adminUser.password = hashedAdminPassword;
      adminUser.role = "ADMIN";
      adminUser.name = "Test Admin";
      await adminUser.save();
      console.log(`Updated existing user to ADMIN: ${adminEmail}`);
    } else {
      adminUser = await User.create({
        name: "Test Admin",
        email: adminEmail,
        password: hashedAdminPassword,
        role: "ADMIN",
      });
      console.log(`Created new ADMIN user: ${adminEmail}`);
    }

    // 2. Create or Update RETAILER user
    const retailerEmail = "retailer@test.com";
    const retailerPassword = "retailer123";
    const hashedRetailerPassword = await bcrypt.hash(retailerPassword, 10);

    let retailerUser = await User.findOne({ email: retailerEmail });
    if (retailerUser) {
      retailerUser.password = hashedRetailerPassword;
      retailerUser.role = "RETAILER";
      retailerUser.name = "Test Retailer";
      await retailerUser.save();
      console.log(`Updated existing user to RETAILER: ${retailerEmail}`);
    } else {
      retailerUser = await User.create({
        name: "Test Retailer",
        email: retailerEmail,
        password: hashedRetailerPassword,
        role: "RETAILER",
      });
      console.log(`Created new RETAILER user: ${retailerEmail}`);
    }

    console.log("\n=================================");
    console.log("Accounts ready for testing:");
    console.log(`ADMIN    -> Email: ${adminEmail} | Password: ${adminPassword}`);
    console.log(`RETAILER -> Email: ${retailerEmail} | Password: ${retailerPassword}`);
    console.log("=================================");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error setting up test users:", error);
    process.exit(1);
  }
}

setupUsers();
