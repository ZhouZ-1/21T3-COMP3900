import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../api";
import NavBar from "../NavBar";

function StockDetails(){
    let { symbol } = useParams();
    const [stockDetails,setStockDetails] = useState();
    const [isLoading,setIsLoading] = useState(true);
    const [isInWatchList,setIsInWatchList] = useState(false);
    
    //  Decide whether current stock is in user's watchlist or not
    // const setwatchListContainStock = () => {
    // }
    useEffect(async ()=>{
        const response = await api('stocks/search', 'POST', {symbol: symbol});
        setStockDetails(response);
        // setIsInWatchList(setwatchListContainStock());
        setIsLoading(false);
    },[symbol]);

    const renderContents = () => {
        return (
            
            <div class="text-center mx-auto w-50">
                <div class='main-stock-detail-container'>
                    <div>
                        <div class="ms-5 mt-5 d-inline-block stock-description">
                            <hr/>
                            <div class='stock-title'>
                                <h4>{stockDetails.name} ({stockDetails.symbol})</h4>
                            </div>
                            <div class='stock-industry'>
                                <small>{stockDetails.industry}</small>
                            </div>
                        </div>
                        <div class="d-inline-block watch-list-container">
                            <div class="ms-5 watch-list">
                                {isInWatchList ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                                        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-2 stock-price">
                        <h1>{stockDetails.price}</h1>
                        <hr></hr>
                    </div>
                </div>

                <div class='mt-2 graph-container'>
                    <div class="stock-trend-graph">
                        {/* TODO: TONY - implement graph here */}
                        <p>graph comes here</p>
                        <button type="button" class="btn btn-outline-primary 3-month">3M</button>
                        <button type="button" class="ms-3 btn btn-outline-primary 6-month">6M</button>
                        <button type="button" class="ms-3 btn btn-outline-primary 1-year">1YR</button>
                        <hr></hr>
                    </div>
                </div>

                <div class='mt-3 stock-statistics-container'>
                    <div class="stock-statistics">
                        <div class="row justify-content-md-center">
                            <div class="col-4">
                                <span class="border-bottom">52 week high: {stockDetails.year_high}</span>
                            </div>
                            <div class="col-4">
                                <span class="border-bottom">52 week low: {stockDetails.year_low}</span>
                            </div>
                        </div>
                        <div class="row justify-content-md-center">
                            <div class="col-4">
                                <span class="border-bottom">stock price: {stockDetails.price}</span>
                            </div>
                            <div class="col-4">
                                <span class="border-bottom">stock sector: {stockDetails.sector}</span>
                            </div>
                        </div>
                        <div class="row justify-content-md-center">
                            <div class="col-4">
                                <span class="border-bottom">stock asset type: {stockDetails.asset_type}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <>
            <NavBar></NavBar>
            {isLoading ? (
                <div class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            ) : (
                renderContents()
            )}
        </>
    );
}

export default StockDetails;