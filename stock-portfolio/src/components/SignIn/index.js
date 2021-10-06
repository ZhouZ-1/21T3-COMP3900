import { useHistory } from "react-router";

function SignIn(){
    var history = useHistory();
    const handleSignIn = () => {
        //@TODO: check id/password to authenticate/authorise.
        //  if(id,password exist){
            history.push('/') // Go back to the main page
        // }else{
        //     display error message
        // }
    }
    return(
        <div class="text-center w-100 p-3">
            <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
            <label for="inputEmail" class="sr-only">Email address</label>
            <input type="email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus/>
            <label for="inputPassword" class="sr-only">Password</label>
            <input type="password" id="inputPassword" class="form-control" placeholder="Password" required/>
            <button class="btn btn-lg btn-primary btn-block" onClick={handleSignIn}>Sign in</button>
            <p class="mt-5 mb-3 text-muted">or</p>
            <button class="btn btn-lg btn-primary btn-block" onClick={() => history.push('/signUp')}>Sign Up</button>
        </div>
    );
}

export default SignIn;