import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import React from 'react';
// TODO fetch from api
import api from '../../api';
import { Avatar, Box, TextField } from '@mui/material';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { validateEmail } from '../SignUp/helper';

function BalancePortfolio(props) {
    var history = useHistory();
    const [openDelete, setOpenDelete] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [openDS, setOpenDS] = useState(false);
    const [symbol,setSymbol] = useState('');
    const [qty,setQty] = useState(0);
    const [stocks, setStocks] = useState([]);
    const [select, setSelect] = useState([]);
    const [balance, setBalance] = useState([0, 0]);
    const [isLoading,setIsLoading] = useState(false);
    const [colourGain, setColourGain] = useState('black');
    const [back, setBack] = useState(0);
    const [overall, setOverall] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {

  }, [back]);

  const handleBalance = (e) => {
    const bal = await api(`invested_performance?token=${localStorage.getItem('token')}`, 'GET'); 
    let total = parseFloat(bal.total_gains.toFixed(0));
    let pct = parseFloat(bal.pct_performance.toFixed(3));
    if (total > 0) {
      setColourGain('green');
    } else if (total < 0) {
      total = parseFloat(bal.total_gains.toFixed(3));
      pct = parseFloat(bal.pct_performance.toFixed(3));
      setColourGain('red');
    }
    setBalance({total_gains: `${total}`, pct_performance: `${pct}`})
  };

  const handleAccountPage = () => {
    //@TODO: check id/password to authenticate/authorise.
    //  if(id,password exist){
    history.push('/account'); // Go back to the main page
    // }else{
    //     display error message
    // }
  };

  function edit() {
    setEditing(true);
    return;
  }

  function handleUpdate() {
    setEditing(false);
    updateFirstName();
    updateLastName();
    updateEmail();
  }

  return (
    <div class='text-center w-100 p-3'>
      <form>
        <h1>
          Portfolio Balance
          <button class='btn btn-lg btn-link btn-block' onClick={history.push(`portfolio/${localStorage.getItem('id')}`)}>
              Go Back
            </button>
        </h1>
      </form>

      <div>
          <Box
            component='form'
            sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            m={23}
            pt={8}
            autoComplete='off'
          >
            <div>
                <span>Total Balance: </span>
                <span style={{ color: colourGain }}> {balance.total_gains} ({balance.pct_performance}%)</span>
            </div>
            <br />
            {props.data.map(p => (
                    <Grid item xs={12} sm={6} md={3} key={port.indexOf(p)}>
                        <Card 
                            variant="outlined"
                            >
                            <CardHeader
                                onClick={(e) => handleRedirect(`${p.portfolio_id}`, `${p.portfolio_name}`, e)}
                                title={`Portfolio : ${p.portfolio_name}`}
                                subheader={`earnings : ${p.earnings}`}
                                subheader={`earnings : 10000`}
                                />  
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {/* Description */}
                                </Typography>
                                <Button class="btn btn-outline-primary ms-5" onClick={handleClickOpenEdit}>Edit Name</Button>
                                <Dialog
                                    open={openEdit}
                                    onClose={handleCloseEdit}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                    {"Edit Porfolio"}
                                    </DialogTitle>
                                    <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Please update the title of Portfolio:
                                    </DialogContentText>
                                    <TextField id="demo-helper-text-misaligned-no-helper" label="Title" required onChange={(evt)=>setTitle(evt.target.value)}></TextField>
                                    </DialogContent>
                                    <DialogActions>
                                    <Button onClick={handleCloseEdit}>Cancel</Button>
                                    <Button onClick={handleEdit} autoFocus>
                                        Confirm
                                    </Button>
                                    </DialogActions>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </Grid>
                    ))}
        </Box>
      </div>
    </div>
  );
}

export default BalancePortfolio;
