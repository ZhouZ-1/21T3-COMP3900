import React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { useHistory } from 'react-router';
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
import api from '../../api';
import moment from 'moment';
import Loader from '../Loader';
import NavBar from '../NavBar/';
import BalancePortfolio from '../BalancePortfolio';

const columns = [
  { field: 'holding_id', headerName: 'id', width: 100 },
  { field: 'symbol', headerName: 'Symbol', width: 125 },
  { field: 'value', headerName: 'Value', width: 120 },
  { field: 'qty', headerName: 'Quantity', width: 130 },
  { field: 'date', headerName: 'Date', width: 130 },
  { field: 'perform', headerName: 'Performance', width: 150 },
  { field: 'change_val', headerName: 'Changes', width: 150 },
  { field: 'change_percent', headerName: 'Percentage', width: 150 },
];

function PortfolioPage() {
  var history = useHistory();
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDS, setOpenDS] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [qty, setQty] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [select, setSelect] = useState([]);
  const [balance, setBalance] = useState(0);

  const [userName, setUserName] = useState('');
  const [openCollaborativeModal, setOpenCollaborativeModal] = useState(false);
  const [openParticipantsModal, setOpenParticipantsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [overall, setOverall] = useState([]);
  const [isPortfolioOwner, setIsPortfolioOwner] = useState(false);
  const [participants, setParticipants] = useState(
    <li class="list-group-item list-group-item-action">
      ...Loading Participants...
    </li>
  );

  const portfolio_id = sessionStorage.getItem('id');
  const token = sessionStorage.getItem('token');

  const onRemoveParticipants = async (sharingId) => {
    await api('collaborate/revoke-permission', 'DELETE', {
      token: token,
      sharing_id: sharingId,
    });
    //  Assuming the user's status is no longer accepted (ex, reject or pending)
    const participants = await getParticipants();
    setParticipants(participants);
  };
  useEffect(async () => {
    setIsLoading(true);
    let newData = [];

    const data = await api(
      `invested_performance/portfolio?portfolio=${portfolio_id}`,
      'GET'
    );
    await api('portfolio/holdings', 'POST', {
      token: token,
      portfolio_id: portfolio_id,
    }).then((res) => {
      setOverall(
        data.symbols.filter((c) => {
          if (c.symbol != 'overall') return c;
        })
      );
      const overall = data.symbols.filter((c) => {
        if (c.symbol == 'overall') return c;
      });

      res.map((s) => {
        const changes = data.symbols.filter((c) => {
          if (c.symbol == s.symbol) return c;
        })[0];
        newData.push({ id: s.holding_id, ...s, ...changes });
      });
    });

    setStocks(newData);
    setIsLoading(false);

    const response = await api(`portfolio?token=${token}`, 'GET');
    let portfolios = response.portfolios;
    let isOwner = false;
    for (let index = 0; index < portfolios.length; index++) {
      if (portfolios[index].portfolio_id == portfolio_id) {
        isOwner = true;
      }
    }
    setIsPortfolioOwner(isOwner);
  }, [refresh]);

  useEffect(async () => {
    const participants = await getParticipants();
    setParticipants(participants);
  }, [isPortfolioOwner]);

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

  const getParticipants = async () => {
    if (isPortfolioOwner) {
      let allPortfolios = [];
      allPortfolios = await api(
        `collaborate/sharing-with-others?token=${token}`,
        'GET'
      );
      let currnetPortfolio = {};
      allPortfolios.map((portfolioInfo) => {
        if (portfolioInfo.portfolio_id == portfolio_id) {
          currnetPortfolio = portfolioInfo;
        }
      });
      let allParticipants = currnetPortfolio.shared_with || [];
      let activeParticipants = [];
      allParticipants.map((user) => {
        if (user.status == 'accepted') {
          activeParticipants.push([user.username, user.sharing_id]);
        }
      });
      const currentParticipants = activeParticipants.map(function (userInfo) {
        return (
          <li class="list-group-item list-group-item-action">
            <span>{userInfo[0]}</span>
            <svg
              id="reject"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              class="bi bi-dash-circle"
              viewBox="0 0 16 16"
              onClick={() => onRemoveParticipants(userInfo[1])}
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
            </svg>
          </li>
        );
      });
      if (currentParticipants.length === 0) {
        return (
          <li class="list-group-item list-group-item-action">
            You have no Participants in this portfolio.
          </li>
        );
      }
      return currentParticipants;
    }
  };

  const getCurrDate = () => {
    let curr = new Date();
    let date =
      curr.getDate() + '/' + (curr.getMonth() + 1) + '/' + curr.getFullYear();
    return date;
  };

  const searchStock = async (s) => {
    let value = -1;
    const res = await api(`stocks/search`, 'POST', { symbol: s });
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
      alert('Missing Symbol/Quantity field.');
      handleCloseAdd();
      return;
    }

    if (!value) {
      alert('Stock Symbol not exist.');
      handleCloseAdd();
      return;
    }

    if (qty < 1) {
      alert('Quantity cannot be less than 1.');
      return;
    }

    const res = await api('portfolio/holdings/add', 'POST', {
      token: token,
      portfolio_id: portfolio_id,
      symbol: symbol.toUpperCase(),
      value: value,
      qty: qty,
      type: 'buy',
      brokerage: '9.95',
      exchange: 'NYSE',
      date: date,
      currency: 'USD',
    });

    if (res.is_success) {
      alert('Successfully Add Stock!');
      setRefresh((r) => r + 1);
    }
    handleCloseAdd();
    setIsLoading(false);
  };

  const deleteStock = async () => {
    setIsLoading(true);

    if (select.length == 0) {
      alert('You have not select any stocks.');
      return;
    }

    Promise.all(
      select.map((id) => {
        const res = api('portfolio/holdings/delete', 'DELETE', {
          token: token,
          holding_id: id,
        });
      })
    ).then((res) => {
      if (res !== undefined) {
        alert('Successfully Delete Stock(s)!');
        setRefresh((r) => r + 1);
        setIsLoading(false);
      }
    });
    handleCloseDS();
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await api('portfolio/delete', 'DELETE', {
      token: token,
      portfolio_id: portfolio_id,
    });

    if (res) {
      alert('Successfully Delete The Portfolio.');
      sessionStorage.removeItem('id');
      history.push('/viewPortfolio');
    }
    setIsLoading(false);
    handleCloseDelete();
  };

  const onClickShare = async () => {
    const response = await api('collaborate/send', 'POST', {
      token: token,
      username: userName,
      portfolio_id: portfolio_id,
    });
    setOpenCollaborativeModal(false);
    return;
  };
  const handleOpenCollaborativeModal = () => {
    setOpenCollaborativeModal(true);
  };

  const handleCloseCollaborativeModal = () => {
    setOpenCollaborativeModal(false);
  };

  const handleOpenParticipantsModal = () => {
    setOpenParticipantsModal(true);
  };

  const handleCloseParticipantsModal = () => {
    setOpenParticipantsModal(false);
  };

  return (
    <div>
      <NavBar></NavBar>
      <div>
        <h1>
          Portfolio: {sessionStorage.getItem('name')}
          {!isLoading && (
            // <button class='btn btn-lg btn-link btn-block' onClick={handleOverview}>Portfolio Balance</button>
            <Link
              to={{
                pathname: '/portfolioBalance',
                state: { detail: overall },
              }}
            >
              Portfolio Balance
            </Link>
          )}
        </h1>
        <br></br>
        <div>
          <Button
            class="btn btn-outline-primary ms-5"
            onClick={handleClickOpenAdd}
          >
            Add Stock
          </Button>
          <Dialog
            open={openAdd}
            onClose={handleCloseAdd}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'Add Stock'}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Please Enter the Symbol of Stock:
              </DialogContentText>
              <TextField
                id="demo-helper-text-misaligned-no-helper"
                label="symbol"
                required
                onChange={(evt) => setSymbol(evt.target.value)}
              ></TextField>
              <TextField
                id="demo-helper-text-misaligned-no-helper"
                label="Quantity"
                required
                onChange={(evt) => setQty(evt.target.value)}
              ></TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAdd}>Cancel</Button>
              <Button onClick={addStock} autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
          <Button
            class="btn btn-outline-primary ms-5"
            onClick={handleClickOpenDS}
          >
            Delete Stock
          </Button>
          <Dialog
            open={openDS}
            onClose={handleCloseDS}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{'Delete Stock'}</DialogTitle>
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
          {isPortfolioOwner && (
            <>
              <Button
                class="btn btn-outline-primary ms-5"
                onClick={handleOpenCollaborativeModal}
              >
                Share this portfolio
              </Button>
              <Dialog
                open={openCollaborativeModal}
                onClose={handleCloseCollaborativeModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  Collaborative Portfolio
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Please type in user's name you want to share it with
                  </DialogContentText>
                  <TextField
                    id="demo-helper-text-misaligned-no-helper"
                    label="user name"
                    required
                    onChange={(evt) => setUserName(evt.target.value)}
                  ></TextField>
                </DialogContent>
                <DialogActions>
                  <Button onClick={onClickShare}>Share</Button>
                  <Button onClick={handleCloseCollaborativeModal}>
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}

          {isPortfolioOwner && (
            <>
              <Button
                class="btn btn-outline-primary ms-5"
                onClick={handleOpenParticipantsModal}
              >
                participants
              </Button>
              <Dialog
                open={openParticipantsModal}
                onClose={handleCloseParticipantsModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">Participants</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    {participants}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseParticipantsModal}>Cancel</Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </div>
        <br></br>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        {isLoading && <Loader></Loader>}
        {!isLoading && (
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
        )}
      </div>
      <div>
        {isPortfolioOwner && (
          <>
            <Button onClick={handleClickOpenDelete}>Delete Portfolio</Button>
            <Dialog
              open={openDelete}
              onClose={handleCloseDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                'Delete Portfolio'
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Do You Want To Delete This Portfolio?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDelete}>Cancel</Button>
                <Button onClick={handleDelete} autoFocus>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </div>
    </div>
  );
}

export default PortfolioPage;
