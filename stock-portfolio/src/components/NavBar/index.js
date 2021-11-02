import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import api from "../../api";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExportModal from "./ExportModal";
function NavBar(){
    const token = localStorage.getItem('token');
    var history = useHistory();
    let isAuthenticated = !!token;

    const [keywords,setKeyWords] = useState('');
    const [showAllStocks,setShowAllStocks] = useState(true);
    const [stocks, setStocks] = useState();
    const [showDropDown,setShowDropDown] = useState(false);
    const [exportTrigger,setExportTrigger] = useState(false);
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
    
    const processFile = async () => {
        var theFile = document.getElementById("myFile");
        let csv_string = '';
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        //check if file is CSV
        if (regex.test(theFile.value.toLowerCase())) {
        //check if browser support FileReader
            if (typeof (FileReader) != "undefined") {
                var myReader = new FileReader();
                myReader.onload = async function(e) {
                    var content = myReader.result;
                    var lines = content.split("\n");
                    for (var count = 0; count < lines.length-1; count++) {
                        // if(count == 0){
                        //     continue;
                        // }
                        // var row = document.createElement("tr");
                        var rowContent = lines[count].split(",");
                        //loop throw all columns of a row
                        let data='';
                        for (var i = 0; i < rowContent.length; i++) {
                        //create td element
                            if(i==rowContent.length-1){
                                data=data.concat(rowContent[i].trim());
                            }else{
                                data=data.concat(rowContent[i].trim());
                                data=data.concat(',');
                            }
                        }
                        
                        if (count==lines.length-2){
                            csv_string = csv_string.concat(data);
                        }else{
                            csv_string = csv_string.concat(data);
                            csv_string = csv_string.concat('\n');
                        }
                    }
                    console.log('csv string:');
                    console.log(csv_string);
                    await api('portfolio/upload','POST',{
                        token: token,
                        csv_string: csv_string,
                        portfolio_name: "new Portfolio - testing"
                    });
                }
                myReader.readAsText(theFile.files[0]);
                
            }else {
                alert("This browser does not support HTML5.");
            }
        }else{
            alert("Please upload a valid CSV file.");
        }
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
                    (<div>
                        <input type="file" id="myFile"/>
                        <button onClick={processFile}>Process</button>
                        <table id="myTable"></table>
                    </div>
                ),   
                    (<div>
                        <button type="button" class="btn btn-outline-primary ms-5" data-bs-toggle="modal" data-bs-target="#exportModal" onClick={()=>setExportTrigger(!exportTrigger)}>Export Portfolio</button>
                        <ExportModal trigger={exportTrigger}/>
                    </div>
                ),
                (<button type="button" class="btn btn-outline-dark" onClick={()=>history.push('/account')}><AccountCircleIcon/>Account</button>)]:
                (<button type="button" class="btn btn-outline-dark" onClick={()=>history.push('/signIn')}>Sign in</button>)
            }
        </nav>
    );
}

export default NavBar;