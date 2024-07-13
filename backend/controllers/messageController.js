import Chat from "../models/chatModel.js";
import Message from "../models/MessagesModel.js";


// sendMessage
export const sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        const senderId = req.user._id;

        if (!receiverId) {
            return res.status(404).json({
                success: false,
                message: "Please give Receiver Id!",
            });
        }


        let chat = await Chat.findOne({
            users: {
                $all: [senderId, receiverId],
            }
        });

        if (!chat) {
            chat = new Chat({
                users: [senderId, receiverId],
                latestMessage: {
                    text: message,
                    sender: senderId,
                },
            });

            await chat.save();
        }

        const newMessage = await Message.create({
            chatId: chat._id,
            sender: senderId,
            text: message,
        });

        await newMessage.save();

        await chat.updateOne({
            latestMessage: {
                text: message,
                sender: senderId,
            }
        });


        return res.status(201).json({
            success: true,
            message: "Message Sent Successfull!",
            newMessage,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in sendMessage API",
        });
    }
}

// getAllMessages
export const getAllMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;


        const chat = await Chat.findOne({
            users: {
                $all: [userId, id],
            }
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "No Chat with these Users!",
            });
        }

        const messages = await Message.find({ chatId: chat._id });

        return res.status(200).json({
            success: true,
            message: "Fetchhed All Chats Successfully!",
            messages,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in getAllMessages API",
        });
    }
}

// getAllChats
export const getAllChats = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const chats = await Chat.find({ users: loggedInUser }).populate({
            path: "users",
            select: "name profilePic",
        });

        chats.forEach((chat) => {
            chat.users = chat.users.filter((user) => user._id.toString() !== loggedInUser.toString());
        });

        return res.status(200).json({
            success: true,
            message: "Fetched All Chats Successfully",
            chats,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in getAllChats API",
        });
    }
}