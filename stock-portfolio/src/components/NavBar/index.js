import React from 'react';
import { useEffect, useState } from "react";
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
    const handleLogout = () => {
        localStorage.removeItem("token");
        history.push('/');
    }

    useEffect(()=>{
        if(keywords === ''){
            setShowAllStocks(true);
        }
    },[keywords]);
    const onSearchFocus = () => {
        setShowDropDown(true);
    }

    const onKeywordChange = async (e) => {
        setKeyWords(e.target.value);
        if (keywords === ''){
            setShowAllStocks(true);
        }else{
            setShowAllStocks(false);
        }
        const response = await api(`stocks?query=${keywords}&limit=${10}&offset=${2}`,'GET');
        const stockResults = response.map(function(item,idx){
            return <li key={idx} onMouseDown={() => onStockClick(item.symbol)}>{item.symbol} {item.name}</li>;
        });
        setStocks(stockResults);
    }

    const onStockClick = (symbol) => {
        setShowAllStocks(true);
        setShowDropDown(false);
        setKeyWords('');
        document.getElementById("searchBar").value = '';
        history.push(`/stockDetails/${symbol}`);
    }
    
    return(
        <nav class="navbar navbar-light bg-light justify-content-around">
            <a class="navbar-brand" onClick={() => history.push('/')}>Home</a>
            <form class="form-inline" onSubmit={(e) => e.preventDefault()}>
                <input id="searchBar" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" onBlur={()=>setShowDropDown(false)} onFocus={onSearchFocus} onChange={(e) => onKeywordChange(e)} data-bs-toggle="collapse" data-bs-target="#stockList" aria-expanded="false"/>
                    {showDropDown ? (
                        showAllStocks ? (
                            <ul id = "stockList" class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li onMouseDown={() => history.push('/stockList')}>Please tap here to search all stocks</li>
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