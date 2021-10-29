import React from 'react';
import { useState, useEffect } from "react";
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
import api from "../../api";
import PortfolioPage from "../PortfolioPage";

async function HandlePortfolio(props) {  
    let history = useHistory();
    const { portr } = useParams();

    
    const portr = await api(`portfolio?token=${props.token}`, 'GET');

    return (
        <Grid
            container
            spacing={2}
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
        >
            {portr.portfolios.map(p => (
                <Grid item xs={12} sm={6} md={3} key={portr.indexOf(p)}>
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
        </Grid>
    )
}

export default HandlePortfolio;