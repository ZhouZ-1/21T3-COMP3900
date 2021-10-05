import { useHistory } from "react-router";

function NavBar(){
    var history = useHistory();
    return(
        // navbar navbar-dark bg-primary
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Home</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <form class="d-flex">
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
                        <button type="button" class="btn btn-outline-dark" onClick={()=>history.push('/signIn')}>Sign in</button>
                    </form>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;