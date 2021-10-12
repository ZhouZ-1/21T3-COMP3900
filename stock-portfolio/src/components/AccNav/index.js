import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import { Route } from "react-router-dom";
import api from '../../api';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AccDetails from './../AccDetails/index';
import Updatepwd from './../Updatepwd/index';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  

export default function AccNav() {
    var history = useHistory();
    const [status, setStatus] = useState(true);

    const handleDelete = async () => {
      const confirmDelete = window.confirm(
        'Are you sure you want to delete your account?'
      );
      
      if (confirmDelete) {
        api('accounts/delete', 'DELETE', {
          token: localStorage.getItem('token'),
        }).then((resp) => {
          if (resp.is_success) {
            localStorage.removeItem('token');
            history.push('/');
          }
        });
      }
    };

  return (
    <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Item>
                <Button onclick={setStatus(true)} >Account Details</Button>
                <hr/>
                <Button onclick={setStatus(false)}>Update Password</Button>
                <hr/>
                <Button className='delete-button' onClick={(history) => handleDelete()}>Delete</Button>
            </Item>
          </Grid>
          <Grid item xs={8}>
            <Item>
                {status ? <AccDetails/> : <Updatepwd/> }
                </Item>
          </Grid> 
        </Grid> 
    </Box>
  );
}

