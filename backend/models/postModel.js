import mongoose from "mongoose";



const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true,
    },
    post: {
        id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    type: {
        type: String,
        required: true,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            name: {
                type: String,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            }
        }
    ]

}, { timestamps: true });


const Post = mongoose.model("Post", postSchema);
export default Post;