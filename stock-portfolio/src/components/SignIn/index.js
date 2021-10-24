import React from 'react';
import { useState } from "react";
import { useHistory } from "react-router";
import api from '../../api'
import NavBar from '../NavBar/index';
function SignIn(){
    var history = useHistory();
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [authenticationError,setAuthenticationError] = useState(false);
    const handleSignIn = () =>
        api('accounts/login', 'POST', {username, password}).then(res => {
            if (res.token) {
                // Set token and redirects to the main page.
                localStorage.setItem('token', res.token)
                history.push('/')
            } else {
                setAuthenticationError(true);
            }
        })

    return(
        <div>
            <NavBar/>
            <div class="text-center mx-auto w-50">
                <h1 class="h3 mt-5 mb-3 font-weight-normal">Please sign in</h1>
                <label for="inputUsername" class="sr-only">Username</label>
                <input type="username" id="inputUsername" class="form-control" placeholder="Username" required autofocus onChange={(evt)=>setUsername(evt.target.value)}/>
                <label for="inputPassword" class="sr-only">Password</label>
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" required onChange={(evt)=>setPassword(evt.target.value)}/>
                {authenticationError && 
                    <p class='text-danger'>Incorrect Username or Password. Please try again!</p>
                }
                <button class="btn btn-lg btn-primary btn-block mt-5" onClick={handleSignIn}>Sign in</button>
                
                <div><a href="/resetPassword">Forgotten password?</a></div>
                <p class="mt-3 text-muted">or</p>
                <button class="btn btn-lg btn-primary btn-block mt-3" onClick={() => history.push('/signUp')}>Sign Up</button>
            </div>
        </div>
    );
}

export default SignIn;