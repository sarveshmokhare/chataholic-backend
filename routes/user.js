const express = require('express');

const User = require("../models/userModel");
const authenticateUserToken = require("../helpers/authenticateToken");

const router = express.Router();

router.get("/", authenticateUserToken, (req, res) => {
    const userEmail = req.user.email;

    User.findOne({ email: userEmail }, (err, foundUser) => {
        if (err) {
            console.log("Error occured while finding the user in database" + err);
            return res.json({ success: false, message: 'Error getting the details.', error: err })
        }

        const objectToBeSent = {
            _id: foundUser._id,
            email: foundUser.email,
            name: foundUser.name,
            avatar: foundUser.avatar,
        }

        res.json({ success: true, data: objectToBeSent });
        console.log('Successfully sent the user data: ', objectToBeSent);
    });
});

module.exports = router;