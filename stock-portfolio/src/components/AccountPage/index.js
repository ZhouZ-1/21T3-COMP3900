// import {
//     BrowserRouter as Router,
//     Route,
<<<<<<< HEAD
//     Switch, 
//     Link,
//   } from "react-router-dom";
import React from 'react';
import { useHistory } from "react-router";
import BasicTabs from './../AccNav/index';
// import AccDetails from './../AccDetails/index';
// import UpdatePassword from "../Updatepwd/index";


function AccountPage(){
    var history = useHistory();
    
    return(
        <BasicTabs/>
        // <Router>
        //   <div>
        //     <ul>
        //       <li>
        //         <Link to="/account">Account Details</Link>
        //       </li>
        //       <li>
        //         <Link to="/updatepwd">Update Account</Link>
        //       </li>
        //     </ul>
    
        //     <hr />
    
        //     <Switch>
        //       <Route exact path="/account">
        //         <AccDetails/>
        //         {/* <BasicTabs/> */}
        //       </Route>
        //       <Route path="/updatepwd">
        //         <UpdatePassword/>
        //       </Route>
        //     </Switch>
        //   </div>
        // </Router>
    );
}


export default AccountPage;
=======
//     Switch,
//     Link,
//   } from "react-router-dom";
import { Button } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router';
// import logo from './../../../public/logo192.png';
import BasicTabs from './../AccNav/index';
// import AccDetails from './../AccDetails/index';
// import UpdatePassword from "../Updatepwd/index";
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
      <BasicTabs />
      <Button className='delete-button' onClick={(history) => handleDelete()}>
        Delete
      </Button>
    </>
  );
}

export default AccountPage;
>>>>>>> master
