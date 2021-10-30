import * as React from 'react';
import { useState,useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import NavBar from '../NavBar';
import getRows from './getRows';
import api from '../../api';
import PortfolioModal from './PortfolioModal';

function WatchList() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'code', headerName: 'Stock Code', width: 200 },
    { field: 'name', headerName: 'Stock Name', width: 200 }
  ];

  const [rows,setRows] = useState([
      { id: 0, code: 'N/A', name: 'RENDERING WATCHLIST.... PLEASE WAIT'}
  ]);
  const [select, setSelection] = useState([]);
  
  useEffect(async ()=>{
    const row2 = await getRows(localStorage.getItem('token'));
    setRows(row2);
  },[]);

  const onDeleteClick = async () => {
    let stockToRemove = [];
    rows.map((item)=>{
      select.map((idx)=>{
        if(idx === item.id){
          stockToRemove.push(item.code);
        }
      })
    });
    const newRows = rows.filter(item=> !select.includes(item.id));
    await api('watchlist/delete','DELETE',{
      token: localStorage.getItem('token'),
      stocks: stockToRemove
    });
    setRows(newRows);
  }
  return (
    <>
      <NavBar></NavBar>
      <div>
        <div>
          <p3>Watchlist</p3>
          <button type="button" class="btn btn-outline-primary ms-5" onClick={onDeleteClick}>Delete Stock</button>
          <button type="button" class="btn btn-outline-primary ms-5" data-bs-toggle="modal" data-bs-target="#portfolioModal">
            Move stocks to portfolio
          </button>
          <PortfolioModal/>
        </div>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            punitsSize={5}
            rowsPerPunitsOptions={[5]}
            checkboxSelection
            onSelectionModelChange={(ids) => setSelection(ids)}
          />
        </div>
        
        <div class="btn-group-vertical">
          ...
        </div>
        
      </div>      
    </>
  );
}

export default WatchList;
