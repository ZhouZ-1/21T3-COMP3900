function getOpenPrices(priceWithinTime){
    var datePrice = [];
    priceWithinTime.forEach((element) => {
        datePrice.push([element[0],element[1]]);
    });
    datePrice.sort();
    return datePrice;
}
export default getOpenPrices;