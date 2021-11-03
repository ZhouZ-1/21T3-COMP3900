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
import {
    List,
    ListItem,
    ListItemText,
    ListSubheader
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import api from "../../api";
import moment from "moment";
import Loader from "../Loader";


const columns = [
  // { field: 'id', headerName: 'id', width: 100 },
  { field: 'symbol', headerName: 'Symbol', width: 125 },
  { field: 'value', headerName: 'Value', width: 120 },
  { field: 'qty', headerName: 'Quantity', width: 130 },
  { field: 'date', headerName: 'Date', width: 130 },
  { field: 'change_percent', headerName: 'Changes', width: 250 }
];

function PortfolioPage() {
  var history = useHistory();
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDS, setOpenDS] = useState(false);
  const [symbol,setSymbol] = useState('');
  const [qty,setQty] = useState(0);
  const [stocks, setStocks] = useState([
    { id: 0, symbol: 'RENDERING', value: '....', qty: 'PLEASE WAIT', date: 'N/A'}
  ]);
  const [select, setSelect] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isLoading,setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [performance, setPerformance] = useState([]);
  const [performS, setPerformS] = useState(true);


  useEffect(async() => {
    setIsLoading(true);
    let arr = [];

    api('portfolio/holdings', 'POST', {
      token: localStorage.getItem('token'), portfolio_id: localStorage.getItem('id')
    })
      .then(async(res) => {
        if (res) {
          const change = await api(`invested_performance?token=${localStorage.getItem('token')}`, 'GET');
          console.log(res);

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
    stockPerform();
    setIsLoading(false);
  }, [refresh]);
      
  // const handleBalance = async () => {
  //   const res = await fetch(`http://localhost:5000/invested_performance?token=${localStorage.getItem('token')}`, {method: 'GET', mode: 'same-origin', headers: {"Content-Type": "application/json"}})
  //   .then((res) => res.json)
  //   .then((res) => {
  //     console.log(`res:${res}`); 
  //   })
  //   .catch((err) => console.warn(`API_ERROR: ${err.message}`));
    
  //   const res = await api(`invested_performance?${localStorage.getItem('token')}`, 'GET')
  //   // if (res) {
  //   console.log(`res:${res}`);  
  //       // setBalance(res.portfolios);
  //   // }
  // };

  // const handleBalance = async () => {
  //   const res = await api('portfolio/summary', 'POST', {  
  //     token: localStorage.getItem('token'), 
  //     portfolio_id: localStorage.getItem('id')
  //   })  
  //   console.log(res);
  //   // Promise.all(res.holdings.map(async(s) => {
  //   //   let price = await searchStock(s.symbol);
  //   //   if (price){
  //   //     const curr = (price - s.average_price) * s.qty;
  //   //     sum += curr;
  //   //     console.log(price, s.average_price, s.qty);
  //   //   }
  //   // }));
  //   // setBalance(sum);
  //   return res.summary;
  // };
  const stockPerform = async() => {
    setIsLoading(true);
    let sum = 0;
    let rows = [];

    const res = await api('portfolio/summary', 'POST', {
      token: localStorage.getItem('token'), portfolio_id: localStorage.getItem('id')
    })
      .then(async(res) => {
        res.holdings.map(async(s) => {
          const curr = await searchStock(s.symbol);
          const b = (s.value - curr);
          sum += b;
          let temp = [];
          temp['symbol'] = s.symbol;
          temp['value'] = s.average_price;
          temp['qty'] = s.qty;
          temp['balance'] = b;
          temp['percentage'] = 
            Math.round((curr-s.average_price)/s.average_price);
        })
        setPerformance(rows);
        setBalance(sum);
        console.log('p', performance);
      })
    console.log(performance);
    setIsLoading(false);
  };

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
    if (res) {
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
        setRefresh(r => r +1);
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
          setRefresh(r => r +1);
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
          (<p>Balance: {balance}</p>)
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
            pageSize={10}
            rowsPerPageOptions={[5]}
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
      <div>
        <List
          // component="stockPerform"
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto',
            maxHeight: 300,
            '& ul': { padding: 0 },
          }}
          subheader={<li />}
        >
          {/* {performance.map((p) => ( */}
          {/* <li key={'Overall Profit'}> */}
          {performance.map((p) => (
            <ul>
              <li key={`Overall Balance-${balance}`}>
                <ListSubheader>{`${p.symbol}`}</ListSubheader>
                  <ListItem key={`item-${p.symbol}-${p.qty}`}>
                    <ListItemText primary={`Price ${p.average_price}`} />
                </ListItem>
              </li>
            </ul>
          ))}
          
          {/* ))} */}
        </List>
      </div>
    </div>
  );
}

export default PortfolioPage;




