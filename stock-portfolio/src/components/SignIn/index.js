import { useState } from "react";
import { useHistory } from "react-router";
import api from '../../api'

function SignIn(){
    var history = useHistory();
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const handleSignIn = () =>
        api('accounts/login', 'POST', {username, password}).then(res => {
            if (res.token) {
                // Set token and redirects to the main page.
                localStorage.setItem('token', res.token)
                history.push('/')
            } else {
                // TODO: display error message
            }
        })

    return(
        <div class="text-center w-100 p-3">
            <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
            <label for="inputUsername" class="sr-only">Username</label>
            <input type="username" id="inputUsername" class="form-control" placeholder="Username" required autofocus onChange={(evt)=>setUsername(evt.target.value)}/>
            <label for="inputPassword" class="sr-only">Password</label>
            <input type="password" id="inputPassword" class="form-control" placeholder="Password" required onChange={(evt)=>setPassword(evt.target.value)}/>
            <button class="btn btn-lg btn-primary btn-block" onClick={handleSignIn}>Sign in</button>
            <p class="mt-5 mb-3 text-muted">or</p>
            <button class="btn btn-lg btn-primary btn-block" onClick={() => history.push('/signUp')}>Sign Up</button>
        </div>
    );
}

export default SignIn;