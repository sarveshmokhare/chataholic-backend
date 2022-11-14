const express = require('express');
const mongoose = require("mongoose");
const multer = require('multer');

const User = require("../models/userModel");

const router = express.Router();

const upload = multer();
//add user in the database from signup page
router.post("/add", upload.single("avatar"), async (req, res, next) => {
    // console.log(req.body);
    // console.log(req.file);
    let { name, email, password, avatar } = await req.body;

    const count = await User.count({ email: email });
    // console.log(name, email, password, confirmedPassword);
    if (!name || !email || !password) {
        res.status(400);
        res.send("Some fields are missing");
        next("Some fields are missing");
    }
    else if (count === 1) {
        res.status(400);
        res.send("User already exists");
        next("User already exists");
    }
    else {
        res.status(201);
        if (avatar === "") avatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";
        const newUser = new User({
            name: name,
            email: email,
            password: password,
            avatar: avatar,
        });

        newUser.save((err, res, next) => {
            if (!err) {
                console.log("Successfully added the user");
            }

            else {
                next(err);
                console.log("Error: ", err);
            }
        })

        res.send("Successfully added the user");
    }
});

// authenticate user from the login page
router.post("/auth", async (req, res, next) => {
    const { email, password } = await req.body;
    // console.log("from above", email, password);
    User.findOne({ email: email }, (err, foundUser) => {
        if (!err) {
            // console.log("from if", foundUser);
            if (foundUser === null) {
                res.status(404);
                next("User not found");
                // console.log("User not found");
            }

            else if (foundUser.password !== password) {
                res.status(400);
                next("Incorrect password");
                // console.log("Incorrect password");
            }

            else {
                res.status(201);
                // res.send("Login successful");
                res.json({
                    email: foundUser.email,
                })
                console.log("Login successful");
            }
        } else {
            console.log("from else", err);
            next(err);
        }
    })
});

router.get("/getUserData/:uEmail", (req, res) => {
    const userEmail = req.params.uEmail;
    // console.log(userEmail);
    if (!userEmail) {
        res.status(400);
        throw new Error("userEmail not received");
    }

    User.findOne({ email: userEmail }, (err, foundUser) => {
        if (err) {
            throw new Error("Error occured while finding the user in database" + err);
        }

        else if(foundUser){
            // console.log(foundUser);
            const objectToBeSent = {
                _id: foundUser._id,
                email: foundUser.email,
                name: foundUser.name,
                avatar: foundUser.avatar,
            }
            // console.log(objectToBeSent);
            // res.send(objectToBeSent);
            res.send(objectToBeSent);
            console.log("Successfully sent user data");
        }
        else{
            console.log("user not found");
            res.status(400);
            res.send("Requested user not found");
        }
    });
});
router.get("/getUserData/byID/:uID", (req, res) => {
    const userID = req.params.uID;
    // console.log(userID);
    if (!userID) {
        res.status(400);
        throw new Error("userID not received");
    }

    User.findOne({ _id: userID }, (err, foundUser) => {
        if (err) {
            throw new Error("Error occured while finding the user in database" + err);
        }

        else if(foundUser){
            // console.log(foundUser);
            const objectToBeSent = {
                _id: foundUser._id,
                email: foundUser.email,
                name: foundUser.name,
                avatar: foundUser.avatar,
            }
            // console.log(objectToBeSent);
            // res.send(objectToBeSent);
            res.send(objectToBeSent);
            console.log("Successfully sent user data");
        }
        else{
            console.log("user not found");
            res.status(400);
            res.send("Requested user not found");
        }
    });
});

module.exports = router;