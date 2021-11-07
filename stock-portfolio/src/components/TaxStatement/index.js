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

function AccDetails() {
//   var history = useHistory();
    const [prevI, setPrevI] = useState(0);
  const [income, setIncome] = useState(0);
  const [rate, setRate] = useState(0);
  const [tax, setTaxValue] = useState(0);
  const [editing, setEditing] = useState(false);
//   const token = localStorage.getItem('token');

//   useEffect(() => {

//   }, []);



  const fetchRate = () => {
    let value = 0;
    if (18200 < income && income < 37001)	{
        value = 19;
    } else if (45200 < income && income < 120001)	{
        value = 32.5;
    } else if (120000 < income && income < 180001)	{
        value = 37;
    } else if (income > 180000)	{
        value = 45;
    }

    setRate(value);
    fetchTaxValue(value);
  };

  const fetchTaxValue = (value) => {
    setTaxValue(income * value / 100);
  };

  function edit() {
    setPrevI(income);
    setEditing(true);
    return;
  }

  function handleUpdate() {
    setEditing(false);
    fetchRate();
  }

  return (
    <div class='text-center w-100 p-3'>
      <form>

        <h1>
          Tax Information
          {!editing && (
        <button class='btn btn-lg btn-link btn-block' onClick={edit}>
            Edit
        </button>
          )}
        </h1>
      </form>

      <div>
        {/* <Box display='flex' justifyContent='center' alignItems='center'> */}
          <Box
            component='form'
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            autoComplete='off'
          >
            <div>
              <TextField
                id='standard-read-only-input'
                label='Income'
                value={income}
                InputProps={{
                  readOnly: !editing,
                }}
                onChange={(e) => setIncome(e.target.value)}
                variant='standard'
              />
            </div>
            <br />
            {!editing && (
            
                <div>
                <TextField
                    id='standard-read-only-input'
                    label='Tax Rate'
                    value={`${rate}%`}
                    InputProps={{
                    readOnly: !editing,
                    }}
                    variant='standard'
                />
                </div>
            )}
            <br />
            {!editing && (
                <div>
                <TextField
                    id='standard-read-only-input'
                    label='Tax'
                    value={`$${tax}`}
                    InputProps={{
                    readOnly: !editing,
                    }}
                    variant='standard'
                />
                </div>
            )}
            {editing && (
                <div>
                <button
                class='btn-primary'
                onClick={() => {setEditing(false); setIncome(prevI);}}
              >
                Cancel
              </button>
              <button
                class='btn-primary'
                onClick={handleUpdate}
              >
                Update
              </button>
              </div>
            )}
          </Box>
      </div>
    </div>
  );
}

export default AccDetails;
