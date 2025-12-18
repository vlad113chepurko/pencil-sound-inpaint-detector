const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    url: { type: String, required: true },
    label: {
      type: String,
      enum: ["pencil", "not_pencil", null],
      default: null,
    },
    embedding: { type: [Number], index: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Image", ImageSchema);
