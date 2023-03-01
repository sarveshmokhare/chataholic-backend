const express = require('express');

const Room = require("../models/roomModel");
const authenticateUserToken = require("../helpers/authenticateToken");

const router = express.Router();

// get data of a particular room from its room id
router.post("/", authenticateUserToken, (req, res) => {
    const roomID = req.body.roomID;

    if (!roomID) return res.json({ success: false, message: 'Room ID is missing.' })

    Room.findOne({ _id: roomID }, (err, foundRoom) => {
        if (err) {
            console.log("Error occured while finding the room in the database.:" + err);

            return res.json({ success: false, message: "Error occured while finding the room data in the database.", error: err })
        }

        console.log("Successfully sent the requested room:", foundRoom);
        res.json({ success: true, message: "Successfully sent the requested room", data: foundRoom })

    }).populate("users", "-password");
})

// to get all the rooms a user is currently in
router.get("/users", authenticateUserToken, (req, res) => {
    console.log("/api/room/users");
    const userID = req.user.id;

    //when uID is not received, it is there but as a string with value undefined, that's why !userID doesn''t work. Thus used following:
    // if (userID === "undefined") {
    //     res.status(400);
    //     // console.log("entered here");
    //     throw new Error("userID not received");
    // }
    // { "$push": { users: userID } }

    Room.find({ users: { "$in": [userID] } }, (err, foundRooms) => {
        if (err) {
            return res.json({ success: false, message: "Error occured in finding rooms", error: err })
        }

        res.json({ success: true, data: foundRooms })

        console.log("Successfully sent rooms", foundRooms, "to the user:", req.user.email);
    });
});

// to create new room
router.post("/create", authenticateUserToken, async (req, res) => {
    console.log("/api/room/create");
    const userID = req.user.id;
    const { roomName } = req.body;

    if (!roomName) return res.json({ success: false, message: 'Room Name is missing.' })

    let roomCode = Math.floor(1000 + Math.random() * 9000);
    try {
        const roomAlreadyExists = await Room.count({ roomCode });
        if (roomAlreadyExists === 1) {
            roomCode = Math.floor(1000 + Math.random() * 9000);
        }
    } catch (err) {
        res.json({ success: false, message: "Error generating new room.", error: err })
        console.log("Error generating new room code. Error:", err);
    }

    const newRoom = new Room({
        roomName: roomName,
        roomCode: roomCode,
        users: [userID]
    });
    newRoom.save((err, result) => {
        if (err) {
            console.log("Error occured while saving the room into database:" + err);

            return res.json({ success: false, message: "Error occured while saving the room into database", error: err })
        }

        console.log("room created:", userID, roomName, roomCode);
        res.json({ success: true, message: "Room created successfully", data: result })
        console.log(result);
    });

    // const finalRoom = Room.findOne({ roomId: newRoom._id }).populate("users", "-password");
});

router.put("/addUser", authenticateUserToken, async (req, res, next) => {
    console.log("/api/room/addUser");
    const userID = req.user.id;
    const { roomCode } = req.body;
    console.log(roomCode);
    if (!roomCode) return res.json({ success: false, message: 'Room Code is missing.' })

    try {
        const foundRoom = await Room.findOne({ roomCode });
        console.log(foundRoom);
        let userPresent = false;
        foundRoom.users.forEach(user => {
            if (user.toString() === userID) {
                userPresent = true;

                return res.json({ success: false, message: "User is already in the chat room." })
            }
        });

        if (!userPresent) {
            await Room.updateOne({ roomCode }, { "$push": { users: userID } });

            const finalRoom = await Room.findOne({ roomCode }).populate("users", "-password");

            res.json({ success: true, message: "Successfully added the user to the room", data: finalRoom })

            console.log("user", userID, "added to the room", roomCode);
        }
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: "Internal server error." })
    }
})

router.put("/removeUser", authenticateUserToken, async (req, res, next) => {
    console.log("/api/room/removeUser");

    const { roomCode } = req.body;
    const userID = req.user.id;

    if (!roomCode) return res.json({ success: false, message: 'Room Code is missing.' })

    try {
        await Room.updateOne({ roomCode }, { "$pull": { users: userID } });

        res.json({ success: true, message: "Successfully removed the user" });

        console.log("user", userID, "removed from room with code", roomCode);
    } catch (err) {
        next(err);
        console.log(err);
        res.json({ success: false, message: "Internal server error" })
    }

});

// to get users in a particular room
router.post("/users/room", authenticateUserToken, (req, res) => {
    console.log("/api/room/users/room");
    const { roomCode } = req.body;

    if (!roomCode) return res.json({ success: false, message: 'Room Code is missing.' })

    Room.findOne({ roomCode }, (err, foundRoom) => {
        if (err) {
            console.log(("Error occured in finding the room with received room code:" + err));

            return res.json({ success: false, message: "Error occured in finding the room with received room code", error: err })
        }

        res.json({ success: true, data: foundRoom.users })
        console.log("successfully sent all the users");

    }).populate("users", "-password");
});

module.exports = router;