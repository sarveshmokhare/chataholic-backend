import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from "socket.io-client";

import ChatRooms from '../components/ChatRooms';
import ChatBox from '../components/ChatBox';
import Header from '../components/Header';
import "./ChatPage.css";
import { backendUrl, getRoomDataFromIDRoute, getRoomsForAUserRoute, getAllMessagesInARoomRoute } from '../helpers/routes';
import SnackContext from '../contexts/SnackContext';
import BackdropContext from '../contexts/BackdropContext';

const socket = io(backendUrl);

function ChatPage() {
    const navigate = useNavigate();
    const snackContext = useContext(SnackContext);
    const backdropContext = useContext(BackdropContext);

    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        if (!accessToken) {
            navigate("/not-logged-in");
        }

    }, [navigate, accessToken]);

    // useEffect(() => {

    //     // socket.emit("join", userID);
    // }, [])

    const [rooms, setRooms] = useState([]);

    const [userData, setUserData] = useState();
    const [userID, setUserID] = useState();
    // console.log(userID);
    function getUserData(userData){
        setUserData(userData);
        setUserID(userData._id)
    }
    // console.log(userData);
    useEffect(() => {
        // setLoading(true);
        backdropContext.turnBackdropOn();

        axios
            .get(getRoomsForAUserRoute, {
                headers: { Authorization: `BEARER ${localStorage.getItem('accessToken')}` }
            })
            .then(res => {
                // console.log(res.data);
                if (res.data.success) {
                    setRooms(res.data.data);
                    // setLoading(false);
                    backdropContext.turnBackdropOff();
                }

                else {
                    snackContext.newSnack(true, "error", res.data.message);
                    backdropContext.turnBackdropOff();
                }
            })
            .catch(err => {
                console.log(err);
                snackContext.newSnack(true, "error", "Network Error")
                backdropContext.turnBackdropOff();
            })
        /* eslint-disable */
    }, []);

    const [roomMessages, setRoomMessages] = useState([]);
    const [roomID, setRoomID] = useState();
    const [roomData, setRoomData] = useState();
    // console.log(roomMessages);
    function getClickedRoomID(roomID) {
        backdropContext.turnBackdropOn();
        // console.log("from chat page", roomID);
        // console.log(`BEARER ${localStorage.getItem('accessToken')}`);
        setRoomID(roomID);
        axios
            .post(getAllMessagesInARoomRoute, { roomID },
                {
                    headers: { 'Authorization': `BEARER ${localStorage.getItem('accessToken')}` },
                })
            .then(res => {
                // console.log(res.data);
                if (res.data.success) {
                    setRoomMessages(res.data.data);
                }
                else {
                    snackContext.newSnack(true, "error", res.data.message)
                    return backdropContext.turnBackdropOff();
                }
            })
            .catch(err => {
                console.log(err);
                snackContext.newSnack(true, "error", "Network Error.")
                return backdropContext.turnBackdropOff();
            })

        axios
            .post(getRoomDataFromIDRoute, { roomID },
                {
                    headers: { Authorization: `BEARER ${localStorage.getItem('accessToken')}` }
                })
            .then(res => {
                if (res.data.success) {
                    setRoomData(res.data.data);
                    backdropContext.turnBackdropOff();
                }
                else {
                    snackContext.newSnack(true, "error", res.data.message)
                    backdropContext.turnBackdropOff();
                }
            })
            .catch(err => {
                console.log(err);
                snackContext.newSnack(true, "error", "Network Error.")
                backdropContext.toggleBackdrop();
            })
    }
    // console.log(roomData);

    function getBackBtnHandler() {
        if (window.innerWidth <= 500) {
            document.getElementById("parent-chatbox").style.display = "none";
            document.querySelector(".chatrooms-box").style.display = "flex";
        }
    }

    const [roomSelected, setRoomSelected] = useState(false)
    return (
        <div style={{ width: "100%" }}>

            {accessToken ? () => {
                backdropContext.turnBackdropOn();
                snackContext.newSnack(true, "error", "Login again.")
            } : backdropContext.turnBackdropOff()}

            <Header getUserData={getUserData} />

            {(window.innerWidth <= 500) ? <button className='backtochat-btn' onClick={getBackBtnHandler} >Chat Rooms</button> : null}

            <div
                className='second-container'
            >
                <ChatRooms rooms={rooms} getClickedRoomID={getClickedRoomID} userData={userData} userID={userID} setRooms={setRooms} socket={socket} roomSelected={roomSelected} setRoomSelected={setRoomSelected} />

                <ChatBox messages={roomMessages} roomID={roomID} userData={userData} userID={userID} setMessages={setRoomMessages} socket={socket} roomData={roomData} setRoomData={setRoomData} setRooms={setRooms} rooms={rooms} roomSelected={roomSelected} setRoomSelected={setRoomSelected} />
            </div>


        </div>
    )
}

export default ChatPage