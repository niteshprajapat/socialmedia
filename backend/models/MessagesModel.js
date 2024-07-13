import mongoose from "mongoose";


const messagesSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    text: {
        type: String,
    },


}, { timestamps: true });

const Message = mongoose.model("Message", messagesSchema);
export default Message;