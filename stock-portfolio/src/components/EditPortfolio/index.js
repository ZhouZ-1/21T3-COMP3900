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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from "../../api";

function EditPortfolio() {
  var history = useHistory();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [stock, setStock] = useState([]);
  const [stockState, setStockState] = useState(false);
  const [isLoading,setIsLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = useEffect(async() => {
    //  api call for create new portfolio
    const res = await api('portfolio/edit', 'POST', {token: localStorage.getItem('token'), portfolio_name: title, portfolio_id: localStorage.getItem('id')}) 
    if (res) {
        alert("Successfully update your password!");
    }
  //  } else {
  //       // Something went wrong
  //       alert(res);
  //   }
    setOpen(false);
    
  });

  return (
    <div>
        <Button class="btn btn-outline-primary ms-5" onClick={handleClickOpen}>
          Edit Name
        </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Edit Portfolio Name"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Do You Want To Delete This Portfolio?
              </DialogContentText>
              <TextField id="demo-helper-text-misaligned-no-helper" label="Title"  required autofocus onChange={(evt)=>setTitle(evt.target.value)}></TextField>
              </DialogContent>                            
              <br></br>
              <DialogActions>
              <Button autoFocus onClick={handleClose}>Cancel</Button>
              <Button onClick={handleEdit} autoFocus>
                  Confirm
              </Button>
              </DialogActions>
          </Dialog>
    </div>
  );
}

export default EditPortfolio;