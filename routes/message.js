const express = require('express');

const Message = require("../models/messageModel");
const authenticateUserToken = require("../helpers/authenticateToken");

const router = express.Router();

router.post("/send", authenticateUserToken, (req, res) => {
    console.log("/api/message/send");
    const { content, roomID } = req.body;
    const userId = req.user.id;

    if (!content) return res.json({ success: false, message: 'Message content is missing.' })
    if (!roomID) return res.json({ success: false, message: 'Room ID is missing.' })

    const newMessage = new Message({
        sender: userId,
        content: content,
        room: roomID,
    });

    newMessage.save((err, result) => {
        if (err) {
            console.log("Error occured while saving the message into database:" + err);

            return res.json({ success: false, message: "Error occured while saving the message into database", error: err })
        }
        res.json({ success: true, message: "Successfully saved the message" })

        console.log("Message saved");
    });
});

// get all messages in a particular room
// update in a sorted manner by time
router.post("/room", authenticateUserToken, async (req, res) => {
    console.log("/api/message/room");
    const { roomID } = req.body;

    if (!roomID) return res.json({ success: false, message: 'Room ID is missing.' })

    Message.find({ room: roomID }, (err, foundMsgs) => {
        if (err) {
            console.log("Error occured while finding the messages in database:" + err);

            return res.json({ success: false, message: "Error occured while finding the messages in the database", error: err })
        }

        res.json({ success: true, data: foundMsgs })
        console.log("successfully sent all messages");

    }).populate("sender");
});

module.exports = router;