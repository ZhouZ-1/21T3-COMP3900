import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import api from '../../api';
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';
import InvitesModal from './InvitesModal';
import './navbarStyles.css';
function NavBar() {
  const token = sessionStorage.getItem('token');
  var history = useHistory();
  let isAuthenticated = !!token;

  const [keywords, setKeyWords] = useState('');
  const [showAllStocks, setShowAllStocks] = useState(true);
  const [stocks, setStocks] = useState();
  const [showDropDown, setShowDropDown] = useState(false);
  const [exportTrigger, setExportTrigger] = useState(false);
  const [importTrigger, setImportTrigger] = useState(false);
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    history.push('/');
  };

  useEffect(() => {
    if (keywords === '') {
      setShowAllStocks(true);
    }
  }, [keywords]);
  const onSearchFocus = () => {
    setShowDropDown(true);
  };

  const onKeywordChange = async (e) => {
    setKeyWords(e.target.value);
    if (keywords === '') {
      setShowAllStocks(true);
    } else {
      setShowAllStocks(false);
    }
    const response = await api(
      `stocks?query=${keywords}&limit=${10}&offset=${2}`,
      'GET'
    );
    const stockResults = response.map(function (item, idx) {
      return (
        <li key={idx} onMouseDown={() => onStockClick(item.symbol)}>
          {item.symbol} {item.name}
        </li>
      );
    });
    setStocks(stockResults);
  };

  const onStockClick = (symbol) => {
    setShowAllStocks(true);
    setShowDropDown(false);
    setKeyWords('');
    document.getElementById('searchBar').value = '';
    history.push(`/stockDetails/${symbol}`);
  };

  return (
    <nav class="navbar navbar-light bg-light justify-content-around align-items-center">
      <div id="homeButton" onClick={() => history.push('/')}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="20"
          fill="currentColor"
          class="bi bi-graph-up-arrow"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z"
          />
        </svg>
        <h5>UNSW finance</h5>
      </div>
      <form class="form-inline" onSubmit={(e) => e.preventDefault()}>
        <input
          id="searchBar"
          class="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          onBlur={() => setShowDropDown(false)}
          onFocus={onSearchFocus}
          onChange={(e) => onKeywordChange(e)}
          data-bs-toggle="collapse"
          data-bs-target="#stockList"
        />
        {showDropDown ? (
          showAllStocks ? (
            <ul
              id="stockList"
              class="dropdown-menu"
              aria-labelledby="dropdownMenuButton1"
            >
              <li onMouseDown={() => history.push('/stockList')}>
                Please tap here to search all stocks
              </li>
            </ul>
          ) : (
            <ul
              id="stockList"
              class="dropdown-menu"
              aria-labelledby="dropdownMenuButton1"
            >
              {stocks}
            </ul>
          )
        ) : null}
      </form>
      {isAuthenticated ? (
        [
          <>
            <button
              type="button"
              class="btn btn-outline-primary"
              data-bs-toggle="modal"
              data-bs-target="#importModal"
              onClick={() => setImportTrigger(!importTrigger)}
            >
              Import Portfolio
            </button>
            <ImportModal trigger={importTrigger} />
          </>,
          <div>
            <button
              type="button"
              class="btn btn-outline-danger"
              data-bs-toggle="modal"
              data-bs-target="#exportModal"
              onClick={() => setExportTrigger(!exportTrigger)}
            >
              Export Portfolio
            </button>
            <ExportModal trigger={exportTrigger} />
          </div>,
          <button
            type="button"
            class="btn btn-danger"
            onClick={() => handleLogout()}
          >
            Logout
          </button>,
          <button
            type="button"
            class="btn btn-outline-dark"
            onClick={() => history.push('/account')}
          >
            Account
          </button>,
          <div>
            <svg
              id="notificationIcon"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-bell"
              viewBox="0 0 16 16"
              data-bs-toggle="modal"
              data-bs-target="#invitesModal"
              onClick={() => setExportTrigger(!exportTrigger)}
            >
              <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
            </svg>
            <InvitesModal />
          </div>,
        ]
      ) : (
        <button
          type="button"
          class="btn btn-outline-dark"
          onClick={() => history.push('/signIn')}
        >
          Sign in
        </button>
      )}
    </nav>
  );
}

export default NavBar;
