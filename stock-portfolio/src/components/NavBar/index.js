import { useState } from "react";
import { useHistory } from "react-router";
import api from "../../api";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function NavBar(){
    var history = useHistory();
    let isAuthenticated = !!localStorage.getItem("token")
    const [keywords,setKeyWords] = useState('');
    const [stocks, setStocks] = useState();
    const [dropdown, setDropdown] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("token");
        history.push('/');
    }

    const onStockClick = (symbol) => {
        setDropdown(false);
        setKeyWords('');
        history.push(`/stockDetails/${symbol}`)
    }

    const onKeywordChange = async (e) => {
        setKeyWords(e.target.value);
        const response = await api(`stocks?query=${keywords}&limit=${10}&offset=${2}`,'GET');
        const stockResults = response.map(function(item){
            return <li onClick={()=>onStockClick(item.symbol)}>{item.symbol} {item.name}</li>;
        });
        setStocks(stockResults);
        setDropdown(true);
    }    

    const handleStockClick = () => {
        setStocks(<li onClick={handleStockClick}>Click here to explore stocks</li>);
        history.push('/stockList');
    }

    return(
        <nav class="navbar navbar-light bg-light justify-content-around">
            <a class="navbar-brand" onClick={() => history.push('/')}>Home</a>
            <form id="inputForm" class="form-inline" onSubmit={(e)=>e.preventDefault()}>
                <input class="form-control me-2" type="search" placeholder="Search" value={keywords} aria-label="Search" onChange={onKeywordChange} data-bs-toggle="collapse" data-bs-target="#stockList" aria-expanded="true"/>
                <ul id = "stockList" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style={{display: (dropdown ? 'block' : 'none')}}>
                    {stocks ? (
                        stocks
                    ):
                    (
                        <li onClick={handleStockClick}>Click here to explore stocks</li>
                    )}
                </ul>
            </form>
            {isAuthenticated ?
                [(<button type="button" class="btn btn-danger" onClick={() => handleLogout()}>Logout</button>),
                (<button type="button" class="btn btn-outline-dark" onClick={()=>history.push('/account')}><AccountCircleIcon/>Account</button>)]:
                (<button type="button" class="btn btn-outline-dark" onClick={()=>history.push('/signIn')}>Sign in</button>)
            }
        </nav>
    );
}

export default NavBar;