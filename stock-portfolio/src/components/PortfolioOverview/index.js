import React from 'react';
import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    CardHeader
} from '@material-ui/core/';
import { 
    Button,  
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    useTheme
} from '@mui/material';
import api from "../../api";
import NavBar from "../NavBar";
import PortfolioPage from "../PortfolioPage";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2)
    }
}))

function PortfolioOverview() {
    // comment after it is done
    var data = [
        { id: 1, Portfolio: 1, earnings: 13000 },
        { id: 2, Portfolio: 2, earnings: 16500 },
        { id: 3, Portfolio: 3, earnings: 14250 },
        { id: 4, Portfolio: 4, earnings: 19000 }
    ];
                                
    const [open, setOpen] = React.useState(false);
    const [title,setTitle] = useState('');
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    var history = useHistory();
    const classes = useStyles()

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handlePortfolio = () => {
        //  api call for all the information about portfolios in general
        const token = localStorage.getItem('token');
        api('portfolio', 'GET') 
            .then(res => {
                if (res.is_success) {
                    // Success
                    data = res.portfolios;
                    const id = data['portfolio_id'];
                    const name = data['portfolio_name'];
                    const earnings = 0;
                } else {

                    // Something went wrong
                    alert(res.message);
                    
                }
            })
    };

    const handleCreate = () => {
        //  api call for create new portfolio
        const token = localStorage.getItem('token');
        api('portfolio/create', 'POST', {token, portfolio_name: title}) 
            .then(res => {
                if (res.is_success) {
                    // Success
                    alert("Successfully update your password!");
                } else {
                    // Something went wrong
                    alert(res.message);
                }
            })
        setOpen(false);
    };

    // const handleRedirect = (id) => {
    //     component={PortfolioPage}
    //     history.push(`portfolio/${id}`);
    //     localStorage.setItem('id', id);
    //     return PortfolioPage;
    // };
    

    return (
        <div className={classes.root}>
            <NavBar/>
            <br></br>
            <div>
                <h3>Portfolio Overview</h3>
                <div>
                    <Button variant="outlined" onClick={handleClickOpen}>
                        Create Portfolio
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">
                        {"Create Portfolio"}
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Please enter title of Portfolio:  
                        </DialogContentText>
                        <TextField id="demo-helper-text-misaligned-no-helper" label="Title"  required autofocus onChange={(evt)=>setTitle(evt.target.value)}></TextField>
                        </DialogContent>                            
                        <br></br>
                        <DialogActions>
                        <Button autoFocus onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleCreate} autoFocus>
                            Confirm
                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
            <br></br>
            <Grid
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                {data.map(elem => (
                    <Grid item xs={12} sm={6} md={3} key={data.indexOf(elem)} onChange={handlePortfolio} autoFocus>
                        <Link to={`portfolio/${elem.id}`}>
                        <Card 
                            variant="outlined"
                            // component={PortfolioPage}
                            // to={`portfolio/${elem.id}`}
                            // onClick={handleRedirect}
                            onClick={PortfolioPage}
                            >
                            <CardHeader
                                    title={`Portfolio : ${elem.Portfolio}`}
                                    subheader={`earnings : ${elem.earnings}`}
                                />  
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Description
                                </Typography>
                            </CardContent>
                        </Card>
                        </Link>
                     </Grid>
                ))}
            </Grid>
        </div>
        
    )
}

export default PortfolioOverview;