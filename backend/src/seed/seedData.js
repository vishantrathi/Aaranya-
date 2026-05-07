import dotenv from "dotenv";
import mongoose from "mongoose";

import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";
import BlogPost from "../models/BlogPost.js";
import SiteContent from "../models/SiteContent.js";
import User from "../models/User.js";
import siteContentDefaults from "../lib/siteContentDefaults.js";
import blogPosts from "./blogPosts.js";
import products from "./products.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await BlogPost.deleteMany();
    await SiteContent.deleteMany();
    await User.deleteMany();

    const admin = await User.create({
      name: "Farm Admin",
      email: "admin@farm.com",
      password: "Admin@1234",
      phone: "9999999999",
      address: "Meerut, Uttar Pradesh",
      role: "admin",
    });

    await Product.insertMany(products);
    await BlogPost.insertMany(blogPosts);
    await SiteContent.create({ key: siteContentDefaults.key, data: siteContentDefaults });

    console.log("Seeded successfully");
    console.log(`Admin login: ${admin.email} / Admin@1234`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
