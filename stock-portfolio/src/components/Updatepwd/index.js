import React from 'react';
import { useState } from 'react';
import PasswordRuleModal from './../SignUp/PasswordRuleModal';
import { validatePassword } from './../SignUp/helper';
import api from '../../api';

function UpdatePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isCheckPasswordError, setIsCheckPasswordError] = useState(false);

  const handleUpdateAccount = () => {
    const isPasswordOkay = validatePassword(newPassword);
    const isCheckPassword = checkPassword();

    if (!isPasswordOkay) {
      // TODO check for old password and error
      setIsPasswordError(true);
    } else {
      setIsPasswordError(false);
    }

    if (!isCheckPassword) {
      setIsCheckPasswordError(true);
    } else {
      setIsCheckPasswordError(false);
    }

    //@TODO: check id/password to authenticate/authorise.
    //  if(id.password exist){
    if (isPasswordOkay && isCheckPassword) {
      const token = sessionStorage.getItem('token');
      api('accounts/update-password', 'PUT', {
        token,
        new_password: newPassword,
        old_password: oldPassword,
      }).then((res) => {
        if (res.is_success) {
          // Success
          alert('Successfully update your password!');
        } else {
          // Something went wrong
          alert(res.message);
        }
      });
    }
  };

  function checkPassword() {
    let checkPassword = document.getElementById('checkPassword').value;
    // error or input field is empty
    if (checkPassword === -1) {
      // alert('Please enter the confirm password.')
      return false;
    } else if (!checkPassword.match(newPassword)) {
      // return(alert('The password confirmation does not match.'))
      return false;
    }
    return true;
  }

  return (
    <div class="text-center w-100 p-3">
      <h1 class="h3 mb-3 font-weight-normal">Account Security</h1>
      <label for="inputOldPassword" class="sr-only">
        Original Password
      </label>
      <input
        type="password"
        id="inputOldPassword"
        class="form-control"
        placeholder="Enter Original Password"
        required
        onChange={(evt) => setOldPassword(evt.target.value)}
      />
      <br />
      <div class="d-flex justify-content-center">
        <label for="inputNewPassword" class="sr-only">
          New Password
        </label>
        <PasswordRuleModal />
      </div>
      {isPasswordError && (
        <p class="text-danger">Please check Password Rule!</p>
      )}
      <input
        type="password"
        id="inputNewPassword"
        class="form-control"
        placeholder="Enter New Password"
        required
        onChange={(evt) => setNewPassword(evt.target.value)}
      />
      <br />
      <label for="checkPassword" class="sr-only">
        Confirm Password
      </label>
      {isCheckPasswordError && (
        <p class="text-danger">The password confirmation does not match.</p>
      )}
      <input
        type="password"
        id="checkPassword"
        class="form-control"
        placeholder="Enter Confirm Password"
      />
      <br />
      <button
        class="btn btn-lg btn-primary btn-block"
        onClick={handleUpdateAccount}
      >
        Update
      </button>
    </div>
  );
}

export default UpdatePassword;
