import { useEffect, useState } from 'react';
import api from '../../api';
import Loader from '../Loader';

function PortfolioModal(props) {
  const { selectedStocks, allStocks, onProceedClick } = props;
  const token = sessionStorage.getItem('token');

  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);
  const [portfolios, setPortfolios] = useState(<div class="list-group"></div>);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState();
  const [qty, setQty] = useState(0);
  useEffect(() => {
    (async () => {
      const response = await api(`portfolio?token=${token}`, 'GET');
      if (response.portfolios.length === 0) {
        setPortfolios(
          <button type="button" class="list-group-item list-group-item-action">
            You have no Portfolio
          </button>
        );
      } else {
        const portfolioList = response.portfolios.map(function (item) {
          return (
            <button
              type="button"
              class="list-group-item list-group-item-action"
              onClick={() => setSelectedPortfolioId(item.portfolio_id)}
            >
              {item.portfolio_name}
            </button>
          );
        });
        setPortfolios(portfolioList);
      }
      setIsPortfolioLoading(false);
    })();
  }, [token]);

  const onMoveClick = async () => {
    let selectedStocksCode = [];
    allStocks.map((item) => {
      selectedStocks.map((idx) => {
        if (idx === item.id) {
          selectedStocksCode.push(item.code);
        }
        return null;
      });
      return null;
    });

    await api('watchlist/delete', 'DELETE', {
      token: token,
      stocks: selectedStocksCode,
    });
    selectedStocksCode.map(async (code) => {
      const stockDetail = await api('stocks/search', 'POST', {
        symbol: code,
      });
      let value = stockDetail.price;
      if (value === undefined) {
        value = 1;
      }
      await api('portfolio/holdings/add', 'POST', {
        token: token,
        portfolio_id: selectedPortfolioId,
        symbol: code,
        value: value,
        qty: parseInt(qty),
        type: 'buy',
        brokerage: 9.95,
        exchange: 'NYSE',
        date: '10/10/2021',
        currency: 'USD',
      });
    });
    onProceedClick();
  };

  return (
    <div
      class="modal fade"
      id="portfolioModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="portfolioModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Select a portfolio to add stock(s) and quantity
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            {isPortfolioLoading ? (
              <Loader />
            ) : (
              <>
                <div class="list-group">{portfolios}</div>
                <div class="input-group input-group-sm mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-sm">
                      Qty to buy
                    </span>
                  </div>
                  <input
                    id="portfolioInput"
                    type="text"
                    class="form-control"
                    aria-label="Small"
                    aria-describedby="inputGroup-sizing-sm"
                    onChange={(e) => setQty(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={onMoveClick}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PortfolioModal;
