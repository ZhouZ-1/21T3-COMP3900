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
        { portfolio_id: 1, portfolio_name: 1, earnings: 13000 },
        { portfolio_id: 2, portfolio_name: 2, earnings: 16500 },
        { portfolio_id: 3, portfolio_name: 3, earnings: 14250 },
        { portfolio_id: 4, portfolio_name: 4, earnings: 19000 }
    ];
                                
    const [open, setOpen] = useState(false);
    const [portState, setPortState] = useState(false);
    const theme = useTheme();
    var history = useHistory();
    const classes = useStyles();
    const [port, setPort] = useState([]);
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
    const handlePortfolio = useEffect(async(token) => {
        // let portr = await api(`portfolio?token=${token}`, 'GET');
        // useEffect(() => {
        //     let portr = await api(`portfolio?token=${token}`, 'GET');
        //     portr = portr.map((dev) => alert(dev));
        //     // arr.forEach(async (dev) => {
        //     //     let { data } = await api.get(`/users/${dev}`);
        //     //     setDevs((devs) => [...devs, data]);
        //     // })
        //     setPort([port.portfolios]);
        //     setPortState(true);
        // }, [port]);
        // });
        // if (port.portfolios != undefined){
        //     setPort([port.portfolios]);
        //     setPortState(true);
        // }
        const res = await api(`portfolio?token=${localStorage.getItem('token')}`, 'GET');
        setPort(res.portfolios);
        setPortState(true);
    
    });


    // const handleRedirect = (id) => {
    //     component={PortfolioPage}
    //     history.push(`portfolio/${id}`);
    //     localStorage.setItem('id', id);
    //     return PortfolioPage;
    // };

    // Pagination
    // https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/

    return (
        <div className={classes.root} onClick={handlePortfolio}>
            <NavBar/>
            <br></br>
            <CreatePortfolio />
            <br></br>
            <Grid
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                {portState && 
                    port.map(p => (
                    <Grid item xs={12} sm={6} md={3} key={port.indexOf(p)}>
                        <Link to={`portfolio/${p.portfolio_id}`}>
                        <Card 
                            variant="outlined"
                            // component={PortfolioPage}
                            // to={`portfolio/${p.portfolio_id}`}
                            // onClick={handleRedirect}
                            onClick={PortfolioPage}
                            >
                            <CardHeader
                                    title={`Portfolio : ${p.portfolio_name}`}
                                    // subheader={`earnings : ${p.earnings}`}
                                />  
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    {/* Description */}
                                </Typography>
                            </CardContent>
                        </Card>
                        </Link>
                    </Grid>
                ))}
                {!portState &&
                    <p>No Portfolio yet! Please create one</p>
                }
            </Grid>
        </div>
        
    )
}

export default PortfolioOverview;