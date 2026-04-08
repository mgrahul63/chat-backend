// Count unseen messages for each friend
import MessageModel from "../models/message-model.js";

export const countUnseenMesage = async (friends, userId) => {
  const unseenMessages = {};

  await Promise.all(
    friends.map(async (friend) => {
      const count = await MessageModel.countDocuments({
        senderId: friend._id,
        receiverId: userId,
        seen: false,
      });
      if (count > 0) unseenMessages[friend._id] = count;
    })
  );

  return unseenMessages;
};
