import { useState } from "react";
import { useHistory } from "react-router";
import React from 'react';

function NavBar(){
    var history = useHistory();
    // @TODO:tony
    let isAuthenticated = !!localStorage.getItem("token")

    const [keywords,SetKeyWords] = useState('');
    const searchKeyWord = (evt) => {
        SetKeyWords(evt.target.value);
        //  @TODO:
        //  1. search keywords making api call
        //  2. display results under search bar.
    }
    const handleLogout = () => {
        localStorage.removeItem("token");
        history.push('/');
    }

    return(
        // navbar navbar-dark bg-primary
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" onClick={() => history.push('/')}>Home</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <form class="d-flex">
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={(evt)=>searchKeyWord(evt)}></input>
                        {isAuthenticated ?
                            (<button type="button" class="btn btn-danger" onClick={() => handleLogout()}>Logout</button>):
                            (<button type="button" class="btn btn-outline-dark" onClick={()=>history.push('/signIn')}>Sign in</button>)
                        }
                    </form>
                    <button type="button" class="btn btn-outline-dark" onClick={()=>history.push('/account')}>Account</button>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;