import React, { useState, useContext } from 'react'
import { Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

import ChatImg from '../images/chat_app_img.svg';
import "../Pages/HomePage.css";
import { loginRoute } from '../helpers/routes';
import SnackContext from '../contexts/SnackContext';
import BackdropContext from '../contexts/BackdropContext';

const HomePage = () => {
    const navigate = useNavigate();
    const snackContext = useContext(SnackContext);
    const backdropContext = useContext(BackdropContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function submitHandler(e) {
        e.preventDefault();
        backdropContext.turnBackdropOn();

        axios
            .post(loginRoute, { email, password })
            .then(res => {
                if(res.data.success){
                    snackContext.newSnack(true, "success", "Successfully logged in.");
       
                    localStorage.setItem("accessToken", res.data.accessToken);
                    localStorage.setItem("userEmail", email);
    
                    backdropContext.turnBackdropOff();
                    navigate("/chats", { state: { email } });
                }
                else{
                    snackContext.newSnack(true, "error", res.data.message);
                    backdropContext.turnBackdropOff();
                }
            })
            .catch(err => {
                console.log(err);
                backdropContext.turnBackdropOff();

                snackContext.newSnack(true, "error", "Network Error.");
                // snackHandler("error", "Invalid email or password!");
            })

    }
    // console.log(backdropContext.openBackdrop);
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
                    onClick={() => { navigate("/"); }}
                >
                    Chataholic
                </Typography>

                <img alt='chat-img' src={ChatImg}></img>

                <Typography variant='h5'>
                    Login
                </Typography>

                <form onSubmit={submitHandler} method="post">
                    <Container
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <input
                            placeholder="Email Address"
                            name='email'
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email"
                        >
                        </input>
                        <input
                            placeholder="Password"
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                        >
                        </input>
                        <button>Sign in</button>
                    </Container>
                </form>


                <br />

                <Typography color={"#055bcb"} fontSize={14} >Don't have an account?</Typography>
                <button className='signup-button' onClick={() => { navigate("/create"); }}>Create Account</button>
            </Container>
        </div>

    )
}

export default HomePage