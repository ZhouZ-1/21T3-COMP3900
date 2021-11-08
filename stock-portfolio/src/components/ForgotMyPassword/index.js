import { useState } from "react";
import React from 'react';
import api from '../../api'
import NavBar from '../NavBar/index';
import { validateEmail } from './../SignUp/helper';
import EmailRuleModal from './../SignUp/EmailRuleModal';

function ForgotMyPassword() {
  const [email, setEmail] = useState('');
  const [sentEmail, setSentEmail] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);


  const handleSubmit = () => {
    const isEmailOkay = validateEmail(email);
    if(!isEmailOkay){
        setIsEmailError(true);
    } else {
        setIsEmailError(false);
    }
  
    if(isEmailOkay) {
        api('accounts/recover', 'POST', {email});
        setSentEmail(true);
    }
  }

  return (
    <>
      <NavBar/>
      <div class="container" style={{marginTop: '3em', border: '1px solid', borderRadius: '5px', padding: '20px 20px 10px 20px'}}>
        <h1>Forgot my password</h1>
        {!sentEmail ?
        <>
          <div>Enter in your email address below to reset your password.</div>
          <form style={{paddingTop: '15px'}} onSubmit={handleSubmit}>
            {isEmailError && 
                    <p class='text-danger'>Please check Email Rule!</p>
            }
            <div class='d-flex justify-content-center'>
                <label for="inputEmail" class="sr-only">Email</label>
                <EmailRuleModal/>
            </div>
            <input type="email" id="inputEmail" class="form-control" placeholder="Email" required autofocus onChange={e => setEmail(e.target.value)}/>
            <button type="button" class="btn btn-primary" onClick={handleSubmit}>Submit</button>
          </form>
        </> : 
        <p>Success! We have sent some instructions to your email on how to recover your account. Note that if the email is invalid, or we do not have your email address in our database, then you will not recieve an email.</p>}
      </div>
    </>
  );
}

export default ForgotMyPassword;