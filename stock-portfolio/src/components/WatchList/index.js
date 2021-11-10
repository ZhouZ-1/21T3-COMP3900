import * as React from 'react';
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import NavBar from '../NavBar';
import getRows from './getRows';
import api from '../../api';
import PortfolioModal from './PortfolioModal';

function WatchList() {
  const token = sessionStorage.getItem('token');
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'code', headerName: 'Stock Code', width: 200 },
    { field: 'name', headerName: 'Stock Name', width: 200 },
    { field: 'price', headerName: 'Price', width: 200 },
    { field: 'change_percent', headerName: 'Daily changes', width: 250 },
  ];
  const initialRow = [
    {
      id: 0,
      code: 'N/A',
      name: 'RENDERING WATCHLIST.... PLEASE WAIT',
      price: 'Loading',
      change_percent: 'Loading',
    },
  ];
  const [rows, setRows] = useState(initialRow);
  const [selectedStocks, setSelectedStocks] = useState([]);

  useEffect(async () => {
    const newRow = await getRows(token);
    setRows(newRow);
  }, []);

  const onDeleteClick = async () => {
    let stockToRemove = [];
    rows.map((item) => {
      selectedStocks.map((idx) => {
        if (idx === item.id) {
          stockToRemove.push(item.code);
        }
      });
    });
    const newRows = rows.filter((item) => !selectedStocks.includes(item.id));
    await api('watchlist/delete', 'DELETE', {
      token: token,
      stocks: stockToRemove,
    });
    setRows(newRows);
  };

  const onMoveStocksClick = async () => {
    const newRow = await getRows(token);
    setRows(newRow);
  };
  return (
    <>
      <NavBar></NavBar>
      <div>
        <div>
          <p3>Watchlist</p3>
          <button
            type="button"
            class="btn btn-outline-primary ms-5"
            onClick={onDeleteClick}
          >
            Delete Stock
          </button>
          <button
            type="button"
            class="btn btn-outline-primary ms-5"
            data-bs-toggle="modal"
            data-bs-target="#portfolioModal"
          >
            Move stocks to portfolio
          </button>
          <PortfolioModal
            selectedStocks={selectedStocks}
            allStocks={rows}
            onProceedClick={onMoveStocksClick}
          />
        </div>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            punitsSize={5}
            rowsPerPunitsOptions={[5]}
            checkboxSelection
            onSelectionModelChange={(ids) => setSelectedStocks(ids)}
          />
        </div>
      </div>
    </>
  );
}

export default WatchList;
