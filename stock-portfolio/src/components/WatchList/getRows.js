import api from "../../api";

async function getRows(token){
    const response = await api(`watchlist?token=${token}`, 'GET');    //  Get stocks in the watchlist
    let row = [];
    response.watchList.map(
        (item,idx)=>{
            row.push({
                id: idx,
                code: item[0],
                name: item[1]
            })
        }
    )
    return row;
}
export default getRows;