import React from 'react';
import { useEffect, useState } from "react";
import api from "../../api";
import Loader from "../Loader";

function PortfolioModal(){
    const [isPortfolioLoading,setIsPortfolioLoading] = useState(true);
    const [portfolios,setPortfolios]=useState(<div class="list-group"></div>);
    useEffect(async ()=>{
        const token = localStorage.getItem('token');
        const response = await api(`portfolio?token=${token}`, 'GET');
        if(response.portfolios.length === 0){
            setPortfolios(<button type="button" class="list-group-item list-group-item-action">You have no Portfolio</button>)
        }else{
            const portfolioList = response.portfolios.map(({portfolio_id,portfolio_name}) => {
                <button type="button" class="list-group-item list-group-item-action">{portfolio_name}</button>
            });
            setPortfolios(portfolioList);
            console.log(response);
        }
        setIsPortfolioLoading(false);
    },[])
    
    return (
        <div class="modal fade" id="portfolioModal" tabindex="-1" role="dialog" aria-labelledby="portfolioModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Select a portfolio to add stock(s)</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    {isPortfolioLoading?(<Loader/>):(<div class="list-group">{portfolios}</div>)}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Proceed</button>
                </div>
                </div>
            </div>
        </div>
    );
}
export default PortfolioModal;