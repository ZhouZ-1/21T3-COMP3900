import api from "../../api";

async function getRow(token){

    const response = await api(`watchlist?token=${token}`, 'GET');    //  Get stocks in the watchlist
    console.log(response);
}
export default getRow;