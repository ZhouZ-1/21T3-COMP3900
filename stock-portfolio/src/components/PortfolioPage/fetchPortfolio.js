import api from "../../api";

async function fetchPortfolio(p){
    let rows = [];
    const res = await api('portfolio', 'POST', {
        token: localStorage.getItem('token'), portfolio_id: localStorage.getItem('id')
      });
      
    res.map(s => {
        rows.push({
            id: s.holding_id,
            symbol: s.symbol,
            value: s.value,
            qty: s.qty,
            date: s.date,
            performance: p
        })
      })
    return rows;
}

export default fetchPortfolio;