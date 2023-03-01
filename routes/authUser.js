const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require("../models/userModel");

const router = express.Router();

const upload = multer();

//add user in the database from signup page
router.post("/signup", upload.single("avatar"), async (req, res, next) => {
    console.log("/api/auth/signup");
    let { name, email, password, avatar } = await req.body;

    const count = await User.count({ email: email });

    if (!req.body.name) return res.json({ success: false, message: 'Name is missing.' })
    if (!req.body.email) return res.json({ success: false, message: 'Email is missing.' })
    if (!req.body.password) return res.json({ success: false, message: 'Password is missing.' })

    if (count === 1) {
        return res.json({ success: false, message: 'User already exists.' })
    }

    try {
        if (avatar === "") avatar = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            avatar: avatar,
        });

        newUser.save((err, result) => {
            if (err) {
                res.json({
                    message: 'Error signing in the user. User may already exist.',
                    error: err,
                    success: false
                })
                console.log('Error adding the user in the database: ' + err);
                return;
            }

            res.json({
                success: true,
                message: 'Created the user.',
                data: result
            })
            console.log('Created the user with email:', req.body.email);
        })
    }
    catch (err) {
        res.json({ message: 'Error signing in the user', error: err, success: false })
        console.log('Error signing in the user: ', err);
    }

});

function createAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '6h' })
}

// authenticate user from the login page
router.post("/login", async (req, res) => {
    console.log("/api/auth/login");

    const { email, password } = await req.body;

    User.findOne({ email: email }, async (err, foundUser) => {
        if (err) {
            res.json({
                message: 'Error searching user in the db',
                error: err,
                success: false
            })
            
            console.log('Error searching user in the db: ' + err);
            return;
        } 
        else if(foundUser === null){
            res.json({
                message: 'User not found',
                error: err,
                success: false
            })
            console.log('User not found');
            return;
        }
        try{
            if (await bcrypt.compare(password, foundUser.password)) {
                const user = { email: foundUser.email, id: foundUser._id }
                const accessToken = createAccessToken(user)
                res.json({
                    success: true,
                    message: 'Successfully logged in',
                    accessToken,
                })
                console.log('Successfully logged in the user: ', foundUser.email, ' with accessToken: ', accessToken);
            }
            else {
                res.json({
                    success: false,
                    message: 'Incorrect password.'
                })

                console.log("Incorrect password for email:", email);
            }
        }
        catch{
            res.json({success: false, message: 'Server error.'})
        }
    })
});

module.exports = router;