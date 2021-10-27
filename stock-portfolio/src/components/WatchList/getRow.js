import api from "../../api";

async function getRow(token){
    
    const response = await api('watchList', 'POST');    //  Get stocks in the watchlist
    
}