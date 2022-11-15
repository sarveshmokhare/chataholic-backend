const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
// const path = require("path");

const connect = require('./config/connectToDB');
const user = require("./routes/user");
const room = require("./routes/room");
const message = require("./routes/message");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.json());

connect();

app.use("/api/user", user);
app.use("/api/chatRoom", room);
app.use("/api/message", message);

// app.get("/", (req, res)=>{
//     res.send("successfully sent request to port 8000");
// })

//------------------------------ deployment ---------------------------------

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname1, "/frontend/build")));
//     app.get("*", (req, res) =>
//         res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//     );
// } else {
//     app.get("/", (req, res) => {
//         res.send("Request to root route ran successfully.");
//     });
// }

//------------------------------ deployment ---------------------------------

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
});

io.on("connection", socket => {
    console.log("connected to the socket server");
    // console.log(socket);
    // socket.on("join", userData =>{
    //     console.log(userData);
    // })

    // socket.on("joinRoom", roomID=>{
    //     console.log("User joined room: ", roomID);
    // })

    socket.on("joinRoom", roomID => {
        socket.join(roomID);

        console.log("user joined room: ", roomID);
    })

    socket.on("newMessage", msg => {
        console.log(msg);

        socket.to(msg.roomId).emit("newMsg", msg);
    })

    socket.on("disconnect", () => {
        console.log("a user got disconnected");
    })
})
