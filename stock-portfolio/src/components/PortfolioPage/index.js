import React from 'react';
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
import fetchPortfolio from './fetchPortfolio';

const columns = [
  // { field: 'id', headerName: 'id', width: 100 },
  { field: 'symbol', headerName: 'Symbol', width: 125 },
  { field: 'value', headerName: 'Value', width: 120 },
  { field: 'qty', headerName: 'Quantity', width: 130 },
  { field: 'date', headerName: 'Date', width: 130 },
  { field: 'performance', headerName: 'Performance', width: 150 }
];

function PortfolioPage() {
  var history = useHistory();
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDS, setOpenDS] = useState(false);
  const [symbol,setSymbol] = useState('');
  const [qty,setQty] = useState(0);
  const [stocks, setStocks] = useState([
    { id: 0, symbol: 'N/A', value: 'N/A', qty: 'N/A', date: 'N/A', performance: 'RENDERING.... PLEASE WAIT'}
  ]);
  const [performance, setPerformance] = useState(0);
  const [select, setSelect] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isLoading,setIsLoading] = useState(false);

  useEffect(async() => {
    setIsLoading(true);
    const perform = await api(`invested_performance/portfolio?portfolio=${localStorage.getItem('id')}`, 'GET');
    // setPerformance(perform);
    console.log(perform);

    let rows = [];

    api('portfolio/holdings', 'POST', {
      token: localStorage.getItem('token'), portfolio_id: localStorage.getItem('id')
    })
      .then(res => {
        const price = handleBalance();

        if (res) {
          res.map(s => {
            rows.push({
              id: s.holding_id,
              symbol: s.symbol,
              value: s.value,
              qty: s.qty,
              date: s.date,
              performance: performance
            })
          })
          setStocks(rows);
        } 
      })

    setIsLoading(false);
  }, []);
      
  const handleBalance = async () => {
    const res = await api(`invested_performance?${localStorage.getItem('token')}`, 'GET')
    // if (res) {
    console.log(`res:${res}`);  
        // setBalance(res.portfolios);
    // }
  };

  // const handleBalance = async () => {
    // let sum = 0;
    // const res = await api('portfolio/summary', 'POST', {  
    //   token: localStorage.getItem('token'), 
    //   portfolio_id: localStorage.getItem('id')
    // })  
    // console.log(res);
    // Promise.all(res.holdings.map(async(s) => {
    //   let price = await searchStock(s.symbol);
    //   if (price){
    //     const curr = (price - s.average_price) * s.qty;
    //     sum += curr;
    //     console.log(price, s.average_price, s.qty);
    //   }
    // }));
    // setBalance(sum);
  // };

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

    if (qty < 1) {
      alert("Quantity cannot be less than 1.");
      return;
    }

    if (value != -1) {
      const res = await api('portfolio/holdings/add', 'POST', {
        token: localStorage.getItem('token'), 
        portfolio_id: localStorage.getItem('id'),
        symbol: symbol.toUpperCase(),
        value: value,
        qty: qty,
        type: "buy",
        brokerage: "9.95",
        exchange: "NYSE",
        date: date,
        currency: "USD"
      });

      if (res.is_success) {
        alert("Successfully Add Stock!");
        // const item = [symbol, value, qty, date, performance];
        // const s = stocks.push(item);
        // setStocks(s);
      } 
    } else {
      alert("Symbol is not valided");
    }

    handleCloseAdd();
    setIsLoading(false);
  };
  
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
          const newStocks = stocks.filter(item=> !select.includes(item.id));
          setStocks(newStocks);
        }});
    setIsLoading(false);
    handleCloseDS();
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await api('portfolio/delete', 'DELETE', {
      token: localStorage.getItem('token'), portfolio_id: localStorage.getItem('id')
    });

    if (res) {
      alert("Successfully Delete The Portfolio.");
      localStorage.removeItem('id');
      history.push('/viewPortfolio');
    }
    setIsLoading(false);
    handleCloseDelete();
  };

  return (
    <div>
      <div>
        <h1>Portfolio: {localStorage.getItem('name')}</h1>
        { !isLoading &&
          (<p onClick={handleBalance}>Balance: {balance}</p>)
          }
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
              <Button onClick={addStock} autoFocus>Confirm</Button>
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
              <Button onClick={deleteStock} autoFocus>Confirm</Button>
              </DialogActions>
          </Dialog>
        </div>
        <br></br>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        {!isLoading && 
          <DataGrid
            rows={stocks}
            columns={columns}
            pagination
            checkboxSelection
            pageSize={7}
            rowCount={100}
            onSelectionModelChange={(newModel) => {
              setSelect(newModel);
            }}
            selectionModel={select}
            />
        }
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
              <Button onClick={handleCloseDelete}>Cancel</Button>
              <Button onClick={handleDelete} autoFocus>Confirm</Button>
            </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default PortfolioPage;



