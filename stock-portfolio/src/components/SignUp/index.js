import { useHistory } from "react-router";

function SignUp(){
    var history = useHistory();
    const handleSignUp = () => {
        //@TODO: Put information to the database.
        history.push('/') //    Go back to main page.
    }
    return(
        <div class="text-center w-100 p-3">
            <label for="inputFirstName" class="sr-only">First Name</label>
            <input type="firstName" id="inputFirstName" class="form-control" placeholder="Michael" required autofocus/>

            <label for="inputLastName" class="sr-only">Last Name</label>
            <input type="lastName" id="inputLastName" class="form-control" placeholder="Jackson" required autofocus/>

            <label for="inputEmail" class="sr-only">Email</label>
            <input type="email" id="email" class="form-control" placeholder="michal.jackson@gmail.com" required autofocus/>

            <label for="inputUserName" class="sr-only">User Name</label>
            <input type="userName" id="inputUserName" class="form-control" placeholder="michael0943" required autofocus/>

            <label for="inputPassword" class="sr-only">Password</label>
            <input type="password" id="inputPassword" class="form-control" placeholder="Password" required/>
            
            <button class="btn btn-lg btn-primary btn-block" onClick={handleSignUp}>Sign Up</button>
        </div>
    );
}

export default SignUp;