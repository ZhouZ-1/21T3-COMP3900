import { useState } from "react";
import { useHistory } from "react-router";
import React from 'react';
import { validatePassword,validateEmail } from './helper';
import PasswordRuleModal from './PasswordRuleModal';
import EmailRuleModal from './EmailRuleModal';
import api from '../../api'
import NavBar from '../NavBar/index';
function SignUp(){
    var history = useHistory();
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [email,setEmail] = useState('');
    const [userName,setUserName] = useState('');
    const [password,setPassword] = useState('');
    const [isPasswordError,setIsPasswordError] = useState(false);
    const [isEmailError,setIsEmailError] = useState(false);

    const handleSignUp = () => {
        const isPasswordOkay = validatePassword(password);
        const isEmailOkay = validateEmail(email);

        if(!isPasswordOkay){
            setIsPasswordError(true);
        }else{
            setIsPasswordError(false);
        }
        if(!isEmailOkay){
            setIsEmailError(true);
        }else{
            setIsEmailError(false);
        }

        if(isPasswordOkay && isEmailOkay){
            //  Put user information to database.
            api('accounts/register', 'POST', {username: userName, first_name: firstName, last_name: lastName, email, password}).then(res => {
                if (res.token) {
                    // Set token and redirects to the main page.
                    localStorage.setItem('token', res.token);
                    history.push('/');
                } else {
                    // TODO: display error message
                }
            })
        }
    }
    return(
        // text-center w-50 p-3 offset-md-3
        <>
            <NavBar/>
            <div class="text-center mx-auto w-50">
                <h1 class="h3 mt-5 mb-3 font-weight-normal">Sign Up</h1>

                <label for="inputFirstName" class="sr-only mt-3">First Name</label>
                <input type="firstName" id="inputFirstName" class="form-control" placeholder="Michael" required autofocus onChange={(evt)=>setFirstName(evt.target.value)}/>

                <label for="inputLastName" class="sr-only mt-3">Last Name</label>
                <input type="lastName" id="inputLastName" class="form-control" placeholder="Jackson" required autofocus onChange={(evt)=>setLastName(evt.target.value)}/>

                <div class='d-flex justify-content-center'>
                    <label for="inputEmail" class="sr-only mt-3">Email</label>
                    <EmailRuleModal/>
                </div>
                <input type="email" id="email" class="form-control" placeholder="michal.jackson@gmail.com" required autofocus onChange={(evt)=>setEmail(evt.target.value)}/>
                {isEmailError && 
                    <p class='text-danger'>Please check Email Rule!</p>
                }

                <label for="inputUserName" class="sr-only mt-3">User Name</label>
                <input type="userName" id="inputUserName" class="form-control" placeholder="michael0943" required autofocus onChange={(evt)=>setUserName(evt.target.value)}/>
                
                <div class='d-flex justify-content-center'>
                    <label for="inputPassword" class="sr-only mt-3">Password</label>
                    <PasswordRuleModal/>
                </div>
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" required onChange={(evt)=>setPassword(evt.target.value)}/>
                {isPasswordError && 
                    <p class='text-danger'>Please check Password Rule!</p>
                }
                <button class="btn btn-lg btn-primary btn-block mt-5" onClick={handleSignUp}>Sign Up</button>
            </div>
        </>
    );
}

export default SignUp;