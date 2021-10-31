import { useEffect, useState } from "react";
import api from "../../api";
import Loader from "../Loader";

function ExportModal(){
    const [isPortfolioLoading,setIsPortfolioLoading] = useState(true);
    const [portfolios,setPortfolios]=useState(<div class="list-group"></div>);
    const [selectedPortfolioId,setSelectedPortfolioId] = useState();
    useEffect(async ()=>{
        const token = localStorage.getItem('token');
        const response = await api(`portfolio?token=${token}`, 'GET');
        if(response.portfolios.length === 0){
            setPortfolios(<button type="button" class="list-group-item list-group-item-action">You have no Portfolio</button>)
        }else{
            const portfolioList = response.portfolios.map(function(item){
                return <button type="button" class="list-group-item list-group-item-action" onClick={()=>onPortfolioClick(item.portfolio_id)}>{item.portfolio_name}</button>
            });
            setPortfolios(portfolioList);
        }
        setIsPortfolioLoading(false);
    },[]);

    const onPortfolioClick = async (portFolioId) => {
        console.log(portFolioId);
        const token = localStorage.getItem('token');
        console.log(token);
        const response = await api(`portfolio/download?portfolio_id=${portFolioId}&token=${token}`,'GET');
        console.log(response);
    }
    
    return (
        <div class="modal fade" id="exportModal" tabindex="-1" role="dialog" aria-labelledby="exportModalLabel" aria-hidden="true">
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
                </div>
                </div>
            </div>
        </div>
    );
}
export default ExportModal;