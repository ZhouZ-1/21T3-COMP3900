import { getGridDateOperators } from "@mui/x-data-grid";
import api from "../../api";

async function getRows(token){
    const response = await api(`watchlist?token=${token}`, 'GET');    //  Get stocks in the watchlist
    let row = [];

    response.watchList.map(
        async (item,idx)=>{
            row.push({
                id: idx,
                code: item[0],
                name: item[1],
            });
        }
    );
    const clonedArray = row.map(a => {return {...a}});
    var i = 0;
    console.log(clonedArray);
    row.map((item)=>{
        api('stocks/search','POST',{
            symbol: item.code
        }).then((res)=>{
                console.log(res);
                clonedArray[i].price = res.price
            }
        );
        i += 1;
    });
    console.log(clonedArray);

    return row;
}
export default getRows;