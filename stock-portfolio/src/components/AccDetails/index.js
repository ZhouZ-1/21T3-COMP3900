import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import React from 'react';
// TODO fetch from api
import api from '../../api'
import { Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function AccDetails(){
    
    var history = useHistory();
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() =>{
        api('accounts/details', 'PUT', {token})
            .then(res => {
                if (!res.message) {
                    setUsername(res.username);
                    setFirstName(res.first_name);
                    setLastName(res.last_name);
                    setEmail(res.email);
                    setProfileImage(res.profile_image);
                } else {
                    // Something went wrong 
                }
            })
    })

    const updateEmail = () => {
        api('accounts/update-details', 'PUT', {token, field: 'email', value: email})
    }

    const updateFirstName = () => {
        api('accounts/update-details', 'PUT', {token, field: 'first_name', value: firstName})
    }

    const updateLastName = () => {
        api('accounts/update-details', 'PUT', {token, field: 'last_name', value: lastName})
    }

    const handleAccountPage = () => {
        //@TODO: check id/password to authenticate/authorise.
        //  if(id,password exist){
            history.push('/account') // Go back to the main page
        // }else{
        //     display error message
        // }
    }

    function edit() {
        // TODO Make the page
        // history.push('/editAccount');
        // return(
        //     <div>
        //         <p>TBC</p>
        //     </div>
        // );
        // alert("TBC");
        return;
    }
    
    return(
        <div class="text-center w-100 p-3">
            <form>
            {/* <svg data-testid="AccountCircleIcon"></svg> */}

              <AccountCircleIcon />
              <h1>
                Personal Information  
                <button class="btn btn-lg btn-link btn-block" onClick={edit()}>Edit</button>
              </h1>
            </form>
            
            <form>
            <div>
                <label> Profile Picture:  </label>
                <Avatar
                  alt="Logo"
                  src={`${profileImage}`}
                  sx={{ width: 56, height: 56 }}/>
                {/* <img src={`${profileImage}`} alt="Logo" /> */}
                </div>
            
            <div>
                <label> Email:  </label>
                <p>{email}</p>
            </div>

            <div>
                <label> Username:  </label>
                <p>{username}</p>
            </div>

            <div>
                <label> First Name:  </label>
                <p>{firstName}</p>
            </div>
            
            <div>
                <label> Last Name:  </label>
                <p>{lastName}</p>
              </div>
            </form>
        </div>
    );
}

export default AccDetails;