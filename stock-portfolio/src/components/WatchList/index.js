import * as React from 'react';
import { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import api from "../../api";
import NavBar from '../NavBar';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'code', headerName: 'Code of Stock', width: 130 },
  { field: 'name', headerName: 'Full name', width: 130 },
  {
    field: 'units',
    headerName: 'Units',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.getValue(params.id, 'name') || ''} ${
        params.getValue(params.id, 'code') || ''
      }`,
  },
];

const rows = [
  { id: 1, code: 'STX', name: 'Seagate Technology PLC', units: 35 },      // buy price, balance, market price
  { id: 2, code: 'DFS', name: 'DIscover Financial Services', units: 42 },
  { id: 3, code: 'LSTR', name: 'Landstar System Inc', units: 45 },
  { id: 4, code: 'SWKS', name: 'Skyworks Solutions Inc', units: 16 },
  { id: 5, code: 'SNPS', name: 'Synopsys Inc', units: 133 },
  { id: 6, code: 'NSC', name: 'Norfolk Southern Corporation', units: 150 },
  { id: 7, code: 'CSCO', name: 'Cisco Systems', units: 44 },
  { id: 8, code: 'VIAV', name: 'Viavi Solutions Inc', units: 36 },
  { id: 9, code: 'ROST', name: 'Ross Stores Inc', units: 65 },
];
//@TODO:TONY to implement this function.
// const row = getRow(sessionStorage.getItem('token')); this should have the same format as above.

// net profit

function WatchList() {
  return (
    <>
      <NavBar></NavBar>
      <div>
        <div>
          <p3>Watchlist</p3>
          <button type="button" class="btn btn-outline-primary ms-5">Move Stock To Portfolio</button>
          <button type="button" class="btn btn-outline-primary ms-5">Delete Stock</button>
        </div>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            punitsSize={5}
            rowsPerPunitsOptions={[5]}
            checkboxSelection
          />
        </div>
      </div>
    </>
  );
}

export default WatchList;

<button type="button" class="btn btn-outline-primary ms-5">Move Stock To Portfolio</button>