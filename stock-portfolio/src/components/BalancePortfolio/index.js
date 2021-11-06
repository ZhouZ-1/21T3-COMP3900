import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import api from '../../api';
import { Box, TextField } from '@mui/material';
import {
Grid,
  Card,
  CardHeader,
  CardContent
} from '@mui/material';

const BalancePortfolio = (props) => {
    var history = useHistory();
    const [balance, setBalance] = useState([0, 0]);
    const [colourGain, setColourGain] = useState('black');
    const [overall, setOverall] = useState([]);

  useEffect(() => {
    handleBalance();
    setOverall(props.overall);
  }, []);

  const handleBalance = async() => {
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
  const handleBack = () => {
    history.push(`/portfolio/${localStorage.getItem('id')}`);
  };

  return (
    <div class='text-center w-100 p-3'>
        Portfolio Balance Page
        <button class='btn btn-lg btn-link btn-block' onClick={handleBack}>
              Go Back
            </button>
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
            {overall.map(s => (
                    <Grid item xs={12} sm={6} md={3} key={overall.indexOf(s)}>
                        <Card 
                            variant="outlined"
                            >
                            <CardHeader
                                title={`Symbol : ${s.symbol}`}
                                subheader={`Changes : ${s.change_val}(${s.change_val}%)`}
                                />  
                            <CardContent>
                            <TextField
                                id='standard-read-only-input'
                                label='Buying Price'
                                value={s.orig_price}
                                variant='standard'
                            />
                            <TextField
                                id='standard-read-only-input'
                                label='Buying Price'
                                value={s.curr_price}
                                variant='standard'
                            />
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
