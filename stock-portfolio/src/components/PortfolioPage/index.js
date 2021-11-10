import React from 'react'
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { useHistory } from 'react-router'
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import api from '../../api'
import moment from 'moment'
import Loader from '../Loader'
import NavBar from '../NavBar/'
import BalancePortfolio from '../BalancePortfolio'

const columns = [
  // { field: 'holding_id', headerName: 'id', width: 100 },
  { field: 'symbol', headerName: 'Symbol', width: 125 },
  { field: 'value', headerName: 'Value', width: 120 },
  { field: 'qty', headerName: 'Quantity', width: 130 },
  { field: 'date', headerName: 'Date', width: 130 },
  { field: 'change_val', headerName: 'Changes', width: 150 },
  { field: 'change_percent', headerName: 'Percentage', width: 150 }
]

function PortfolioPage () {
  var history = useHistory()
  const [openDelete, setOpenDelete] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [openDS, setOpenDS] = useState(false)
  const [symbol, setSymbol] = useState('')
  const [qty, setQty] = useState(0)
  const [stocks, setStocks] = useState([])
  const [select, setSelect] = useState([])
  const [balance, setBalance] = useState(0)

  const [userName, setUserName] = useState('')
  const [openCollaborativeModal, setOpenCollaborativeModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const [overall, setOverall] = useState([])

  useEffect(
    async () => {
      setIsLoading(true)
      let newData = []

      const data = await api(
        `invested_performance/portfolio?portfolio=${localStorage.getItem(
          'id'
        )}`,
        'GET'
      )
      await api('portfolio/holdings', 'POST', {
        token: localStorage.getItem('token'),
        portfolio_id: localStorage.getItem('id')
      }).then(res => {
        setOverall(
          data.symbols.filter(c => {
            if (c.symbol != 'overall') return c
          })
        )
        const overall = data.symbols.filter(c => {
          if (c.symbol == 'overall') return c
        })

        res.map(s => {
          const changes = data.symbols.filter(c => {
            if (c.symbol == s.symbol) return c
          })[0]
          newData.push({ id: s.holding_id, ...s, ...changes })
        })
      })

      setStocks(newData)
      setIsLoading(false)
    },
    [refresh]
  )

  const handleClickOpenAdd = () => {
    setOpenAdd(true)
  }

  const handleCloseAdd = () => {
    setOpenAdd(false)
  }

  const handleClickOpenDS = () => {
    setOpenDS(true)
  }

  const handleCloseDS = () => {
    setOpenDS(false)
  }

  const handleClickOpenDelete = () => {
    setOpenDelete(true)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  const getCurrDate = () => {
    let curr = new Date()
    let date =
      curr.getDate() + '/' + (curr.getMonth() + 1) + '/' + curr.getFullYear()
    return date
  }

  const searchStock = async s => {
    let value = -1
    const res = await api(`stocks/search`, 'POST', { symbol: s })
    if (res.price) {
      return res.price
    }
    return value
  }

  const addStock = async () => {
    setIsLoading(true)
    const date = getCurrDate()
    const value = await searchStock(symbol)
    // let value = await searchStock(symbol);

    if (!(symbol && qty)) {
      alert('Missing Symbol/Quantity field.')
      handleCloseAdd()
      return
    }

    if (qty < 1) {
      alert('Quantity cannot be less than 1.')
      return
    }

    if (value != -1) {
      const res = await api('portfolio/holdings/add', 'POST', {
        token: localStorage.getItem('token'),
        portfolio_id: localStorage.getItem('id'),
        symbol: symbol.toUpperCase(),
        value: value,
        qty: qty,
        type: 'buy',
        brokerage: '9.95',
        exchange: 'NYSE',
        date: date,
        currency: 'USD'
      })
      if (res.is_success) {
        alert('Successfully Add Stock!')
        setRefresh(r => r + 1)
      }
    } else {
      alert('Stock Symbol not exist.')
    }

    handleCloseAdd()
    setIsLoading(false)
  }

  const deleteStock = async () => {
    setIsLoading(true)

    if (select.length == 0) {
      alert('You have not select any stocks.')
      return
    }

    Promise.all(
      select.map(id => {
        const res = api('portfolio/holdings/delete', 'DELETE', {
          token: localStorage.getItem('token'),
          holding_id: id
        })
      })
    ).then(res => {
      if (res !== undefined) {
        alert('Successfully Delete Stock(s)!')
        setRefresh(r => r + 1)
        setIsLoading(false)
      }
    })
    handleCloseDS()
  }

  const handleDelete = async () => {
    setIsLoading(true)
    const res = await api('portfolio/delete', 'DELETE', {
      token: localStorage.getItem('token'),
      portfolio_id: localStorage.getItem('id')
    })

    if (res) {
      alert('Successfully Delete The Portfolio.')
      localStorage.removeItem('id')
      history.push('/viewPortfolio')
    }
    setIsLoading(false)
    handleCloseDelete()
  }

  const onClickShare = () => {
    // TODO: Call api call here when it is ready from the backend
  }
  const handleOpenCollaborativeModal = () => {
    setOpenCollaborativeModal(true)
  }

  const handleCloseCollaborativeModal = () => {
    setOpenCollaborativeModal(false)
  }

  return (
    <div>
      <NavBar />
      <div>
        <h1>
          Portfolio: {localStorage.getItem('name')}
          {!isLoading && (
            // <button class='btn btn-lg btn-link btn-block' onClick={handleOverview}>Portfolio Balance</button>
            <Link
              to={{
                pathname: '/portfolioBalance',
                state: { detail: overall }
              }}
            >
              Portfolio Balance
            </Link>
          )}
        </h1>
        <br />
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
                onChange={evt => setSymbol(evt.target.value)}
              />
              <TextField
                id="demo-helper-text-misaligned-no-helper"
                label="Quantity"
                required
                onChange={evt => setQty(evt.target.value)}
              />
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
                onChange={evt => setUserName(evt.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onClickShare}>Share</Button>
              <Button onClick={handleCloseCollaborativeModal}>Cancel</Button>
            </DialogActions>
          </Dialog>
        </div>
        <br />
      </div>
      <div style={{ height: 400, width: '100%' }}>
        {isLoading && <Loader />}
        {!isLoading && (
          <DataGrid
            rows={stocks}
            columns={columns}
            pagination
            checkboxSelection
            pageSize={7}
            rowCount={100}
            // paginationMode="server"
            onSelectionModelChange={newModel => {
              setSelect(newModel)
            }}
            selectionModel={select}
          />
        )}
      </div>
      <div>
        <Button onClick={handleClickOpenDelete}>Delete Portfolio</Button>
        <Dialog
          open={openDelete}
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {'Delete Portfolio'}
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
      </div>
    </div>
  )
}

export default PortfolioPage
