import { useEffect, useState } from "react";
import api from "../../api";
import StockInfoBlock from "./StockInfoBlock";
function StockList() {
    
    const [stocks,setStocks] = useState();
    
    useEffect(async () => {
        const response = await api('stocks/searchall', 'POST');
        const stockData = []
        for (const [symbol, stockDetails] of Object.entries(response.body)) {
            stockData.push([symbol,stockDetails.name]);
        }
        const items = stockData.map(function(item){
            return <StockInfoBlock data={item}></StockInfoBlock>
        });
        setStocks(items);
    });

    // const getStockLists = async (type) => {
    //     console.log('here');
    //     var response;
    //     if (type === 'next') {
    //         response = await api('stocks/searchnext', 'POST');
    //     }else if(type === 'prev'){
    //         response = await api('stocks/searchprev', 'POST');
    //     }else{
    //         response = await api('stocks/searchall', 'POST');
    //     }
    //     const stockData = [];
    //     for (const [symbol, stockDetails] of Object.entries(response.body)) {
    //         stockData.push([symbol,stockDetails.name]);
    //     }
    //     const items = stockData.map(function(item){
    //         return <StockInfoBlock data={item}></StockInfoBlock>
    //     });
    //     setStocks(items);
    // }
    const onPrevPage = () => {
        const response = await api('stocks/searchprev', 'POST');
        const stockData = [];
        for (const [symbol, stockDetails] of Object.entries(response.body)) {
            stockData.push([symbol,stockDetails.name]);
        }
        const items = stockData.map(function(item){
            return <StockInfoBlock data={item}></StockInfoBlock>
        });
        setStocks(items);
    }

    const onNextPage = () => {
        const response = await api('stocks/searchnext', 'POST');
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
            <div>
                {stocks ? 
                    (stocks) : 
                    (<p>loading</p>)
                }
            </div>
            <button type="button" class="btn btn-outline-primary" onClick={onPrevPage}>prev</button>
            <button type="button" class="btn btn-outline-primary" onClick={onNextPage}>next</button>
        </>
    );
}

export default StockList;