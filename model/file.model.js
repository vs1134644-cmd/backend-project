const { Schema, model, mongoose } = require("mongoose");

const fileSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    filename: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    path: String,
    type: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const FileModel = model("File", fileSchema);

module.exports = FileModel;
