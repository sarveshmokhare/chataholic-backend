const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
    {
        roomName: { type: String, trim: true },
        roomCode: { type: Number, trim: true },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    },
    {
        timestamps: true,
    }
);

const Room = new mongoose.model("Room", RoomSchema);

module.exports = Room;