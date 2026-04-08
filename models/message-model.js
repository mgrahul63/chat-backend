import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    // Optional fields
    text: {
      type: String,
      trim: true,
    },


    //here a simple issue, how store multiple image or file? pore fix korbo
    image: {
      type: String,
      trim: true,
      default: "",
    },

    messageType: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },

    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Speed boost for large chat apps
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

const MessageModel =
  mongoose.models.messages || mongoose.model("messages", messageSchema);

export default MessageModel;
