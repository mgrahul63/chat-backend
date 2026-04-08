import MessageModel from "../models/message-model.js";

export const getLastMessage = async (friends, userId) => {
  const summary = await Promise.all(
    friends.map(async (friend) => {
      const lastMessageDoc = await MessageModel.findOne({
        $or: [
          { senderId: friend._id, receiverId: userId },
          { senderId: userId, receiverId: friend._id },
        ],
      })
        .sort({ createdAt: -1 })
        .select("text image senderId seen")
        .lean();

      let lastMessage = null;

      if (lastMessageDoc?.text) {
        lastMessage = lastMessageDoc.text;
      } else if (lastMessageDoc?.image) {
        lastMessage = "sent a photo";
      }

      return {
        lastMessage,
        friendId: friend._id,
        lastMessageSenderId: lastMessageDoc?.senderId || null,
      };
    }),
  );

  return summary;
};
