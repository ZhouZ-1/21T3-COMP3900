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
    const [portState, setPortState] = useState(false);
    const theme = useTheme();
    var history = useHistory();
    const classes = useStyles();
    const [port, setPort] = useState([]);


    const handlePortfolio = useEffect(async() => {
        const res = await api(`portfolio?token=${localStorage.getItem('token')}`, 'GET');
        // if (res != undefined) {
            setPort(res.portfolios);
            setPortState(true);
        // }
    });


    const handleRedirect = (id) => {
        localStorage.setItem('id', id);
        history.push(`portfolio/${id}`);
    };

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
                    <div>
                        <p>Display Portfolio</p>
                        {port.map(p => (
                        <Grid item xs={12} sm={6} md={3} key={port.indexOf(p)}>
                            <Card 
                                variant="outlined"
                                // component={PortfolioPage}
                                // to={`portfolio/${p.portfolio_id}`}
                                onClick={(e) => handleRedirect(`${p.portfolio_id}`, e)}
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
                        </Grid>
                    ))}
                    </div>
                }
                {!portState &&
                    <p>No Portfolio yet! Please create one</p>
                }
            </Grid>
        </div>
        
    )
}

export default PortfolioOverview;