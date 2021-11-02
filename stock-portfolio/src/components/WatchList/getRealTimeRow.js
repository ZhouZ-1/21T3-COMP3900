import api from "../../api";

async function getRealTimeRow(row){
    // [
    //   {id:, code, name}
    // ]
    // var realTimeData = [];
    // row.map( async (item)=>{
    //     const response = await api('stocks/search','POST',{
    //         symbol: item.code
    //     });
    //     realTimeData.push({
    //         price: response.price,
    //         change_percent: response.change_percent
    //     });
    //     console.log('response',response);
    // })
    // console.log('realtimedata',realTimeData);
    // return realTimeData;

    let data = await Promise.all(row.map(async (item) => {
        try {
            return await api('stocks/search','POST',{
                symbol: item.code
            }); 
        } catch(err) {
           throw err;
        }
    }));
    let realData = [];
    data.map((item)=>{
        realData.push({
            price: item.price,
            change_percent: item.change_percent
        });
    })
    return realData;
}
export default getRealTimeRow;