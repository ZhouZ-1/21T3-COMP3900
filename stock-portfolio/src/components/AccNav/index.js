import React from 'react'
import { useHistory } from 'react-router'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import DeleteAcc from './../DeleteAcc/index'
import AccDetails from './../AccDetails/index'
import Updatepwd from './../Updatepwd/index'

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

export default function AccNav () {
  var history = useHistory()

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }} m={15} pt={1}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <hr />
            <Item>
              <Link to="/account" style={{ textDecoration: 'none' }}>
                ACCOUNT DETAILS
              </Link>
              <hr />
              <Link to="/updatepwd" style={{ textDecoration: 'none' }}>
                UPDATE PASSWORD
              </Link>
              <hr />
              <DeleteAcc redirect={() => history.push('/')} />
            </Item>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={8}>
            <Item sx={{ boxShadow: 0 }}>
              <Switch>
                <Route path="/account">
                  <AccDetails />
                </Route>
                <Route path="/updatepwd">
                  <Updatepwd />
                </Route>
              </Switch>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Router>
  )
}
