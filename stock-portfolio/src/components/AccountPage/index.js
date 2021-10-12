// import {
//     BrowserRouter as Router,
//     Route,
//     Switch,
//     Link,
//   } from "react-router-dom";
import { Button } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router';
import BasicGrid from './../AccNav/index';
import api from '../../api';

function AccountPage() {
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
    <>
      <BasicGrid />
      <Button className='delete-button' onClick={(history) => handleDelete()}>
        Delete
      </Button>
    </>
  );
}

export default AccountPage;
