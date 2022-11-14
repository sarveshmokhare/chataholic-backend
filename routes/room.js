const express = require('express');

const Room = require("../models/roomModel");

const router = express.Router();

router.get("/getRoomData/:rID", (req,res)=>{
    const roomID = req.params.rID;

    if (roomID === "undefined") {
        res.status(400);
        // console.log("entered here");
        throw new Error("roomID not received");
    }

    Room.findOne({_id: roomID}, (err, foundRoom)=>{
        if(err){
            throw new Error("Error occured while finding the room in the database.")
        }

        else{
            res.send(foundRoom);
            console.log("Successfully sent the requested room");
        }
    }).populate("users", "-password");
})

// to get all the rooms a user is currently in
router.get("/users/:uID", (req, res) => {
    const userID = req.params.uID;
    // console.log("(backend) userID: ", userID);

    //when uID is not received, it is there but as a string with value undefined, that's why !userID doesn''t work. Thus used following:
    if (userID === "undefined") {
        res.status(400);
        // console.log("entered here");
        throw new Error("userID not received");
    }
    // { "$push": { users: userID } }
    Room.find({ users: { "$in": [userID] } }, (err, foundRooms)=>{
        if(err){
            throw new Error("Error occured in finding rooms with given userID: " + err);
        }

        else{
            res.send(foundRooms);
            console.log("Successfully sent rooms");
        }
    });
});

// to create new room
router.post("/create", async (req, res, next) => {
    const { userID, roomName, roomCode } = req.body;

    if (!userID) {
        res.status(400);
        next("userId not received");
        return;
    }
    if (!roomName) {
        res.status(400);
        next("roomName not received");
        return;
    }

    const newRoom = new Room({
        roomName: roomName,
        roomCode: roomCode,
        users: [userID]
    });
    newRoom.save((err, result) => {
        if (err) {
            next("Error occured while saving the message into database:" + err);
        }
        else {
            console.log("room created");
            res.send(result);
        }
    });

    // const finalRoom = Room.findOne({ roomId: newRoom._id }).populate("users", "-password");

    console.log(userID, roomName, roomCode);
});

router.put("/addUser", async (req, res, next) => {
    const { userID, roomCode } = req.body;
    if (!userID) {
        res.status(400);
        next("userId not received");
        res.send("userId not received");
        return;
    }
    if (!roomCode) {
        res.status(400);
        next("roomCode not received");
        res.send("roomCode not received");
        return;
    }

    try {
        const foundRoom = await Room.findOne({ roomCode });
        let userPresent = false;
        foundRoom.users.forEach(user => {
            if (user.toString() === userID) {
                userPresent = true;
                res.status(400);
                next("User is already in the chat room.");
                return false;
            }
        });

        if (!userPresent) {
            await Room.updateOne({ roomCode }, { "$push": { users: userID } });
            console.log("user added");
            const finalRoom = await Room.findOne({roomCode}).populate("users", "-password");
            res.send(finalRoom);
        }
    } catch (err) {
        res.status(400);
        next("Room with received roomCode doesn't exist.");
        console.log(err);
    }

})

router.put("/removeUser", async (req, res, next) => {
    const { userID, roomCode } = req.body;
    if (!userID) {
        res.status(400);
        next("userId not received");
        res.send("userId not received");
        return;
    }
    if (!roomCode) {
        res.status(400);
        next("roomCode not received");
        res.send("roomCode not received");
        return;
    }

    try {
        await Room.updateOne({ roomCode }, { "$pull": { users: userID } });

        console.log("user removed");
        res.send("Successfully removed the user");
    } catch (err) {
        next(err);
        console.log(err);
    }

});

// to get users in a particular room
router.get("/users/room/:rCode", (req, res) => {
    const roomCode = req.params.rCode;
    // console.log(roomCode);
    if (!roomCode) {
        res.status(400);
        throw new Error("roomCode not received");
    }

    Room.findOne({ roomCode }, (err, foundRoom) => {
        if (err) {
            throw new Error("Error occured in finding the room with received room code:" + err)
        }

        else {
            res.send(foundRoom.users);
            console.log("successfully sent all the users");
        }
    }).populate("users", "-password");
});

module.exports = router;