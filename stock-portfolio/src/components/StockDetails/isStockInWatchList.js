import api from "../../api";

async function isStockInWatchList(symbol){
    const token = localStorage.getItem('token');
    const response = await api(`watchlist?token=${token}`, 'GET');    //  Get stocks in the watchlist
    let isInWatchList = false;
    response.watchList.map((item)=>{
        if(item[0]===symbol){
            isInWatchList=true;
        }
    });
    console.log("is it in watch list?",isInWatchList);
    return isInWatchList;
}
export default isStockInWatchList;