import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { List, ListItem, ListItemText } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import api from '../../api'
import NavBar from '../NavBar'
import Loader from '../Loader'

const columns = [
  { field: 'sharing_id', headerName: 'Sharing id', width: 150 },
  // { field: 'portfolio_id', headerName: 'Portfolio id', width: 150 },
  { field: 'portfolio_name', headerName: 'Portfolio', width: 150 },
  { field: 'owner', headerName: 'Owner', width: 130 }
]

function CollabList () {
  var history = useHistory()
  const [title, setTitle] = React.useState('')
  const [collabPort, setCollabPort] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(async () => {
    setIsLoading(true)
    // api
    const data = await api(
      `collaborate/check?token=${localStorage.getItem('token')}`,
      'GET'
    )
    console.log(data)
    setCollabPort(
      data.map(d => {
        d.id = d.sharing_id
        return d
      })
    )
    setIsLoading(false)
  }, [])

  const handleCreate = async () => {
    if (title !== '') {
      const res = await api('portfolio/create', 'POST', {
        token: localStorage.getItem('token'),
        portfolio_name: title
      })
      if (res.portfolios) {
        alert('Successfully Add A New Portfolio!')
        history.go(0)
      }
    }
    handleClose()
  }

  const handleClickOpenEdit = () => {
    setOpenEdit(true)
  }

  const handleCloseEdit = () => {
    setOpenEdit(false)
  }

  const handleEdit = async () => {
    if (title !== '') {
      const res = await api('portfolio/edit', 'POST', {
        token: localStorage.getItem('token'),
        portfolio_name: title,
        portfolio_id: localStorage.getItem('id')
      })
      if (res.is_success) {
        alert('Successfully Update Your Portfolio Name!')
      }
    }
    handleCloseEdit()
  }

  const handleRedirect = (id, name) => {
    localStorage.setItem('id', id)
    localStorage.setItem('name', name)
    history.push(`portfolio/${id}`)
  }

  return (
    <div>
      <NavBar />
      <br />
      <div>
        <h3>Collaboration List</h3>
        {/* <div>
          <Button variant="outlined" onClick={handleClickOpen}>
            Create Portfolio
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {'Create Porfolio'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Please enter title of Portfolio:
              </DialogContentText>
              <TextField
                id="demo-helper-text-misaligned-no-helper"
                label="Title"
                required
                onChange={evt => setTitle(evt.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleCreate} autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div> */}
        <br />
        {isLoading && <Loader />}
        <div style={{ height: 400, width: '100%' }}>
          {isLoading && <Loader />}
          {!isLoading && (
            <DataGrid
              rows={collabPort}
              columns={columns}
              pagination
              checkboxSelection
              pageSize={7}
              rowCount={100}
              // paginationMode="server"
              // onSelectionModelChange={newModel => {
              //   setSelect(newModel)
              // }}
              // selectionModel={select}
            />
          )}
        </div>
        {/* <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {port.map(p => (
          <div>
            <ListItem>
              <ListItemText primary="Vacation" secondary="July 20, 2014" />
            </ListItem>
          <p></p>
          </div>
        ))}
      </List> */}
      </div>
    </div>
  )
}

export default CollabList
