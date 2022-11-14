const express = require('express');

const Message = require("../models/messageModel");

const router = express.Router();

router.post("/send", (req, res) => {
    const { content, roomId, userId } = req.body;

    if(!content || !roomId || !userId){
        throw new Error("One or more fields required missing.");
    }

    const newMessage = new Message({
        sender: userId,
        content: content,
        room: roomId,
    });

    newMessage.save((err, result)=>{
        if(err){
            throw new Error("Error occured while saving the message into database:" + err);
        }
        else{
            console.log("Message saved");
            res.send(result);
        }
    });
});

// get all messages in a particular room
// update in a sorted manner by time
router.get("/:rID", (req, res) => {
    const roomID = req.params.rID;

    if (roomID === "undefined") {
        res.status(400);
        throw new Error("roomID not received");
    }

    Message.find({ room: roomID }, (err, foundMsgs) => {
        if (err) {
            throw new Error("Error occured while finding the message in database" + err);
        }

        else {
            res.send(foundMsgs);
            console.log("successfully sent all messages");
        }
    }).populate("sender");
});

module.exports = router;