import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import api from '../../api'
import NavBar from '../NavBar'
import Loader from '../Loader'

// const columns = [
//   { field: 'portfolio_name', headerName: 'Portfolio', width: 150 },
//   { field: 'owner', headerName: 'Owner', width: 130 }
// ]

// const columns2 = [
//   { field: 'portfolio_name', headerName: 'Portfolio', width: 150 },
//   { field: 'shared_with', headerName: 'Shared_with', width: 130 }
// ]

function CollabList () {
  var history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [openCollaborationModal, setOpenCollaborationModal] = useState(false)
  const [openCollaboration2Modal, setOpenCollaboration2Modal] = useState(false)
  const [meString, setMeString] = useState(
    <li class="list-group-item list-group-item-action">Loading.....</li>
  )
  const [themString, setThemString] = useState(
    <li class="list-group-item list-group-item-action">Loading.....</li>
  )

  const handleRedirectCollab = (id, name) => {
    sessionStorage.setItem('id', id)
    sessionStorage.setItem('name', name)
    history.push(`portfolio/${id}`)
  }

  useEffect(async () => {
    //   setIsLoading(true)

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
              <Button
                id="basic-button"
                component={Link}
                to={{
                  pathname: `/portfolio/${sessionStorage.getItem('id')}`
                }}
                onClick={() =>
                  handleRedirectCollab(m.portfolio_id, m.portfolio_name)
                }
              >
                - Can Access {m.portfolio_name} By {m.owner}{' '}
              </Button>
            </div>
          )
        })
      )
    })

    await api(
      `collaborate/sharing-with-others?token=${sessionStorage.getItem(
        'token'
      )}`,
      'GET'
    ).then(dataThem => {
      if (dataThem.length == 0) {
        setThemString(<p>You haven't shared portfolio with anyone yet.</p>)
      }

      let str = []
      dataThem.map(t => {
        if (t.shared_with.length != 0) {
          let isComma = false
          // let subStr = []
          str += `- ${t.portfolio_name} Share To `
          // return <div>- Portfolio {t.portfolio_name} by </div>
          // str.append(<span>- Portfolio {t.portfolio_name} by </span>)
          t.shared_with.map(share => {
            if (isComma) str += ', '
            else isComma = true

            str += `${share.username}  \n`
          })
          return (
            <a
              id="them"
              href={`/portfolio/${sessionStorage.getItem('id')}`}
              onclick={`handleRedirect(${t.portfolio_id}, ${t.portfolio_name})`}
            >
              {str}
            </a>
          )
        }
      })

      setThemString(
        str != [] ? (
          <div>{str}</div>
        ) : (
          setThemString(<p>You haven't shared portfolio with anyone yet.</p>)
        )
      )
    })
  }, [])

  const handleOpenCollaborationModal = () => {
    setOpenCollaborationModal(true)
  }

  const handleCloseCollaborationModal = () => {
    setOpenCollaborationModal(false)
  }

  const handleOpenCollaboration2Modal = () => {
    setOpenCollaboration2Modal(true)
  }

  const handleCloseCollaboration2Modal = () => {
    setOpenCollaboration2Modal(false)
  }

  return (
    <div style={{ display: 'inline-flex' }}>
      <div>
        <div>
          <Button
            class="btn btn-outline-primary ms-5"
            onClick={handleOpenCollaborationModal}
          >
            Shared With me
          </Button>
          <Dialog
            open={openCollaborationModal}
            onClose={handleCloseCollaborationModal}
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
              <Button onClick={handleCloseCollaborationModal}>Cancel</Button>
            </DialogActions>
          </Dialog>
          
        {/* <DataGrid
              rows={collabPortMe}
              columns={columns}
              pagination
              checkboxSelection
              pageSize={7}
              rowCount={100}
              paginationMode="server"
            /> */}
          <Button
            class="btn btn-outline-primary ms-5"
            onClick={handleOpenCollaboration2Modal}
          >
            Shared To Others
          </Button>
          <Dialog
            open={openCollaboration2Modal}
            onClose={handleCloseCollaboration2Modal}
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
              <Button onClick={handleCloseCollaboration2Modal}>Cancel</Button>
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
      </div>
    </div>
  )
}

export default CollabList
