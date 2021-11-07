import { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import React from 'react'
// TODO fetch from api
import api from '../../api'
import { Avatar, Box, TextField } from '@mui/material'
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material'
import { validateEmail } from '../SignUp/helper'

function AccDetails () {
  var history = useHistory()
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [editing, setEditing] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(true)

  const token = localStorage.getItem('token')

  useEffect(() => {
    api('accounts/details', 'PUT', { token }).then(res => {
      if (!res.message) {
        setUsername(res.username)
        setFirstName(res.first_name)
        setLastName(res.last_name)
        setEmail(res.email)
        setProfileImage(res.profile_image)
      } else {
        // Something went wrong
      }
    })
  }, [])

  const updateEmail = () => {
    api('accounts/update-details', 'PUT', {
      token,
      field: 'email',
      value: email
    })
  }

  const updateFirstName = () => {
    api('accounts/update-details', 'PUT', {
      token,
      field: 'first_name',
      value: firstName
    })
  }

  const updateLastName = () => {
    api('accounts/update-details', 'PUT', {
      token,
      field: 'last_name',
      value: lastName
    })
  }

  const handleEmailChange = e => {
    setEmail(e.target.value)
    setIsValidEmail(validateEmail(e.target.value))
  }

  const handleAccountPage = () => {
    // @TODO: check id/password to authenticate/authorise.
    //  if(id,password exist){
    history.push('/account') // Go back to the main page
    // }else{
    //     display error message
    // }
  }

  function edit () {
    setEditing(true)
  }

  function handleUpdate () {
    setEditing(false)
    updateFirstName()
    updateLastName()
    updateEmail()
  }

  return (
    <div class="text-center w-100 p-3">
      <form>
        <h1>
          Personal Information
          {!editing && (
            <button class="btn btn-lg btn-link btn-block" onClick={edit}>
              Edit
            </button>
          )}
        </h1>
      </form>

      <div>
        <Box display="flex" justifyContent="center" alignItems="center">
          <div>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                // height="140"
                image={`${profileImage}`}
                alt="Logo"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Profile
                </Typography>
              </CardContent>
            </Card>
          </div>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' }
            }}
            noValidate
            m={23}
            pt={8}
            autoComplete="off"
          >
            <div>
              <TextField
                id="standard-read-only-input"
                label="Email"
                value={email}
                InputProps={{
                  readOnly: !editing
                }}
                onChange={e => handleEmailChange(e)}
                variant="standard"
              />
              {!isValidEmail && (
                <p class="text-danger">Please check the email rules</p>
              )}
            </div>
            <br />
            <div>
              <TextField
                id="standard-read-only-input"
                label="First Name"
                value={firstName}
                InputProps={{
                  readOnly: !editing
                }}
                onChange={e => setFirstName(e.target.value)}
                variant="standard"
              />
            </div>
            <br />
            <div>
              <TextField
                id="standard-read-only-input"
                label="Last Name"
                value={lastName}
                InputProps={{
                  readOnly: !editing
                }}
                onChange={e => {
                  setLastName(e.target.value)
                  console.log(e)
                }}
                variant="standard"
              />
            </div>
            {editing && (
              <button
                class="btn-primary"
                onClick={handleUpdate}
                disabled={!isValidEmail}
              >
                Update
              </button>
            )}
          </Box>
        </Box>
      </div>
    </div>
  )
}

export default AccDetails
