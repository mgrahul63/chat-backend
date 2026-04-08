import { io, userSoketMap } from "../config/socket.js";
import cloudinary from "../lib/loudinary.js";
import MessageModel from "../models/message-model.js";
import UserModel from "../models/user-model.js";
import ArrayObjectById from "../utils/ArrayObjectById.js";
import { countUnseenMesage } from "../utils/countUnseenMessage.js";
import { getLastMessage } from "../utils/getLastMessage.js";

//GET logged in user (in futurs only your friends)
export const getAllUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    // Placeholder for friend filtering in the future
    // const friendIds = [...];

    const friends = await UserModel.find({
      _id: { $ne: userId },
      // _id: { $in: friendIds } // uncomment later
    })
      .select("-password")
      .lean();

    const unseenMessages = await countUnseenMesage(friends, userId);
    const lastMessages = await getLastMessage(friends, userId);

    return res.status(200).json({
      success: true,
      friends: ArrayObjectById(friends),
      unseenMessages,
      lastMessages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GET all message for selected user
export const getMessages = async (req, res) => {
  try {
    const { id: selectUserId } = req.params;
    const myId = req.user._id;

    // Fetch all messages between the two users
    const messages = await MessageModel.find({
      $or: [
        { senderId: selectUserId, receiverId: myId },
        { senderId: myId, receiverId: selectUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    // Mark messages as seen
    await MessageModel.updateMany(
      { senderId: selectUserId, receiverId: myId, seen: false },
      { seen: true },
    );

    res.status(200).json({
      success: true,
      messages: ArrayObjectById(messages),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

//mark message as seen using message id
export const markMessageSeen = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await MessageModel.findByIdAndUpdate(
      id,
      { seen: true },
      { new: true },
    ).lean();

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message marked as seen",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

//send message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl = "";

    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    const newMessage = await MessageModel.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    //Emit the new message to the receiver's socket
    const receiverSocketId = userSoketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// export const getLastMessage = async (req, res) => {
//   try {
//     const friendId = req.params.id;
//     const userId = req.user._id;
//     const messages = await MessageModel.find({
//       $or: [
//         { senderId: friendId, receiverId: userId },
//         { senderId: userId, receiverId: friendId },
//       ],
//     })
//       .sort({ createdAt: -1 })
//       .limit(1)
//       .lean();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: error.message || "Something went wrong",
//     });
//   }
// };
