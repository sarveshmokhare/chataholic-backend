import React, { useContext } from 'react'
import { Backdrop as MuiBackDrop, CircularProgress } from '@mui/material';

import BackdropContext from '../contexts/BackdropContext';

function Backdrop() {
    const backdropContext = useContext(BackdropContext);

    // console.log("backdrop state:", backdropContext.openBackdrop);
    return (
        <MuiBackDrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={backdropContext.openBackdrop}
        >
            <CircularProgress color="inherit" />
        </MuiBackDrop>
    )
}

export default Backdrop