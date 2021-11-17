import { useState } from 'react'
import React from 'react'
import api from '../../api'
import NavBar from '../NavBar/index'
import { validateEmail } from './../SignUp/helper'
import EmailRuleModal from './../SignUp/EmailRuleModal'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { createTheme } from '@mui/material/styles'

function ForgotMyPassword () {
  const [email, setEmail] = useState('')
  const [sentEmail, setSentEmail] = useState(false)
  const [isEmailError, setIsEmailError] = useState(false)
  const theme = createTheme()

  const handleSubmit = () => {
    const isEmailOkay = validateEmail(email)
    if (!isEmailOkay) {
      setIsEmailError(true)
    } else {
      setIsEmailError(false)
    }

    if (isEmailOkay) {
      api('accounts/recover', 'POST', { email })
      setSentEmail(true)
    }
  }

  return (
    <div>
      <NavBar />
      <div
        class="container"
        style={{
          marginTop: '3em',
          border: '1px solid',
          borderRadius: '5px',
          padding: '50px 30px'
        }}
      >
        <Typography component="h1" variant="h4">
          Please Sign In
        </Typography>
        {!sentEmail ? (
          <div>
            <Typography variant="body1" style={{ padding: theme.spacing(1) }}>
              Enter in your email address below to reset your password.
            </Typography>
            <div>
              {isEmailError && (
                <p class="text-danger">Please check Email Rule!</p>
              )}
              <div class="d-flex justify-content-center">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="Email"
                  autoFocus
                  onChange={evt => setEmail(evt.target.value)}
                />
                <EmailRuleModal />
              </div>
              <br />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        ) : (
          <p>
            Success! We have sent some instructions to your email on how to
            recover your account. Note that if the email is invalid, or we do
            not have your email address in our database, then you will not
            recieve an email.
          </p>
        )}
      </div>
    </div>
  )
}

export default ForgotMyPassword
