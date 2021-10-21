import Chart from 'chart.js/auto';

function drawGraph(openPrices){
    var ctx = document.getElementById('myChart').getContext('2d');
    console.log(openPrices);
    var dates = [];
    var prices = [];
    openPrices.forEach(element => {
        dates.push(element[0]);
        prices.push(element[1]);
    });
    console.log(dates);
    console.log(prices);
    const labels = dates;
    const data = {
        labels: labels,
        datasets: [{
            label: 'Price trend(open price)',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: prices,
        }]
    };
    var myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {}
    });
}
export default drawGraph;