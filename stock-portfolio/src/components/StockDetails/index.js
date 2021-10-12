import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../api";
import NavBar from "../NavBar";

function StockDetails(){
    let { symbol } = useParams();
    const [stockDetails,setStockDetails] = useState();
    console.log(symbol);
    useEffect(async ()=>{
        const response = await api('stocks/search', 'POST', {symbol: symbol});
        setStockDetails(response);
    },[symbol]);
    return (
        <>
        <NavBar></NavBar>
        <div>
            {console.log(stockDetails)}
            {stockDetails ? 
                (
                    <div>
                        <ul>
                            <li>stock symbol: {stockDetails.symbol}</li>
                            <li>stock name: {stockDetails.name}</li>
                            <li>stock name: {stockDetails.price}</li>
                            <li>stock name: {stockDetails.sector}</li>
                            <li>stock name: {stockDetails.asset_type}</li>
                        </ul>
                    </div>
                ):
                (<div>retrieving data</div>)
            }
        </div>
        </>
    );
}

export default StockDetails;