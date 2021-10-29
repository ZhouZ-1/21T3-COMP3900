import React from 'react';
import { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import {
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
//    Button,  
//     TextField,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     DialogTitle, 
    useMediaQuery,
    useTheme
} from '@mui/material';
import api from "../../api";
import NavBar from "../NavBar";
import CreatePortfolio from "../CreatePortfolio";
import HandlePortfolio from "../HandlePortfolio";

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
    const theme = useTheme();
    var history = useHistory();
    const classes = useStyles();
    const { port } = useParams();
    const token = localStorage.getItem('token');

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    // const handlePortfolio = () => {
    //     //  api call for all the information about portfolios in general

    //     api('portfolio', 'GET') 
    //         .then(res => {
    //             if (res.is_success) {
    //                 // Success
    //                 const handleCreate = useEffect(async() => {
    //                     setOpen(false);
    //                     const res = await api('portfolio', 'GET', {token});
    //                 },[name]);    data = res.portfolios;
    //                 setPort(res);
    //                 // const id = data['portfolio_id'];
    //                 // const name = data['portfolio_name'];
    //                 // const earnings = 0;
    //             } else {

    //                 // Something went wrong
    //                 alert(res.message);
                    
    //             }
    //         })
    //     // const port = await api(`portfolio?token=${token}`, 'GET');
    //     alert(port);
    // };
    // const handlePortfolio = useEffect(async() => {
    //     const portr = await api(`portfolio?token=${token}`, 'GET');

    //     return (

    //     );
    // },[port]);


    // const handleRedirect = (id) => {
    //     component={PortfolioPage}
    //     history.push(`portfolio/${id}`);
    //     localStorage.setItem('id', id);
    //     return PortfolioPage;
    // };

    // Pagination
    // https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/

    return (
        <div className={classes.root}>
            <NavBar/>
            <br></br>
            <CreatePortfolio />
            <br></br>
            <HandlePortfolio token={token} />
            {/* <Grid
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                {portr.portfolios.map(p => (
                    <Grid item xs={12} sm={6} md={3} key={data.indexOf(p)}>
                        <Link to={`portfolio/${elem.id}`}>
                        <Card 
                            variant="outlined"
                            // component={PortfolioPage}
                            // to={`portfolio/${elem.id}`}
                            // onClick={handleRedirect}
                            onClick={PortfolioPage}
                            >
                            <CardHeader
                                    title={`Portfolio : ${p.portfolio_name}`}
                                    // subheader={`earnings : ${elem.earnings}`}
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
            </Grid> */}
        </div>
        
    )
}

export default PortfolioOverview;