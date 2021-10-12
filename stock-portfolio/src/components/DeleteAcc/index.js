import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router';
import api from '../../api';
import { Button } from '@mui/material';

function DeleteAcc() {
    var history = useHistory();

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
    <Button className='delete-button' onClick={(history) => handleDelete()}>Delete</Button>
  );
}

export default DeleteAcc;