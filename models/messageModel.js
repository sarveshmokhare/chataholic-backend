const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content: { type: String, trim: true },
        room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    },
    {
        timestamps: true,
    }
)

const Message = new mongoose.model("Message", MessageSchema);

module.exports = Message;