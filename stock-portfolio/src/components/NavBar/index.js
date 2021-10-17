import { useState } from "react";
import { useHistory } from "react-router";
import api from "../../api";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function NavBar(){
    var history = useHistory();
    let isAuthenticated = !!localStorage.getItem("token")

    const [keywords,setKeyWords] = useState('');
    const [stockResult,setStockResult] = useState();
    const [stock, setStock] = useState(<li>Searching for stocks...</li>);
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        history.push('/');
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        api('stocks/search', 'POST', {symbol: keywords}).then(res => { // Make API call style consistent.
            setStockResult(res);
        });
    }
    const onKeywordChange = async (e) => {
        setKeyWords(e.target.value);
        const response = await api(`stocks?query=${keywords}&limit=${5}&offset=${2}`,'GET');
        console.log(response);
    }

    const searchAllStock = async (type) => {
        var response;
        if (type == 'normal'){
            response = await api('stocks/searchall', 'POST');
        }else if (type == 'next'){
            response = await api('stocks/searchnext', 'POST');
        }else{
            response = await api('stocks/searchprev', 'POST');
        }
        const stockData = []
        for (const [quote, stockDetails] of Object.entries(response.body)) {
            stockData.push([quote,stockDetails.name]);
        }
        const items = stockData.map(function(item){
            return <li onClick={()=>history.push(`/stockDetails/${item[0]}`)}>{item[0]} {item[1]}</li>;
        });
        items.push(<div><span onClick={() => searchAllStock('prev')}>prev</span> <span onClick={() => searchAllStock('next')}>next</span></div>)
        setStock(items);
    }
    const onSearchClick = async () => {
        await searchAllStock('normal');
    }
    return(
        <nav class="navbar navbar-light bg-light justify-content-around">
            <a class="navbar-brand" onClick={() => history.push('/')}>Home</a>
            <form class="form-inline" onSubmit={handleSubmit}>
                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" onClick={onSearchClick} onChange={onKeywordChange} data-bs-toggle="collapse" data-bs-target="#stockList" aria-expanded="false"/>
                <ul id = "stockList" class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    {stockResult ? 
                        (<li onClick={()=>history.push(`/stockDetails/${keywords}`)}>{stockResult.symbol} {stockResult.name} {stockResult.price}</li>) : 
                        (stock)
                    }
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