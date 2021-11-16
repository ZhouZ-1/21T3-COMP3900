import Chart from 'chart.js/auto';

function drawGraph(openPrices) {
  var ctx = document.getElementById('myChart');
  if (ctx === undefined) {
    return;
  }
  ctx = ctx.getContext('2d');
  var dates = [];
  var prices = [];
  openPrices.forEach((element) => {
    dates.push(element[0]);
    prices.push(element[1]);
  });
  const labels = dates;
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Price trend(open price)',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: prices,
      },
    ],
  };
  new Chart(ctx, {
    type: 'line',
    data: data,
    options: {},
  });
}
export default drawGraph;
