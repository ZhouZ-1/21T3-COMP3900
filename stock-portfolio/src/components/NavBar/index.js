import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import api from "../../api";

function NavBar(){
    var history = useHistory();
    // @TODO:tony
    let isAuthenticated = !!localStorage.getItem("token")

    const [keywords,setKeyWords] = useState('');
    const [stockResult,setStockResult] = useState();

    const handleLogout = () => {
        localStorage.removeItem("token");
        history.push('/');
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('keyword sending',keywords);
        
        api('stocks/search', 'POST', {symbol: keywords}).then(res => { // Make API call style consistent.
            setStockResult(res);
        });
        console.log('response',stockResult);
    }
    
    return(
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" onClick={() => history.push('/')}>Home</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <form class="d-flex" onSubmit={handleSubmit}>
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={(evt)=>setKeyWords(evt.target.value)} data-bs-toggle="dropdown" aria-expanded="false"/>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            {stockResult ? <li>{stockResult.name}</li> : <li>Waiting for stock</li>}
                        </ul>
                    </form>
                    {isAuthenticated ?
                            (<button type="button" class="btn btn-danger" onClick={() => handleLogout()}>Logout</button>):
                            (<button type="button" class="btn btn-outline-dark" onClick={()=>history.push('/signIn')}>Sign in</button>)
                    }
                </div>
            </div>
        </nav>
    );
}

export default NavBar;