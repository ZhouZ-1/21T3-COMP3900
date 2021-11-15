import { useState } from 'react';
import { useHistory } from 'react-router';
import { validatePassword, validateEmail } from './helper';
import PasswordRuleModal from './PasswordRuleModal';
import EmailRuleModal from './EmailRuleModal';
import api from '../../api';
import NavBar from '../NavBar/index';
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import LoginIcon from '@mui/icons-material/Login'
import { createTheme, ThemeProvider } from '@mui/material/styles'

function SignUp() {
  var history = useHistory();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const theme = createTheme()


  const handleSignUp = () => {
    const isPasswordOkay = validatePassword(password);
    const isEmailOkay = validateEmail(email);

    if (!isPasswordOkay) {
      setIsPasswordError(true);
    } else {
      setIsPasswordError(false);
    }
    if (!isEmailOkay) {
      setIsEmailError(true);
    } else {
      setIsEmailError(false);
    }

    if (isPasswordOkay && isEmailOkay) {
      //  Put user information to database.
      api('accounts/register', 'POST', {
        username: userName,
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }).then((res) => {
        if (res.token) {
          // Set token and redirects to the main page.
          sessionStorage.setItem('token', res.token);
          history.push('/');
        } else {
          // TODO: display error message
        }
      });
    }
  };
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
                Sign Up <LoginIcon />
              </Typography>
            </div>
            <Box
              component="form"
              onSubmit={handleSignUp}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="First Name"
                autoFocus
                onChange={evt => setFirstName(evt.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="Last Name"
                autoFocus
                onChange={evt => setLastName(evt.target.value)}
              />
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
              {isEmailError && (
                <p class="text-danger">Please check Email Rule!</p>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="Username"
                autoFocus
                onChange={evt => setUserName(evt.target.value)}
              />

              <div class="d-flex justify-content-center">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="passrd"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={evt => setPassword(evt.target.value)}
                />
                <PasswordRuleModal />
              </div>
              {isPasswordError && (
                <p class="text-danger">Please check Password Rule!</p>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSignUp}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default SignUp;
