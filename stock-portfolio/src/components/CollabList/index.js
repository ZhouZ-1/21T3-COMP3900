import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material'
import { FixedSizeList } from 'react-window'
import { DataGrid } from '@mui/x-data-grid'
import {
  Button,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import api from '../../api'
import NavBar from '../NavBar'
import Loader from '../Loader'

const columns = [
  // { field: 'id', headerName: 'id', width: 100 },
  // { field: 'sharing_id', headerName: 'id', width: 100 },
  // { field: 'portfolio_id', headerName: 'Portfolio id', width: 150 },
  { field: 'portfolio_name', headerName: 'Portfolio', width: 150 },
  { field: 'owner', headerName: 'Owner', width: 130 }
]

const columns2 = [
  // { field: 'id', headerName: 'id', width: 100 },
  // { field: 'sharing_id', headerName: 'id', width: 100 },
  // { field: 'portfolio_id', headerName: 'Portfolio id', width: 150 },
  { field: 'portfolio_name', headerName: 'Portfolio', width: 150 },
  { field: 'shared_with', headerName: 'Shared_with', width: 130 }
]

function CollabList () {
  var history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [openParticipantsModal, setOpenParticipantsModal] = useState(false)
  const [openParticipants2Modal, setOpenParticipants2Modal] = useState(false)
  const [meString, setMeString] = useState(
    <li class="list-group-item list-group-item-action">Loading.....</li>
  )
  const [themString, setThemString] = useState(
    <li class="list-group-item list-group-item-action">Loading.....</li>
  )

  useEffect(async () => {
    //   setIsLoading(true)

    //   // psedo data
    //   const me = [
    //     {portfolio_id: 1,sharing_id: 1,portfolio_name: 'My Portfolio',owner: 'John Doe'},
    //     {portfolio_id: 2,sharing_id: 2,portfolio_name: 'My Portfolio',owner: 'May Doe'}
    //   ]

    //   if (me.length == 0) {
    //     setMeString(<p>No portfolio share with you yet.</p>);
    //   } else {
    //     setMeString(me.map(m => {
    //       return  <div><span>- Portfolio {m.portfolio_name} by {m.owner} </span></div>
    //     }))
    //   };

    await api(
      `collaborate/shared-with-me?token=${sessionStorage.getItem('token')}`,
      'GET'
    ).then(dataMe => {
      if (dataMe.length == 0) {
        setMeString(<p>No portfolio share with you yet.</p>)
      }

      setMeString(
        dataMe.map(m => {
          return (
            <div>
              <span>
                - Portfolio {m.portfolio_name} by {m.owner}{' '}
              </span>
            </div>
          )
        })
      )
    })

    //   // psedo data
    //   const them = [
    //     {portfolio_id: 1,portfolio_name: '1',shared_with: ['4321', '1234']},
    //     {portfolio_id: 2,portfolio_name: '2',shared_with: ['4321']},
    //     {portfolio_id: 3,portfolio_name: 'third',shared_with: ['1234']}
    //   ]

    //   if (them.length == 0) {
    //     setThemString(<p>You haven't shared portfolio with anyone yet.</p>);
    //   } else {
    //     setThemString(them.map(t => {
    //       console.log('name', t)
    //         return  <div><span>- Portfolio {t.portfolio_name} by {t.shared_with} </span></div>
    //     }))
    //   };

    //   // setThemString(collabPortThem.map(t => {
    //   //   console.log('name', t)
    //   //   t.shared_with.map(shared => {
    //   //     console.log('shared', shared)
    //   //   })
    //   // }))

    await api(
      `collaborate/sharing-with-others?token=${sessionStorage.getItem(
        'token'
      )}`,
      'GET'
    ).then(dataThem => {
      let isShared = false
      // print out result
      // console.log('them', dataThem)
      dataThem.map(d => {
        // console.log('others', d);
        if (d.shared_with.length != 0) {
          console.log('others', d.portfolio_name, d.shared_with)
          // isShared = true;
        }
      })

      if (isShared) {
        if (dataThem.length == 0) {
          setThemString(<p>You haven't shared portfolio with anyone yet.</p>)
        }

        setThemString(
          dataThem.map(t => {
            // if (t.shared_with.length != 0) {
            return <div>{t.portfolio_name}</div>
            // return  <div><span>- Portfolio {t.portfolio_name} by {t.shared_with[0].username} </span></div>
            // }
          })
        )
      }
    })
    // .then((dataMe) => {
    //   if (dataMe.length == 0) {
    //     setMeString(<p>No portfolio share with you yet.</p>);
    //   }

    //   setMeString(dataMe.map(m => {
    //     return  <div><span>- Portfolio {m.portfolio_name} by {m.owner} </span></div>
    //   }));
    // })

    setIsLoading(false)
  }, [])

  const handleOpenParticipantsModal = () => {
    setOpenParticipantsModal(true)
  }

  const handleCloseParticipantsModal = () => {
    setOpenParticipantsModal(false)
  }

  const handleOpenParticipants2Modal = () => {
    setOpenParticipants2Modal(true)
  }

  const handleCloseParticipants2Modal = () => {
    setOpenParticipants2Modal(false)
  }

  return (
    <div>
      <>
      <div>
        <Button
          class="btn btn-outline-primary ms-5"
          onClick={handleOpenParticipantsModal}
        >
          Shared With me
        </Button>
        <Dialog
          open={openParticipantsModal}
          onClose={handleCloseParticipantsModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Portfolio That Sharing Permission To Me
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {meString}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseParticipantsModal}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
      {/* <DataGrid
              rows={collabPortMe}
              columns={columns}
              pagination
              checkboxSelection
              pageSize={7}
              rowCount={100}
              paginationMode="server"
            /> */}

      <div>
        <Button
          class="btn btn-outline-primary ms-5"
          onClick={handleOpenParticipants2Modal}
        >
          Shared To Others
        </Button>
        <Dialog
          open={openParticipants2Modal}
          onClose={handleCloseParticipants2Modal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Portfolio That I Shared With Others
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {themString}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseParticipants2Modal}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* <DataGrid
              rows={collabPortThem}
              columns={columns2}
              pagination
              checkboxSelection
              pageSize={7}
              rowCount={100}
              paginationMode="server"
            /> */}
      </>
    </div>
  )
}

export default CollabList
