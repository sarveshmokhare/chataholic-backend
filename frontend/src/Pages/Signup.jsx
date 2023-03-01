import React, { useState, useContext } from 'react'
import { Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { UploadClient } from '@uploadcare/upload-client'

import ChatImg from '../images/chat_app_img.svg';
import "../Pages/HomePage.css";
import { signupRoute } from '../helpers/routes';
import SnackContext from '../contexts/SnackContext';
import BackdropContext from '../contexts/BackdropContext';

const HomePage = () => {
    const navigate = useNavigate();
    const snackContext = useContext(SnackContext);
    const backdropContext = useContext(BackdropContext);

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        confirmedPassword: "",
        avatar: "",
    })

    function userDataHandler(e) {
        const { name, value } = e.target;

        setUserData(prevData => {
            return ({ ...prevData, [name]: value, })
        });
    }

    function imgHandler(e) {
        // console.log(e.target.files[0]);
        backdropContext.turnBackdropOn();
        snackContext.newSnack(true, "warning", "Don't close the browser. Image is being uploaded.");

        const img = e.target.files[0];
        console.log(img);

        if (img === undefined) {
            snackContext.newSnack(true, "error", "Please upload an image.");
            backdropContext.turnBackdropOff();
            return;
        }

        const client = new UploadClient({ publicKey: '26142c26bdf508eb3a05' })
        client
            .uploadFile(img)
            .then(res => {
                console.log(res.cdnUrl);
                setUserData(prevData => {
                    return ({ ...prevData, avatar: res.cdnUrl })
                });
                snackContext.newSnack(true, "info", "Avatar uploaded successfully.");
                backdropContext.turnBackdropOff();
            })
            .catch(err => {
                console.log(err);
                snackContext.newSnack(true, "error", "Try again to upload the photo.")
                backdropContext.turnBackdropOff();
            })
    }
    // console.log(userData);

    function submitHandler(e) {
        e.preventDefault();
        backdropContext.turnBackdropOn();

        if (!userData.name || !userData.email || !userData.password || !userData.confirmedPassword) {
            snackContext.newSnack(true, "warning", "Please enter all the fields!");
            backdropContext.turnBackdropOff();
            return;
        }

        if (userData.password !== userData.confirmedPassword) {
            snackContext.newSnack(true, "warning", "Passwords don't match!");
            backdropContext.turnBackdropOff();
            return;
        }

        // const formData = new FormData();
        // formData.append("name", userData.name);
        // formData.append("email", userData.email);
        // formData.append("password", userData.password);
        // formData.append("avatar", userData.avatar);
        // console.log(formData);
        axios.post(signupRoute, {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            avatar: userData.avatar,
        })
            .then(res => {
                if (res.data.success) {
                    snackContext.newSnack(true, "success", "Registration successful!")

                    backdropContext.turnBackdropOff();
                    navigate("/login");
                }
                else {
                    snackContext.newSnack(true, "error", res.data.message);
                    backdropContext.turnBackdropOff();
                }
            })
            .catch(err => {
                console.log(err);
                backdropContext.turnBackdropOff();

                snackContext.newSnack(true, "error", "Network Error.");
                // snackContext.newSnack(true, "error", "An error occured! Please use different credentials or refresh the page and try again.");
            })
    }

    return (
        <div>
            <Container maxWidth="xl"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    color: "white",
                }}
            >
                <Typography
                    variant='h3'
                    sx={{
                        fontFamily: "'Barlow', sans-serif",
                        fontWeight: "bold",
                        margin: "20px 0 10px 0",
                        cursor: "pointer",
                    }}
                    onClick={() => { navigate("/") }}
                >
                    Chataholic
                </Typography>

                <img alt='chat-img' src={ChatImg}></img>

                <Typography
                    variant='h5'
                >
                    Signup
                </Typography>

                <form onSubmit={submitHandler} method="post" encType="multipart/form-data" >
                    <Container maxWidth="lg"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <input
                            placeholder="Name"
                            name='name'
                            value={userData.name}
                            onChange={userDataHandler}
                        >
                        </input>
                        <input
                            placeholder="Email Address"
                            name='email'
                            value={userData.email}
                            onChange={userDataHandler}
                            type="email"
                        >
                        </input>
                        <input
                            placeholder="Password"
                            name='password'
                            value={userData.password}
                            onChange={userDataHandler}
                            type="password"
                        >
                        </input>
                        <input
                            placeholder="Confirm Password"
                            name='confirmedPassword'
                            value={userData.confirmedPassword}
                            onChange={userDataHandler}
                            type="password"
                        >
                        </input>
                        <Typography textAlign={"left"}>Upload Avatar:</Typography>
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={imgHandler}
                        />
                        <button type='submit'>Create Account</button>
                    </Container>
                </form>

                <br />

                <Typography color={"#055bcb"} fontSize={14} >Already have an account?</Typography>
                <button className='signup-button' onClick={() => { navigate("/login") }}>Login</button>

            </Container>
        </div>
    )
}

export default HomePage