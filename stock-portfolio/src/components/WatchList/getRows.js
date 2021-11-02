import api from "../../api";

async function getRows(token){
    const response = await api(`watchlist?token=${token}`, 'GET');    //  Get stocks in the watchlist
    let row = [];
    var i = -1;
    console.log('in watch list,', response);

    const realData = response.watchList.map(
        async (item,idx)=>{
            const realTimeData = await api('stocks/search','POST',{
                symbol: item[0]
            });
            console.log('processing: ',item[0]);
            console.log('realTime data: ',realTimeData);
            return {
                id: idx,
                code: item[0],
                name: item[1],
                price: realTimeData.price,
                change_percent: realTimeData.change_percent
            }
        }
    );
    const result = await Promise.all(realData);
    console.log('results is',result);
    
    return result;
}
export default getRows;