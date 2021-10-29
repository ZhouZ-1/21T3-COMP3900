import React from 'react';
import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { 
    Button,  
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, 
    useMediaQuery,
    useTheme
} from '@mui/material';
import api from "../../api";

function CreatePortfolio() {
    const [open, setOpen] = React.useState(false);
    const [title,setTitle] = useState();
    const theme = useTheme();
    var history = useHistory();
    const token = localStorage.getItem('token');

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    async function HandleCreate() {
        //  api call for create new portfolio
        // api('portfolio/create', 'POST', {token, portfolio_name: title}) 
        //     .then(res => {
        //         if (res) {
        //             // Success
        //             alert("Successfully update your password!");
        //         } else {
        //             // Something went wrong
        //             alert(res);
        //         }
        //     })
        // useEffect(async()=>{
            const res = await api('portfolio/create', 'POST', {token, portfolio_name: title});
        // },[title]);
        setOpen(false);
        alert(title);
    };

    return (
        <div>
            <h3>Portfolio Overview</h3>
            <div>
                <Button variant="outlined" onClick={handleClickOpen}>
                    Create Portfolio
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                    {"Create Portfolio"}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        Please enter title of Portfolio:  
                    </DialogContentText>
                    <TextField id="demo-helper-text-misaligned-no-helper" label="Title"  required autofocus onChange={(evt)=>setTitle(evt.target.value)}></TextField>
                    </DialogContent>                            
                    <br></br>
                    <DialogActions>
                    <Button autoFocus onClick={handleClose}>Cancel</Button>
                    <Button onClick={HandleCreate} autoFocus>
                        Confirm
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
        
    )
}

export default CreatePortfolio;