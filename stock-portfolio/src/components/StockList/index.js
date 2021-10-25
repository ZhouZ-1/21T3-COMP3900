import { useEffect, useState } from "react";
import api from "../../api";
import NavBar from "../NavBar";
import StockInfoBlock from "./StockInfoBlock";
function StockList() {
    
    const [stocks,setStocks] = useState();
    
    useEffect(async () => {
        await getStockList('normal');
    },[]);

    const getStockList = async (type) => {
        var response;
        if (type==='next'){
            response = await api('stocks/searchnext', 'POST');
        }else if(type==='prev'){
            response = await api('stocks/searchprev', 'POST');
        }else{
            response = await api('stocks/searchall', 'POST');
        }
        const stockData = [];
        for (const [symbol, stockDetails] of Object.entries(response.body)) {
            stockData.push([symbol,stockDetails.name]);
        }
        const items = stockData.map(function(item){
            return <StockInfoBlock data={item}></StockInfoBlock>
        });
        setStocks(items);
    }

    return (
        <>
            <NavBar></NavBar>
            <div class="m-5">
                <div>
                    {stocks ? 
                        (stocks) : 
                        (<p>loading</p>)
                    }
                </div>
            </div>
            <button type="button" class="btn btn-outline-primary ms-5" onClick={()=>getStockList('prev')}>prev</button>
            <button type="button" class="btn btn-outline-primary ms-2" onClick={()=>getStockList('next')}>next</button>
            
        </>
    );
}

export default StockList;