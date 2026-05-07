import mongoose from "mongoose";

import siteContentDefaults from "../lib/siteContentDefaults.js";

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: siteContentDefaults.key },
    data: { type: mongoose.Schema.Types.Mixed, default: siteContentDefaults },
  },
  { timestamps: true }
);

export default mongoose.model("SiteContent", siteContentSchema);