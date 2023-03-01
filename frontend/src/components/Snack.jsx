import React, { useContext } from 'react'
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import SnackContext from '../contexts/SnackContext';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Snack() {
    const context = useContext(SnackContext);
    return (
        <Snackbar
            open={context.snackDetails.open}
            onClose={context.handleSnackClose}
        >
            <Alert onClose={context.handleSnackClose} severity={context.snackDetails.type} sx={{ width: '100%' }}>
                {context.snackDetails.msg}
            </Alert>
        </Snackbar>
    )
}

export default Snack