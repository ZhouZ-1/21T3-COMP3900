import { useState } from 'react'
import { useHistory } from 'react-router'
import api from '../../api'
import NavBar from '../NavBar/index'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import LoginIcon from '@mui/icons-material/Login'
import { createTheme, ThemeProvider } from '@mui/material/styles'
function SignIn () {
  var history = useHistory()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authenticationError, setAuthenticationError] = useState(false)
  const theme = createTheme()

  const handleSignIn = () =>
    api('accounts/login', 'POST', { username, password }).then(res => {
      if (res.token) {
        // Set token and redirects to the main page.
        sessionStorage.setItem('token', res.token)
        history.push('/')
      } else {
        setAuthenticationError(true)
      }
    })

  return (
    <div>
      <NavBar />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div>
              <Typography component="h1" variant="h5">
                Sign In <LoginIcon />
              </Typography>
            </div>
            <Box
              onSubmit={handleSignIn}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                // name="Username"
                autoFocus
                onChange={evt => setUsername(evt.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                // name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={evt => setPassword(evt.target.value)}
              />
              {authenticationError && (
                <p class="text-danger">
                  Incorrect Username or Password. Please try again!
                </p>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/resetPassword" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signUp" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  )
}

export default SignIn
