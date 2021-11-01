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

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'symbol', headerName: 'Symbol', width: 130 },
  { field: 'value', headerName: 'Value', width: 90, type: 'number' },
  { field: 'qty', headerName: 'Quantity', width: 90, type: 'number' },
  { field: 'date', headerName: 'Date', width: 130 }
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
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDS, setOpenDS] = useState(false);
  const [title,setTitle] = useState('');
  const [symbol,setSymbol] = useState([]);
  const [stock, setStock] = useState([]);
  const [stockState, setStockState] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [keywords,setKeyWords] = useState('');
  const [showAllStocks,setShowAllStocks] = useState(true);
  const [stocks, setStocks] = useState();
  const [showDropDown,setShowDropDown] = useState(false);

  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
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


  useEffect(() => {
    setIsLoading(true);
    api('portfolio/holdings', 'POST', {
      token: localStorage.getItem('token'), portfolio_id: localStorage.getItem('id')
    })
      .then(res => {
        if (res) {
          setStock(res.holdings);
          if (res.holdings !== []) {
              setStockState(true);
          }
        } 
      })
    setIsLoading(false);
  }, []);

  const handleEdit = async () => {
    if (title !== '') {
      const res = await api('portfolio/edit', 'POST', {
        token: localStorage.getItem('token'), 
        portfolio_name: title, 
        portfolio_d: localStorage.getItem('id')
      }); 
      if (!res) {
        alert(res);
      } else if (res.is_success) {
        alert("Successfully Update Your Portfolio Name!");
      } 
    }
    handleCloseEdit();
  };

  const getCurr = () => {
    let curr = new Date();
    let date = curr.getFullYear() + '/' + (curr.getMonth()+1) + '/' + curr.getDate();
    console.log(`date: ${date}`);
    return date;
  };

  const findAddStock = async () => {
    if(keywords === ''){
      setShowAllStocks(true);
    }
  }

  const onSearchFocus = () => {
    setShowDropDown(true);
  }

  const onKeywordChange = async (e) => {
    setKeyWords(e.target.value);
    if (keywords === ''){
      setShowAllStocks(true);
    }else{
      setShowAllStocks(false);
    }
    const response = await api(`stocks?query=${keywords}&limit=${10}&offset=${2}`,'GET');
    const stockResults = response.map(function(item,idx){
      return <li key={idx} onMouseDown={() => onStockClick(item.symbol)}>{item.symbol} {item.name}</li>;
    });
    setStocks(stockResults);
  }

  const onStockClick = (symbol) => {
    setShowAllStocks(true);
    setShowDropDown(false);
    setKeyWords('');
    document.getElementById("searchBar").value = '';
    alert(`/stockDetails/${symbol}`);
  }

  const addStock = async () => {
    setIsLoading(true);
    findAddStock();
    const res = await api('portfolio/holdings/add', 'POST', {
      token: localStorage.getItem('token'), 
      holding_id: localStorage.getItem('id'),
      symbol: "TSLA",
      value: "1.1",
      qty: "1.1",
      type: "buy",
      brokerage: "9.95",
      exchange: "NYSE",
      // date: "10/10/2021",
      date: `${getCurr}`,
      currency: "USD"
    });

    if (res !== undefined) {
        setStock(res.holdings);
        setStockState(true);
        setIsLoading(false);
    } 

  };

  const selectRows = (e) => {
    // // prints correct indexes of selected rows
    // console.log(e.selectionModel);
    
    // // missing the first row selected
    // setSelection(e.selectionModel);
    console.log(e);
    // const isSelected = e.selectionModel.includes(stock.id);
    // console.log(isSelected, e.selectionModel);


    // return 
    // const selectedSym = new 
    // Array(ids);
    // const selectedRowData = rows.filter((row) =>
    //   selectedSym.has(row.id.toString());
    // );
    // console.log(`Symbol: ${selectedRowData}`);
  };
  
  const deleteStock = async () => {
    const res = await api('portfolio/holdings/delete', 'DELETE', {
      token: localStorage.getItem('token'), 
      holding_id: localStorage.getItem('id')
    });

    if (res !== undefined) {
        setStock(res.holdings);
        setStockState(true);
        setIsLoading(false);
    } 

  };

  const handleDelete = async () => {
    if (title !== '') {
        setIsLoading(true);
        const res = await api('portfolio/delete', 'DELETE', {
          token: localStorage.getItem('token'), portfolio_id: localStorage.getItem('id')
        });
    
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
          <Button class="btn btn-outline-primary ms-5" onClick={handleClickOpenEdit}>
            Edit Name
          </Button>
          <Dialog
              open={openEdit}
              onClose={handleCloseEdit}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
              <DialogTitle id="alert-dialog-title">
              {"Edit Porfolio"}
              </DialogTitle>
              <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  Please update the title of Portfolio:
              </DialogContentText>
              <TextField id="demo-helper-text-misaligned-no-helper" label="Title" required onChange={(evt)=>setTitle(evt.target.value)}></TextField>
              </DialogContent>
              <DialogActions>
              <Button onClick={handleCloseEdit}>Cancel</Button>
              <Button onClick={handleEdit} autoFocus>
                  Confirm
              </Button>
              </DialogActions>
          </Dialog>

          <Button class="btn btn-outline-primary ms-5" onClick={addStock}>Add Stock</Button>
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
                <form class="form-inline" onSubmit={(e) => e.preventDefault()}>
                  <input id="searchBar" class="form-control me-2" type="search" placeholder="Search" aria-label="Search" onBlur={()=>setShowDropDown(false)} onFocus={onSearchFocus} onChange={(e) => onKeywordChange(e)} data-bs-toggle="collapse" data-bs-target="#stockList" aria-expanded="false"/>
                    {showDropDown ? (
                      showAllStocks ? (
                        <ul id = "stockList" class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                          <li onMouseDown={() => history.push('/stockList')}>Please tap here to search all stocks</li>
                        </ul>):(
                        <ul id = "stockList" class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                          {stocks}
                        </ul>
                        )
                    ):(null)
                  }
          </form>

              </DialogContent>
              <DialogActions>
              <Button onClick={handleCloseAdd}>Cancel</Button>
              <Button onClick={addStock} autoFocus>
                  Confirm
              </Button>
              </DialogActions>
          </Dialog>

          <Button class="btn btn-outline-primary ms-5" onClick={deleteStock}>Delete Stock</Button>
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
                  Do you want to Delete These stock(s)?
              </DialogContentText>
              <TextField id="demo-helper-text-misaligned-no-helper" label="Title" required onChange={(evt)=>setTitle(evt.target.value)}></TextField>
              </DialogContent>
              <DialogActions>
              <Button onClick={handleCloseDS}>Cancel</Button>
              <Button onClick={deleteStock} autoFocus>
                  Confirm
              </Button>
              </DialogActions>
          </Dialog>
        </div>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          // rows={stock}
          rows={rows}
          columns={columns}
          punitsSize={5}
          rowsPerPunitsOptions={[5]}
          checkboxSelection
          onSelectionModelChange={selectRows}
        />
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