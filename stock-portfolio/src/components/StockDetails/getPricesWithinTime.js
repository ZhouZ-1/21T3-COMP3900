import api from "../../api";

async function getPricesWithinTime(symbol,timeFrame){
    const graphResult = await api('stocks/searchpast', 'POST', {
        symbol: symbol,
        date_before: timeFrame 
    });
    var priceInPeriod = [];
    for (const [date, dateData] of Object.entries(graphResult)) {
        var priceInDay = [];
        priceInDay.push(date);
        for (const [, price] of Object.entries(dateData)) {
            priceInDay.push(price);
        }
        priceInPeriod.push(priceInDay);
    }
    return priceInPeriod;
}
export default getPricesWithinTime;