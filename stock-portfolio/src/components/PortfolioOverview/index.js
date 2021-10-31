import React from 'react';
import { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router";
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
    useTheme
} from '@mui/material';
import api from "../../api";
import NavBar from "../NavBar";
import Loader from "../Loader";
// import CreatePortfolio from "../CreatePortfolio";
import PortfolioPage from "../PortfolioPage";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2)
    }
}))

function PortfolioOverview() {
    const theme = useTheme();
    var history = useHistory();
    const classes = useStyles();
    const [title, setTitle] = React.useState('');
    const [port, setPort] = useState([]);
    const [portState, setPortState] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setIsLoading(true);
        api(`portfolio?token=${localStorage.getItem('token')}`, 'GET')
            .then(res => {
                if (res) {
                    setPort(res.portfolios);
                    if (port !== []) {
                        setPortState(true);
                    }
                } 
            })
    }, []);

    const handleCreate = async () => {
        if (title !== '') {
            setIsLoading(true);
            const res = await api('portfolio/create', 'POST', {token: localStorage.getItem('token'), portfolio_name: title});
            if (res.portfolios) {
                alert("Successfully Add A New Portfolio!");
                history.go(0);
            } 
        } 
        handleClose();
    };


    const handleRedirect = (id) => {
        localStorage.setItem('id', id);
        history.push(`portfolio/${id}`);
    };

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
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                        {"Create Porfolio"}
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Please enter title of Portfolio:
                        </DialogContentText>
                        <TextField id="demo-helper-text-misaligned-no-helper" label="Title"  required onChange={(evt)=>setTitle(evt.target.value)}></TextField>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleCreate} autoFocus>
                            Confirm
                        </Button>
                        </DialogActions>
                    </Dialog>
                    </div>
            </div>
            <br></br>
            { isLoading && !portState &&
                (<Loader></Loader>)
            }
            <Grid
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                {portState && port.map(p => (
                        <Grid item xs={12} sm={6} md={3} key={port.indexOf(p)}>
                            <Card 
                                variant="outlined"
                                // component={PortfolioPage}
                                // to={`portfolio/${p.portfolio_id}`}
                                onClick={(e) => handleRedirect(`${p.portfolio_id}`, e)}
                                >
                                <CardHeader
                                        title={`Portfolio : ${p.portfolio_name}`}
                                        subheader={`id : ${p.portfolio_id}`}
                                        // subheader={`earnings : ${p.earnings}`}
                                    />  
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        {/* Description */}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
            {!isLoading && !portState && 
                <p>No Portfolio yet.</p>
            }
        </div>
        
    )
}

export default PortfolioOverview;
