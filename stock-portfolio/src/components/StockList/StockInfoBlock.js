import React from 'react';
import { fontSize, fontWeight } from "@mui/system";
import api from "../../api";
import { useHistory } from "react-router";
function StockInfoBlock(props) {
    var history = useHistory();
    const {data} = props;
    const symbol = data[0]
    const name = data[1]
    const exchange = data[2]
    const asset_type = data[3]

    return (
        <div>
            <div class='mt-2 shadow p-3 mb-5 bg-white rounded' onClick={()=> history.push(`/stockDetails/${symbol}`)}>
                <div>
                    <div class='d-inline-block'>
                        <h5>{name} ({symbol})</h5>
                    </div>
                    <div class='d-inline-block ms-3'>
                        <small class="text-muted">asset type: {asset_type}</small>
                    </div>
                </div>
                <div>
                    traded in: {exchange}
                </div>
            </div>
        </div>
    );
}

export default StockInfoBlock;