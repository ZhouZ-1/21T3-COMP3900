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
  const [title, setTitle] = React.useState('')
  const [sharingMeLen, setSharingMeLen] = React.useState(false)
  const [sharedThemLen, setSharedThemLen] = React.useState(0)
  const [collabPortMe, setCollabPortMe] = useState([])
  const [collabPortThem, setCollabPortThem] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(async () => {
    setIsLoading(true)

    // // psedo data
    // const me = [
    //   {portfolio_id: 1,sharing_id: 1,portfolio_name: 'My Portfolio',owner: 'John Doe'},
    //   {portfolio_id: 2,sharing_id: 2,portfolio_name: 'My Portfolio',owner: 'May Doe'}
    // ]

    // setSharingMeLen(me.length)
    // setCollabPortMe(
    //   me.map(m => {
    //     m.id = m.sharing_id
    //     return m
    //   })
    // )
    // // console.log(me);

    await api(
      `collaborate/shared-with-me?token=${sessionStorage.getItem('token')}`,
      'GET'
    )
    .then((dataMe) => {
      // // print out result
      // dataMe.map(d => {
      //   console.log('m', d);
      // })

      console.log(dataMe)
      setSharingMeLen(dataMe.length)
      setCollabPortMe(
        dataMe.map(d => {
          d.id = d.sharing_id
          return d
        })
      )
    })

    // // psedo data
    // const them = [
    //   {portfolio_id: 1,portfolio_name: '1',shared_with: ['4321', '1234']},
    //   {portfolio_id: 2,portfolio_name: '2',shared_with: ['4321']},
    //   {portfolio_id: 3,portfolio_name: 'third',shared_with: ['1234']}
    // ]
    // setSharedThemLen(them.length)
    // setCollabPortThem(
    //   them.map(t => {
    //     t.id = t.portfolio_id
    //     return t
    //   })
    // )
    // // setCollabPortThem(them);
    // console.log('them', collabPortThem)

    // collabPortThem.map(t => {
    //   console.log('name', t)
    //   t.shared_with.map(shared => {
    //     console.log('shared', shared)
    //   })
    // })

    await api(
      `collaborate/sharing-with-others?token=${sessionStorage.getItem('token')}`,
      'GET'
    )
    .then((dataThem) => {
      let isShared = false;
      // // print out result
      // console.log('them', dataThem)
      // dataThem.map(d => {
      //   console.log('others', d);
      //   if (d.shared_with.length != 0) {
      //     isShared = true;
      //   }
      // })
      console.log(dataThem)
      if (isShared){
        setSharedThemLen(dataThem.length)
        setCollabPortThem(
          dataThem.map(d => {
            d.id = d.portfolio_id
            return d
          })
        )
      }
    })

    setIsLoading(false)
  }, [])

  return (
    <div>
      <hr/>
      <div>
        <h3>Collaboration List</h3>
        <br />
        {isLoading && <Loader />}
        <div style={{ height: 400, width: '100%' }}>
          {!isLoading &&
            sharingMeLen != 0 && <p>Portfolio That Sharing Permission To Me</p>}
          {!isLoading &&
            sharingMeLen != 0 && (
              <DataGrid
                rows={collabPortMe}
                columns={columns}
                pagination
                checkboxSelection
                pageSize={7}
                rowCount={100}
                paginationMode="server"
              />
            )}
          {!isLoading &&
            sharingMeLen == 0 && (
              <div>
                <p>No portfolio share with you yet.</p>
              </div>
            )}
          {!isLoading &&
            sharedThemLen != 0 && <p>Portfolio That I Shared With Others</p>}
          {!isLoading &&
            sharedThemLen != 0 && (
              // <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              //   {collabPortThem.map((them) => {
              //     <ListItem>
              //       <ListItemText primary={`Portfolio Name ${them.portfolio_name}`} secondary={
              //         <div>
              //           {them.shared_with.map((shared) => {
              //             <div>{shared}</div>
              //           })}
              //         </div>
              //       }
              //       />
              //     </ListItem>
              //   })}
              // </List>
              <DataGrid
                rows={collabPortThem}
                columns={columns2}
                pagination
                checkboxSelection
                pageSize={7}
                rowCount={100}
                paginationMode="server"
              />
            )}
          {!isLoading &&
            sharedThemLen == 0 && (
              <p>You haven't shared portfolio with anyone yet.</p>
            )}
        </div>
      </div>
    </div>
  )
}

export default CollabList
