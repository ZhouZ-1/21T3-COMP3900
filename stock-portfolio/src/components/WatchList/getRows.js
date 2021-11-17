import api from '../../api';

async function getRows(token) {
  const response = await api(`watchlist?token=${token}`, 'GET');
  let row = [];
  var i = -1;

  const realData = response.watchList.map(async (item, idx) => {
    const realTimeData = await api('stocks/search', 'POST', {
      symbol: item[0],
    });
    return {
      id: idx,
      code: item[0],
      name: item[1],
      price: parseFloat(realTimeData.price).toFixed(3),
      change_percent: parseFloat(realTimeData.change_percent).toFixed(3),
    };
  });
  const result = await Promise.all(realData);

  return result;
}
export default getRows;
