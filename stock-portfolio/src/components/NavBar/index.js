import { useState } from "react";
import { useHistory } from "react-router";
import api from "../../api";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function NavBar(){
    var history = useHistory();
    let isAuthenticated = !!localStorage.getItem("token")

    const [keywords,setKeyWords] = useState('');
    const [showAllStocks,setShowAllStocks] = useState(true);
    const [stocks, setStocks] = useState();
    const [showDropDown,setShowDropDown] = useState(false);
    const [isBluredByStock,setIsBluredByStock] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("token");
        history.push('/');
    }
    const handleSubmit = (e) => {
        // e.preventDefault();
        // api('stocks/search', 'POST', {symbol: keywords}).then(res => { // Make API call style consistent.
        //     setStockResult(res);
        // });
    }
    // const searchAllStock = async (type) => {
    //     var response;
    //     if (type == 'normal'){
    //         response = await api('stocks/searchall', 'POST');
    //     }else if (type == 'next'){
    //         response = await api('stocks/searchnext', 'POST');
    //     }else{
    //         response = await api('stocks/searchprev', 'POST');
    //     }
    //     const stockData = []
    //     for (const [quote, stockDetails] of Object.entries(response.body)) {
    //         stockData.push([quote,stockDetails.name]);
    //     }
    //     const items = stockData.map(function(item){
    //         return <li onClick={()=>history.push(`/stockDetails/${item[0]}`)}>{item[0]} {item[1]}</li>;
    //     });
    //     items.push(<div><span onClick={() => searchAllStock('prev')}>prev</span> <span onClick={() => searchAllStock('next')}>next</span></div>)
    //     setStock(items);
    // }
    // const onSearchClick = async () => {
    //     // await searchAllStock('normal');
    // }
    const onSearchFocus = async () => {
        setShowDropDown(true);
    }
    
    // const onSearchBlur = async() => {
    //     setShowDropDown(false);
    // }

    const onKeywordChange = async (e) => {
        setKeyWords(e.target.value);
        if (keywords === ''){
            setShowAllStocks(true);
        }else{
            setShowAllStocks(false);
        }
        const response = await api(`stocks?query=${keywords}&limit=${10}&offset=${2}`,'GET');
        const stockResults = response.map(function(item,idx){
            return <li key={idx} onClick={() => onStockClick(item.symbol)}>{item.symbol} {item.name}</li>;
        });
        setStocks(stockResults);
    }

    const onStockClick = (symbol) => {
        setShowAllStocks(false);
        setShowDropDown(false);
        setIsBluredByStock(true);
        document.getElementById("searchBar").value = '';
        history.push(`/stockDetails/${symbol}`);
    }
    const onSearchAll = () => {
        setShowAllStocks(false);
        setShowDropDown(false);
        setIsBluredByStock(true);
        document.getElementById("searchBar").value = '';
        history.push('/stockList');
    }
    return(
        <nav class="navbar navbar-light bg-light justify-content-around">
            <a class="navbar-brand" onClick={() => history.push('/')}>Home</a>
            <form class="form-inline" onSubmit={handleSubmit}>
                <input id="searchBar" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" onFocus={onSearchFocus} onChange={(e) => onKeywordChange(e)} data-bs-toggle="collapse" data-bs-target="#stockList" aria-expanded="false"/>
                    {showDropDown ? (
                        showAllStocks ? (
                            <ul id = "stockList" class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li onClick={onSearchAll}>Please tap here to search all stocks</li>
                            </ul>
                            ):(
                            <ul id = "stockList" class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                {stocks}
                            </ul>
                            )
                        
                        ):
                        (null)
                    }
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