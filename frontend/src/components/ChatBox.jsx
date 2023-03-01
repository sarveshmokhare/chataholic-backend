import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import { Modal } from '@mui/material';

import "./chatBox.css"
import { sendMessageRoute, removeUserFromRoomRoute, getUsersInRoomRoute } from '../helpers/routes';
import SnackContext from '../contexts/SnackContext';
import BackdropContext from '../contexts/BackdropContext';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function ChatBox({ socket, roomID, userData, messages, setMessages, roomData, setRoomData, rooms, setRooms, userID }) {
  const snackContext = useContext(SnackContext);
  const backdropContext = useContext(BackdropContext);
  // console.log(messages);
  useEffect(() => {
    // console.log("entered here");
    socket.on("newMsg", async (newMsgData) => {
      backdropContext.turnBackdropOn();

      console.log(newMsgData);
      try {
        const msg = {
          content: newMsgData.content,
          room: newMsgData.roomID,
          sender: newMsgData.userData,
        }

        await setMessages([...messages, msg]);

        backdropContext.turnBackdropOff();
      } catch (err) {
        console.log(err);
        snackContext.newSnack(true, "error", "Network Error")
        backdropContext.turnBackdropOff();
      }
    })

    const chatWindow = document.getElementById("parent-chatbox");
    chatWindow.scrollTop = chatWindow.scrollHeight;
  })

  // console.log(messages);

  const userEmail = localStorage.getItem("userEmail");
  // console.log(userEmail);
  // const userMessages = document.getElementsByClassName("msg-content");
  // console.log(userMessages);

  const [message, setMessage] = useState("");
  function submitMsgHandler(e) {
    e.preventDefault();
    backdropContext.turnBackdropOn();

    // const dataToBeSend = {
    //   content: message,
    //   roomID
    // }
    // console.log(dataToBeSend.roomID);
    // console.log(dataToBeSend);

    axios
      .post(sendMessageRoute, {
        content: message,
        roomID
      },
        {
          headers: { Authorization: `BEARER ${localStorage.getItem('accessToken')}` }
        })
      .then(res => {
        if (res.data.success) {
          setMessage("");

          // console.log(userData);
          const msgToBeAppendedInMessagesArray = {
            content: message,
            room: roomID,
            sender: userData,
          }
          setMessages([...messages, msgToBeAppendedInMessagesArray]);
          // console.log([...messages, dataToBeSend]);

          socket.emit("newMessage", {
            content: message,
            roomID,
            userData
          });

          backdropContext.turnBackdropOff();
        }
        else {
          snackContext.newSnack(true, "error", res.data.message)
          backdropContext.turnBackdropOff();
        }
        // console.log(res);
      })
      .catch(err => {
        console.log(err);
        snackContext.newSnack(true, "error", "Network Error.")
        backdropContext.turnBackdropOff();
      })
  }
  // console.log(props);
  // console.log(message);

  function leaveRoomHandler() {
    backdropContext.turnBackdropOn();

    axios
      .put(removeUserFromRoomRoute, { roomCode: roomData.roomCode },
        {
          headers: { Authorization: `BEARER ${localStorage.getItem('accessToken')}` },
        })
      .then(res => {
        if (res.data.success) {
          setRooms(() => {
            return rooms.filter(room => {
              return room.roomCode !== roomData.roomCode;
            })
          })
          setMessages([]);
          setRoomData();

          backdropContext.turnBackdropOff();
        }
        else {
          snackContext.newSnack(true, "error", res.data.message)
          backdropContext.turnBackdropOff();
        }
      })
      .catch(err => {
        console.log(err);
        snackContext.newSnack(true, "error", "Network Error")
        backdropContext.turnBackdropOff();
      })
  }

  const [members, setMembers] = useState();
  function viewMembersHandler() {
    backdropContext.turnBackdropOn();

    axios
      .post(getUsersInRoomRoute, { roomCode: roomData.roomCode },
        {
          headers: { Authorization: `BEARER ${localStorage.getItem('accessToken')}` },
        })
      .then(res => {
        if (res.data.success) {
          setMembers(res.data.data);

          backdropContext.turnBackdropOff();
        }
        else {
          snackContext.newSnack(true, "error", res.data.message)
          backdropContext.turnBackdropOff();
        }
      })
      .catch(err => {
        console.log(err);
        snackContext.newSnack(true, "error", "Network Error")
        backdropContext.turnBackdropOff();
      })

    handleOpen();
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // console.log(roomData);
  return (
    <div id='parent-chatbox'>

      <div className="chat-box" >
        {roomData && <div className='chatbox-header' >
          <h3>{capitalizeFirstLetter(roomData.roomName)}</h3>
          <div className='buttons-container'>
            <button className='chat-box-buttons' style={{ color: "#00c2b8" }} onClick={viewMembersHandler} type="button" >Members</button>
            <button className='chat-box-buttons' style={{ color: "#e61a23" }} onClick={leaveRoomHandler} type="button" >Leave Room</button>
          </div>
        </div>}

        {messages && messages.map((msg, ind) => {
          // console.log(msg.sender.email);
          return (
            <div style={{ display: "flex", textAlign: (userEmail === msg.sender.email) ? "right" : "left", flexDirection: (userEmail === msg.sender.email) ? "row-reverse" : "row" }} key={ind} >
              {userEmail === msg.sender.email ? null : <div className='img-holder'><img alt="avatar" src={msg.sender.avatar} /></div>}
              <div className='msg-box' >
                {userEmail === msg.sender.email ? null : <h4>{capitalizeFirstLetter(msg.sender.name)}:</h4>}
                <p>{msg.content}</p>
              </div>
            </div>
          )
        })}

      </div>
      {roomData && <form onSubmit={submitMsgHandler} autoComplete='off'>
        <input
          placeholder="Message"
          name='message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        >
        </input>
        <button type="submit"><SendIcon /></button>
      </form>}

      {/* View chat room members modal code */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className='view-room-members-modal'>
          <h1>Members</h1>
          {members && members.map((member, ind) => {
            return (
              <div className='member' key={ind}>
                <div className='member-img-holder'><img alt="avatar" src={member.avatar} /></div>
                <p style={{ fontSize: "20px" }}>{member.name}</p>
                <p>{member.email}</p>
              </div>
            )
          })}
        </div>
      </Modal>
    </div>
  )
}

export default ChatBox