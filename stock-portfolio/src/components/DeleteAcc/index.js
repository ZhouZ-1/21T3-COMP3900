import React from 'react'
import api from '../../api'
import { Button } from '@mui/material'

function DeleteAcc(props) {
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account?'
    );

    if (confirmDelete) {
      api('accounts/delete', 'DELETE', {
        token: sessionStorage.getItem('token'),
      }).then((resp) => {
        if (resp.is_success) {
          sessionStorage.removeItem('token');
          props.redirect();
        }
      });
    }
  };

  return (
    <Button className="delete-button" onClick={handleDelete}>
      Delete
    </Button>
  );
}

export default DeleteAcc;
