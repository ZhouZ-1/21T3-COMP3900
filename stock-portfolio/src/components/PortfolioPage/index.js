import * as React from 'react';
// import { useState } from "react";
import { useHistory } from "react-router";
import { useState } from "react";
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

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'code', headerName: 'Code of Stock', width: 130 },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.getValue(params.id, 'name') || ''} ${
        params.getValue(params.id, 'code') || ''
      }`,
  },
  {
    field: 'units',
    headerName: 'Units',
    type: 'number',
    width: 90,
  },
];

const rows = [
  { id: 1, code: 'STX', name: 'Seagate Technology PLC', units: 35 },      // buy price, balance, market price
  { id: 2, code: 'DFS', name: 'DIscover Financial Services', units: 42 },
  { id: 3, code: 'LSTR', name: 'Landstar System Inc', units: 45 },
  { id: 4, code: 'SWKS', name: 'Skyworks Solutions Inc', units: 16 },
  { id: 5, code: 'SNPS', name: 'Synopsys Inc', units: 133 },
  { id: 6, code: 'NSC', name: 'Norfolk Southern Corporation', units: 150 },
  { id: 7, code: 'CSCO', name: 'Cisco Systems', units: 44 },
  { id: 8, code: 'VIAV', name: 'Viavi Solutions Inc', units: 36 },
  { id: 9, code: 'ROST', name: 'Ross Stores Inc', units: 65 },
];

function PortfolioPage() {
  var history = useHistory();
  const [open, setOpen] = useState(false);
  const [title,setTitle] = useState('');
  const id = localStorage.getItem('id');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeletePortfolio = () => {
    api('portfolio/delete', 'DELETE', {
      token: localStorage.getItem('token'), portfolio_id: id
    })
      .then((res) => {
        if (res.is_success) {
          localStorage.removeItem('id');
        }
      });
    setOpen(false);
    history.push('/viewPortfolio');
  };

  const handleEdit = () => {
      //  api call for create new portfolio
      const token = localStorage.getItem('token');
      api('portfolio/edit', 'POST', {token, portfolio_name: title, portfolio_id: id}) 
          .then(res => {
              if (res.is_success) {
                  // Success
                  alert("Successfully update your password!");
              } else {
                  // Something went wrong
                  alert(res);
              }
          })
      setOpen(false);
  };

  return (
    <div>
      <div>
        <p3>Portfolio</p3>
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
        <Button class="btn btn-outline-primary ms-5">Add Stock</Button>
        <Button class="btn btn-outline-primary ms-5">Delete Stock</Button>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          punitsSize={5}
          rowsPerPunitsOptions={[5]}
          checkboxSelection
        />
      </div>
      <Button onClick={handleClickOpen}>
        Delete Portfolio
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
            {"Delete Portfolio"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do You Want To Delete This Portfolio?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDeletePortfolio} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
}

export default PortfolioPage;