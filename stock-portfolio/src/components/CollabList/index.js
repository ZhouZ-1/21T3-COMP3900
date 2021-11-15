import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { FixedSizeList } from 'react-window';
import { DataGrid } from '@mui/x-data-grid';
import api from '../../api';
import NavBar from '../NavBar';
import Loader from '../Loader';

const columns = [
  { field: 'portfolio_name', headerName: 'Portfolio', width: 150 },
  { field: 'owner', headerName: 'Owner', width: 130 },
];

const columns2 = [
  { field: 'portfolio_name', headerName: 'Portfolio', width: 150 },
  { field: 'shared_with', headerName: 'Shared_with', width: 130 },
];

function CollabList() {
  var history = useHistory();
  const [title, setTitle] = React.useState('');
  const [sharingMeLen, setSharingMeLen] = React.useState(false);
  const [sharedThemLen, setSharedThemLen] = React.useState(0);
  const [collabPortMe, setCollabPortMe] = useState([]);
  const [collabPortThem, setCollabPortThem] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    setIsLoading(true);
    await api(
      `collaborate/shared-with-me?token=${sessionStorage.getItem('token')}`,
      'GET'
    ).then((dataMe) => {
      setSharingMeLen(dataMe.length);
      setCollabPortMe(
        dataMe.map((d) => {
          d.id = d.sharing_id;
          return d;
        })
      );
    });
    await api(
      `collaborate/sharing-with-others?token=${sessionStorage.getItem(
        'token'
      )}`,
      'GET'
    ).then((dataThem) => {
      let isShared = false;
      if (isShared) {
        setSharedThemLen(dataThem.length);
        setCollabPortThem(
          dataThem.map((d) => {
            d.id = d.portfolio_id;
            return d;
          })
        );
      }
    });

    setIsLoading(false);
  }, []);

  const goToPortfolioPage = (selectedPortfolio) => {
    const portfolioId = collabPortMe[selectedPortfolio.id - 1].portfolio_id;
    const portfolioName = collabPortMe[selectedPortfolio.id - 1].portfolio_name;
    sessionStorage.setItem('id', portfolioId);
    sessionStorage.setItem('name', portfolioName);
    history.push(`portfolio/${portfolioId}`);
  };

  return (
    <div>
      <hr />
      <div>
        <h3>Collaboration List</h3>
        <br />
        {isLoading && <Loader />}
        <div style={{ height: 400, width: '100%' }}>
          {!isLoading && sharingMeLen != 0 && (
            <p>Portfolio That Sharing Permission To Me</p>
          )}
          {!isLoading && sharingMeLen != 0 && (
            <DataGrid
              rows={collabPortMe}
              columns={columns}
              pagination
              checkboxSelection
              pageSize={7}
              rowCount={100}
              onRowClick={(item) => goToPortfolioPage(item)}
              paginationMode="server"
            />
          )}
          {!isLoading && sharingMeLen == 0 && (
            <div>
              <p>No portfolio share with you yet.</p>
            </div>
          )}
          {!isLoading && sharedThemLen != 0 && (
            <p>Portfolio That I Shared With Others</p>
          )}
          {!isLoading && sharedThemLen != 0 && (
            <DataGrid
              rows={collabPortThem}
              columns={columns2}
              pagination
              checkboxSelection
              pageSize={7}
              rowCount={100}
              paginationMode="server"
            />
          )}
          {!isLoading && sharedThemLen == 0 && (
            <p>You haven't shared portfolio with anyone yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollabList;
