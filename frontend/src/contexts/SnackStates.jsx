import { useState } from "react";
import SnackContext from "./SnackContext";

function SnackState(props) {
    const [snackDetails, setSnackDetails] = useState({
        open: false,
        type: '',
        msg: '',
    })
    function handleSnackClose(e, reason) {
        if (reason === 'clickaway') return;
        setSnackDetails(prevData => {
            return ({ ...prevData, open: false })
        });
    }
    function newSnack(open, type, msg){
        setSnackDetails(prevData => {
            return ({ open, type, msg })
        });
    }

    return (
        <SnackContext.Provider value={{snackDetails, handleSnackClose, newSnack}}>
            {props.children}
        </SnackContext.Provider>
    )
}

export default SnackState;