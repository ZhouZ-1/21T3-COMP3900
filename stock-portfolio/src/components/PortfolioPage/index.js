import React from 'react';
import { Component } from 'react';
import { render } from 'react-dom';
import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { 
    Button,  
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from "../../api";
import DeletePortfolio from "../DeletePortfolio";
import EditPortfolio from "../EditPortfolio";
// import moment from "moment";

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'symbol', headerName: 'Symbol', width: 130 },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.getValue(params.id, 'name') || ''} ${
        params.getValue(params.id, 'symbol') || ''
      }`,
  },
  {
    field: 'qty',
    headerName: 'Quantity',
    type: 'number',
    width: 90,
  },
];

const rows = [
  { id: 1, symbol: 'STX', name: 'Seagate Technology PLC', qty: 35 },      // buy price, balance, market price
  { id: 2, symbol: 'DFS', name: 'DIscover Financial Services', qty: 42 },
  { id: 3, symbol: 'LSTR', name: 'Landstar System Inc', qty: 45 },
  { id: 4, symbol: 'SWKS', name: 'Skyworks Solutions Inc', qty: 16 },
  { id: 5, symbol: 'SNPS', name: 'Synopsys Inc', qty: 133 },
  { id: 6, symbol: 'NSC', name: 'Norfolk Southern Corporation', qty: 150 },
  { id: 7, symbol: 'CSCO', name: 'Cisco Systems', qty: 44 },
  { id: 8, symbol: 'VIAV', name: 'Viavi Solutions Inc', qty: 36 },
  { id: 9, symbol: 'ROST', name: 'Ross Stores Inc', qty: 65 },
];

function PortfolioPage() {
  var history = useHistory();
  const [open, setOpen] = useState(false);
  const [title,setTitle] = useState('');
  const [stock, setStock] = useState([]);
  const [stockState, setStockState] = useState(false);
  const [isLoading,setIsLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchStock = useEffect(async() => {
    setIsLoading(true);
    const res = await api('portfolio/holdings', 'POST', {
      token: localStorage.getItem('token'), portfolio_id: localStorage.getItem('id')
    });

    if (res != undefined) {
        setStock(res.holdings);
        setStockState(true);
        setIsLoading(false);
    } 

  });

  // const getCurrentDate = () => {
  //   let currentDate = new Date();
  //   let date = currentDate.getFullYear() + '-' + (currentDate.getMonth()+1) + '-' + currentDate.getDate() +' '+ currentDate.getHours()+':'+ currentDate.getMinutes()+':'+ currentDate.getSeconds();
  //   return {date};
  // };

  const addStock = useEffect(async() => {
    setIsLoading(true);
    const res = await api('portfolio/holdings/add', 'POST', {
      token: localStorage.getItem('token'), 
      holding_id: localStorage.getItem('id'),
      symbol: "TSLA",
      value: "1.1",
      qty: "1.1",
      type: "buy",
      brokerage: "9.95",
      exchange: "NYSE",
      date: "10/10/2021",
      // date: `${getCurrentDate}`,
      currency: "USD"
    });

    if (res != undefined) {
        setStock(res.holdings);
        setStockState(true);
        setIsLoading(false);
    } 

  });

  const deleteStock = useEffect(async() => {
    setIsLoading(true);
    const res = await api('portfolio/holdings/delete', 'DELETE', {
      token: localStorage.getItem('token'), 
      holding_id: localStorage.getItem('id')
    });

    if (res != undefined) {
        setStock(res.holdings);
        setStockState(true);
        setIsLoading(false);
    } 

  });

  return (
    <div onClick={fetchStock}>
      <div>
        <p3>Portfolio</p3>
        <EditPortfolio/>
        <Button class="btn btn-outline-primary ms-5" onClick="addStock">Add Stock</Button>
        <Button class="btn btn-outline-primary ms-5" onClick="deleteStock">Delete Stock</Button>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          punitsSize={5}
          rowsPerPunitsOptions={[5]}
          checkboxSelection
        />
      </div>
      <DeletePortfolio/>
    </div>
  );
}

export default PortfolioPage;