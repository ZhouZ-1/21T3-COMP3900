import React from 'react';
// import { Component } from 'react';
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
import moment from "moment";
import Loader from "../Loader";

const columns = [
  { field: 'id', headerName: 'id', width: 100 },
  { field: 'symbol', headerName: 'Symbol', width: 125 },
  { field: 'value', headerName: 'Value', width: 120 },
  { field: 'qty', headerName: 'Quantity', width: 130 },
  { field: 'date', headerName: 'Date', width: 130 }
];

const rows = [
  // { id: 1, symbol: 'STX', name: 'Seagate Technology PLC', qty: 35 },      // buy price, balance, market price
  // { id: 2, symbol: 'DFS', name: 'DIscover Financial Services', qty: 42 },
  // { id: 3, symbol: 'LSTR', name: 'Landstar System Inc', qty: 45 },
  // { id: 4, symbol: 'SWKS', name: 'Skyworks Solutions Inc', qty: 16 },
  // { id: 5, symbol: 'SNPS', name: 'Synopsys Inc', qty: 133 },
  // { id: 6, symbol: 'NSC', name: 'Norfolk Southern Corporation', qty: 150 },
  // { id: 7, symbol: 'CSCO', name: 'Cisco Systems', qty: 44 },
  // { id: 8, symbol: 'VIAV', name: 'Viavi Solutions Inc', qty: 36 },
  // { id: 9, symbol: 'ROST', name: 'Ross Stores Inc', qty: 65 },
];

function PortfolioPage() {
  var history = useHistory();
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDS, setOpenDS] = useState(false);
  const [symbol,setSymbol] = useState('');
  const [qty,setQty] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [select, setSelect] = useState([]);
  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let arr = [];
    api('portfolio/holdings', 'POST', {
      token: localStorage.getItem('token'), portfolio_id: localStorage.getItem('id')
    })
      .then(res => {
        if (res) {
          res.map(s => {
            let fil = [];
            fil['id'] = s.holding_id;
            fil['symbol'] = s.symbol;
            fil['value'] = s.value;
            fil['qty'] = s.qty;
            fil['date'] = s.date;
            arr.push(fil);
          })
          setStocks(arr);
        } 
      })
    setIsLoading(false);
  }, []);

  const handleClickOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleClickOpenDS = () => {
    setOpenDS(true);
  };

  const handleCloseDS = () => {
    setOpenDS(false);
  };

  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };


  const getCurrDate = () => {
    let curr = new Date();
    let date = curr.getDate() + '/' + (curr.getMonth()+1) + '/' + curr.getFullYear();
    return date;
  };
  
  const searchStock = async(s) => {
    let value = -1;
    const res = await api(`stocks/search`, 'POST', {symbol: s}); 
    if (res.price) {
      return res.price;
    } 
    return value;
  };
  
  const addStock = async () => {
    setIsLoading(true);
    const date = getCurrDate();
    const value = await searchStock(symbol);

    if (!(symbol && qty)) {
      alert("Missing Symbol/Quantity field.");
      handleCloseAdd();
      return;
    }

    if (value == -1) {
      alert("Stock Symbol not exist.");
      handleCloseAdd();
      return;
    }

    const res = await api('portfolio/holdings/add', 'POST', {
      token: localStorage.getItem('token'), 
      portfolio_id: localStorage.getItem('id'),
      symbol: symbol,
      value: value,
      qty: qty,
      type: "buy",
      brokerage: "9.95",
      exchange: "NYSE",
      date: date,
      currency: "USD"
    });

    // console.log(`${value}, res: ${res}`);
    if (res.is_success) {
        alert("Successfully Add Stock!");
        history.push(`/portfolio/${localStorage.getItem('id')}`);
    } 
    history.push(`/portfolio/${localStorage.getItem('id')}`);
    handleCloseAdd();
    setIsLoading(false);
  };
  
  // const selectRows = (select) => {
  //   console.log(`sleect: ${select}`);
  //   let arr = [];
  //   select.map(s => {
  //     arr.push(s);
  //   })
  //   setStocks(arr);
  //   console.log(`arr: ${stocks}`);
  // };

  const deleteStock = async () => {
    setIsLoading(true);

    if (select.length == 0) {
      alert("You have not select any stocks.");
      return;
    }

    Promise.all(select.map((id) => {
      const res = api('portfolio/holdings/delete', 'DELETE', {
        token: localStorage.getItem('token'), 
        holding_id: id
      })
    }))
      .then(res => {
        if (res !== undefined) {
          alert("Successfully Delete Stock(s)!");
          setIsLoading(false);
        }});
    handleCloseDS();
  };

  const handleDelete = async () => {
    if (symbol !== '') {
        setIsLoading(true);
        const res = await api('portfolio/delete', 'DELETE', {
          token: localStorage.getItem('token'), portfolio_id: localStorage.getItem('id')
        });
        // console.log(res);
        if (res) {
          localStorage.removeItem('id');
          alert("Successfully Delete The Portfolio.");
          history.push('/viewPortfolio');
        }
    } 
    handleCloseDelete();
  };

  return (
    <div>
      <div>
        <h1>Portfolio Page</h1>
        <br></br>
        <div>
          <Button class="btn btn-outline-primary ms-5" onClick={handleClickOpenAdd}>Add Stock</Button>
          <Dialog
              open={openAdd}
              onClose={handleCloseAdd}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
              <DialogTitle id="alert-dialog-title">
              {"Add Stock"}
              </DialogTitle>
              <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  Please Enter the Symbol of Stock:
              </DialogContentText>
              <TextField id="demo-helper-text-misaligned-no-helper" label="symbol" required onChange={(evt)=>setSymbol(evt.target.value)}></TextField>
              <TextField id="demo-helper-text-misaligned-no-helper" label="Quantity" required onChange={(evt)=>setQty(evt.target.value)}></TextField>
              </DialogContent>
              <DialogActions>
              <Button onClick={handleCloseAdd}>Cancel</Button>
              <Button onClick={addStock} autoFocus>
                  Confirm
              </Button>
              </DialogActions>
          </Dialog>

          <Button class="btn btn-outline-primary ms-5" onClick={handleClickOpenDS}>Delete Stock</Button>
          <Dialog
              open={openDS}
              onClose={handleCloseDS}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
              <DialogTitle id="alert-dialog-title">
              {"Delete Stock"}
              </DialogTitle>
              <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Do You Want To Delete These Stock(s)?
              </DialogContentText>
              </DialogContent>
              <DialogActions>
              <Button onClick={handleCloseDS}>Cancel</Button>
              <Button onClick={deleteStock} autoFocus>
                  Confirm
              </Button>
              </DialogActions>
          </Dialog>
        </div>
        <br></br>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={stocks}
          columns={columns}
          pagination
          checkboxSelection
          pageSize={7}
          rowCount={100}
          // paginationMode="server"
          onSelectionModelChange={(newModel) => {
            setSelect(newModel);
          }}
          selectionModel={select}
        />
        { isLoading &&
          (<Loader></Loader>)
          }
      </div>
      <div>
        <Button onClick={handleClickOpenDelete}>
          Delete Portfolio
        </Button>
        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
              {"Delete Portfolio"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Do You Want To Delete This Portfolio?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDelete} autoFocus>
              <Button onClick={handleCloseDelete}>Cancel</Button>
                Confirm
              </Button>
            </DialogActions>
        </Dialog>
        </div>
    </div>
  );
}

export default PortfolioPage;

