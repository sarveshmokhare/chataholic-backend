import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage"
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ChatPage from "./Pages/ChatPage";
import NotFound from "./Pages/NotFound";
import NotLoggedIn from "./Pages/NotLoggedIn";

import './App.css';
import ChatProvider from "./contexts/ChatProvider";
import SnackState from "./contexts/SnackStates";
import Snack from "./components/Snack";
import BackdropState from "./contexts/BackdropState";
import Backdrop from "./components/Backdrop";

function App() {

  return (
    <div className="App">
      <ChatProvider>
        <SnackState>
          <BackdropState>
            <BrowserRouter>
              <Snack />
              <Backdrop />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/create" element={<Signup />} />
                <Route path="/chats" element={<ChatPage />} />
                <Route path="/not-logged-in" element={<NotLoggedIn />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </BackdropState>
        </SnackState>
      </ChatProvider>
    </div>
  );
}

export default App;
