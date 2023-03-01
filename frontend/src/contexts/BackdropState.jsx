import { useState } from "react";
import BackdropContext from "./BackdropContext";

function BackdropState(props) {
    const [openBackdrop, setOpenBackdrop] = useState(false)
    function toggleBackdrop() {
        setOpenBackdrop(() => !openBackdrop);
    }
    function turnBackdropOn(){
        setOpenBackdrop(true);
    }
    function turnBackdropOff(){
        setOpenBackdrop(false);
    }

    return (
        <BackdropContext.Provider value={{ openBackdrop, toggleBackdrop, turnBackdropOn, turnBackdropOff }}>
            {props.children}
        </BackdropContext.Provider>
    )
}

export default BackdropState;