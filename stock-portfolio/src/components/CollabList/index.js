import React from 'react'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import { FixedSizeList } from 'react-window';
import { DataGrid } from '@mui/x-data-grid'
import api from '../../api'
import NavBar from '../NavBar'
import Loader from '../Loader'

const columns = [
  { field: 'sharing_id', headerName: 'id', width: 100 },
  // { field: 'portfolio_id', headerName: 'Portfolio id', width: 150 },
  { field: 'portfolio_name', headerName: 'Portfolio', width: 150 },
  { field: 'owner', headerName: 'Owner', width: 130 }
]


function CollabList () {
  var history = useHistory()
  const [title, setTitle] = React.useState('')
  const [collabPortMe, setCollabPortMe] = useState([])
  const [collabPortThem, setCollabPortThem] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [open, setOpen] = React.useState(false)
  const [sharingMeLen, setSharingMeLen] = React.useState(false)
  const [sharedThemLen, setSharedThemLen] = React.useState(0)

  useEffect(async () => {
    setIsLoading(true)
    
    const dataMe = await api(
      `collaborate/shared-with-me?token=${sessionStorage.getItem('token')}`,
      'GET'
    )
    if (dataMe) {
      console.log(dataMe)   
      dataMe.map(d => {
        console.log('d', d);
      })

      setSharingMeLen(dataMe.length)
      setCollabPortMe(
        dataMe.map(d => {
          d.id = d.sharing_id
          return d
        })
      )
    }

    const dataThem = await api(
      `collaborate/shared-with-me?token=${sessionStorage.getItem('token')}`,
      'GET'
    )
    if (dataThem) {
      console.log(dataThem)   
      dataThem.map(d => {
        console.log('d', d);
      })

      setSharedThemLen(dataThem.length)
      setCollabPortThem(
        dataThem.map(d => {
          d.id = d.sharing_id
          return d
        })
      )
    }
    

    setIsLoading(false)
  }, [])

  // function renderRow(props) {
  //   const { index, style } = props;
  
  //   return (
  //     <ListItem style={style} key={index} component="div" disablePadding>
  //       <ListItemButton>
  //         <ListItemText primary={`Item ${index + 1}`} />
  //       </ListItemButton>
  //     </ListItem>
  // );

  return (
    <div>
      <NavBar />
      <br />
      <div>
        <h3>Collaboration List</h3>
        <br />
        {isLoading && <Loader />}
        <div style={{ height: 400, width: '100%' }}>
          {!isLoading && sharingMeLen != 0 && (
            // <DataGrid
            //   rows={collabPortMe}
            //   columns={columns}
            //   pagination
            //   checkboxSelection
            //   pageSize={7}
            //   rowCount={100}
            //   // paginationMode="server"
            //   // onSelectionModelChange={newModel => {
            //   //   setSelect(newModel)
            //   // }}
            //   // selectionModel={select}
            // />
            <div>
              <Box
                sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
              >
                {collabPortMe.map(c => (
                  <ListItem key={collabPortMe.indexOf(c)} component="div" disablePadding>
                    <ListItemButton>
                      <ListItemText primary={`Item ${c.id}`} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </Box>
              <br/>
            </div>
          )}
          {!isLoading && sharingMeLen == 0 && 
          <div>
            <p>No portfolio share with you yet.</p>
          </div>
          } 
          {!isLoading && sharedThemLen != 0 && (
            <DataGrid
              rows={collabPortMe}
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
          {!isLoading && sharedThemLen == 0 && 
            <p>You haven't shared portfolio with anyone yet.</p>
          } 
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
