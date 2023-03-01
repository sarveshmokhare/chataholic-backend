import React, { useState, useContext } from 'react'
import axios from 'axios';
import { Modal } from '@mui/material';

import "./chatRooms.css"
import { createRoomRoute, addUserToRoomRoute } from '../helpers/routes';
import SnackContext from '../contexts/SnackContext';
import BackdropContext from '../contexts/BackdropContext';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function ChatRooms({ socket, rooms, setRooms, getClickedRoomID }) {

  const snackContext = useContext(SnackContext);
  const backdropContext = useContext(BackdropContext);

  function chatRoomHandler(roomID) {
    // console.log(roomID);
    getClickedRoomID(roomID);
    // props.setRoomSelected(true);
    if (window.innerWidth <= 500) {
      document.querySelector(".chatrooms-box").style.display = "none";
      document.getElementById("parent-chatbox").style.display = "flex";
    }

    socket.emit("joinRoom", roomID);
  }

  const [createRoomModalState, setCreateRoomModalState] = React.useState(false);
  const openCreateRoomModal = () => setCreateRoomModalState(true);
  const closeCreateRoomModal = () => setCreateRoomModalState(false);

  const [joinRoomModalState, setJoinRoomModalState] = React.useState(false);
  const openJoinRoomModal = () => setJoinRoomModalState(true);
  const closeJoinRoomModal = () => setJoinRoomModalState(false);

  const [roomName, setRoomName] = useState("");

  function createRoomHandler(e) {
    e.preventDefault();
    backdropContext.turnBackdropOn();

    axios
      .post(createRoomRoute, { roomName },
        {
          headers: { 'Authorization': `BEARER ${localStorage.getItem('accessToken')}` },
        })
      .then(res => {
        if (res.data.success) {
          setRooms([...rooms, res.data.data]);

          setRoomName("");
          setCreateRoomModalState(false);
          // setLoading(false);
          backdropContext.turnBackdropOff();
        }
        else {
          snackContext.newSnack(true, "error", res.data.message)
          backdropContext.turnBackdropOff();
        }
      })
      .catch(err => {
        console.log(err);
        setRoomName("");
        // setLoading(false);
        setCreateRoomModalState(false);
        snackContext.newSnack(true, "error", "Network Error")
        backdropContext.turnBackdropOff();
      })

  }

  const [roomCode, setRoomCode] = useState("");
  function joinRoomHandler(e) {
    e.preventDefault();
    // setLoading(true);
    backdropContext.turnBackdropOn();

    axios
      .put(addUserToRoomRoute,
        { roomCode },
        {
          headers: { Authorization: `BEARER ${localStorage.getItem('accessToken')}` },
        })
      .then(res => {
        // console.log(res);
        if (res.data.success) {
          setRooms([...rooms, res.data.data]);
          setRoomCode("");
          setJoinRoomModalState(false);
          // setLoading(false);
          backdropContext.turnBackdropOff();
        }
        else {
          snackContext.newSnack(true, "error", res.data.message)
          backdropContext.turnBackdropOff();
        }
      })
      .catch(err => {
        console.log(err);
        setRoomCode("");
        setJoinRoomModalState(false);
        // snackHandler("error", "Room with entered code doesn't exist.");
        snackContext.newSnack(true, "error", "Network Error")
        // setLoading(false);
        backdropContext.turnBackdropOff();
      })
  }

  return (
    <div className='chatrooms-box' >

      <div>
        <h3>Your Chat Rooms</h3>
        {rooms && rooms.map((room, ind) => {

          return (
            <div className='one-chat' key={room._id} onClick={() => chatRoomHandler(room._id)} >
              <h4>{capitalizeFirstLetter(room.roomName)}</h4>
              <p>Room Code: {room.roomCode}</p>
            </div>
          )
        })}
      </div>

      <div className='buttons'>
        <button onClick={openCreateRoomModal} >Create Chat Room</button>
        <button onClick={openJoinRoomModal} >Join a Chat Room</button>
      </div>

      {/* Create Room Modal */}
      <Modal
        open={createRoomModalState}
        onClose={closeCreateRoomModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className='create-room-modal'>
          <form>
            <input
              placeholder="Room Name"
              name='roomName'
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            >
            </input>

            <button onClick={createRoomHandler} type="submit" >Create the Chat Room</button>
          </form>
        </div>
      </Modal>

      {/* Join room from room code */}
      <Modal
        open={joinRoomModalState}
        onClose={closeJoinRoomModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className='create-room-modal'>
          <form>
            <input
              placeholder="Room Code"
              name='roomCode'
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            >
            </input>

            <button onClick={joinRoomHandler} type="submit" >Join the Chat Room</button>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default ChatRooms