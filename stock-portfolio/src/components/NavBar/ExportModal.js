import { useEffect, useState } from 'react';
import api from '../../api';
import Loader from '../Loader';

function ExportModal(props) {
  const { trigger } = props;
  const token = sessionStorage.getItem('token');
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);
  const [portfolios, setPortfolios] = useState(<div class="list-group"></div>);
  useEffect(async () => {
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
            onClick={() => onPortfolioClick(item.portfolio_id)}
          >
            {item.portfolio_name}
          </button>
        );
      });
      setPortfolios(portfolioList);
    }
    setIsPortfolioLoading(false);
  }, [trigger]);

  const onPortfolioClick = async (portFolioId) => {
    window.open(
      `http://localhost:5000/portfolio/download?portfolio_id=${portFolioId}&token=${token}`,
      '_blank'
    );
  };

  return (
    <div
      class="modal fade"
      id="exportModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exportModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Select a portfolio to add stock(s)
            </h5>
            <button
              type="button"
              class="close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            {isPortfolioLoading ? (
              <Loader />
            ) : (
              <div class="list-group">{portfolios}</div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
export default ExportModal;
