import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../api";
import NavBar from "../NavBar";

function StockDetails(){
    let { symbol } = useParams();
    const [stockDetails,setStockDetails] = useState();
    useEffect(async ()=>{
        const response = await api('stocks/search', 'POST', {symbol: symbol});
        setStockDetails(response);
    },[symbol]);
    return (
        <>
            <NavBar></NavBar>
            {console.log(stockDetails)}
            <div class='main-container m-5'>
                <div>
                    <div class="d-inline-block stock-description">
                        <div class='stock-title'>
                            {stockDetails.name} ({stockDetails.symbol})
                        </div>
                        <div class='stock-industry'>
                            {stockDetails.industry}
                        </div>
                    </div>
                    <div class="d-inline-block watch-list-container">
                        <div class="watch-list">
                            <button type="button" class="btn btn-primary watch-list">add to watch list</button>
                        </div>
                    </div>
                </div>
                
                <div class="stock-price">
                    {stockDetails.price}
                </div>
            </div>

            <div class='graph-container m-5'>
                <div class="stock-trend-graph">
                    {/* TODO: TONY - implement graph here */}
                    <p>graph comes here</p>
                    <button type="button" class="btn btn-primary 3-month">3M</button>
                    <button type="button" class="btn btn-primary 6-month">6M</button>
                    <button type="button" class="btn btn-primary 1-year">1YR</button>
                </div>
            </div>

            <div class='stock-statistics-container m-5'>
                {stockDetails ? 
                    (
                        <div class="stock-statistics">
                            <div class="row justify-content-start">
                                <div class="col-3">
                                    52 week high: {stockDetails.year_high}
                                </div>
                                <div class="col-3">
                                    52 week low: {stockDetails.year_low}
                                </div>
                            </div>
                            <div class="row justify-content-start">
                                <div class="col-3">
                                    stock price: {stockDetails.price}
                                </div>
                                <div class="col-3">
                                    stock sector: {stockDetails.sector}
                                </div>
                            </div>
                            <div class="row justify-content-start">
                                <div class="col-3">
                                stock asset type: {stockDetails.asset_type}
                                </div>
                            </div>
                        </div>
                    ):
                    (<div>retrieving data</div>)
                }
            </div>
        </>
    );
}

export default StockDetails;