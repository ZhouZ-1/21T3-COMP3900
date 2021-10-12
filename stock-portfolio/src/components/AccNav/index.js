import * as React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
  } from "react-router-dom";
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import MainPage from './../MainPage/index';
import AccountPage from './../AccountPage/index';
import AccDetails from './../AccDetails/index';
import Updatepwd from './../Updatepwd/index';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  

export default function BasicGrid() {
//   const [value, setValue] = React.useState(0);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };
  

  return (
    <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Item>
                <Button>Account Details</Button>
                <hr/>
                <Button>Update Password</Button>
            </Item>
          </Grid>
          <Grid item xs={8}>
            <Item>xs=8
                <Switch>
                  <Route path="/account">
                    <Updatepwd />
                  </Route>
                  <Route path="/account">
                    <AccDetails />
                  </Route>
                  <Route path="/">
                    <MainPage />
                  </Route>
                </Switch>
            </Item>
          </Grid> 
        </Grid> 
    </Box>
    
    // <Box sx={{ width: '100%' }}>
    //   <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    //     <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
    //       <Tab label="Account Details" {...a11yProps(0)} />
    //       <Tab label="Update Account" {...a11yProps(1)} />
    //     </Tabs>
    //   </Box>
    //   <TabPanel value={value} index={0}>
    //     <AccDetails/>
    //   </TabPanel>
    //   <TabPanel value={value} index={1}>
    //     <UpdatePassword/>
    //   </TabPanel>
    // </Box>
  );
}

