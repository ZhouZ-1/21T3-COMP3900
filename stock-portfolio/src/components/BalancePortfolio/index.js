import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import api from '../../api';
import { TextField } from '@mui/material';
import { Grid, Card, CardHeader, CardContent, Typography } from '@mui/material';

const BalancePortfolio = () => {
  var history = useHistory();
  const [stock, setStock] = useState([]);
  const [overall, setOverall] = useState([0, 0]);

  useEffect(async () => {
    const balance = await api(
      `invested_performance/portfolio?portfolio=${sessionStorage.getItem(
        'id'
      )}`,
      'GET'
    );

    balance.symbols.filter((c) => {
      c.change_val = parseFloat(c.change_val).toFixed(1);
      c.change_percent = parseFloat(c.change_percent).toFixed(3);
    });

    setOverall(
      balance.symbols.filter((c) => {
        if (c.symbol == 'overall') {
          return c;
        }
      })[0]
    );

    setStock(
      balance.symbols.filter((c) => {
        if (c.symbol != 'overall') return c;
      })
    );
  }, []);

  const handleBack = () => {
    history.push(`/portfolio/${sessionStorage.getItem('id')}`);
  };

  return (
    <div class='text-center w-100 p-3'>
      <button class='btn btn-lg btn-link btn-block' onClick={handleBack}>
        Go Back
      </button>
      <h3>Portfolio Gains</h3>
      <div>
        <div>
          <span>Total Gain/Loss: </span>
          <span
            style={{
              color: Math.sign(overall.change_val) === -1 ? 'red' : 'green',
            }}
          >
            {overall.change_val} ({overall.change_percent}%)
          </span>
        </div>
        <br />
        <Grid
          container
          spacing={2}
          direction='row'
          justify='flex-start'
          alignItems='flex-start'
        >
          {stock.map((s) => (
            <Grid item xs={12} sm={6} md={3} key={stock.indexOf(s)}>
              <Card variant='outlined'>
                <CardHeader title={`Symbol : ${s.symbol}`} />
                <CardContent>
                  <Typography
                    style={{
                      color: Math.sign(s.change_val) === -1 ? 'red' : 'green',
                    }}
                  >
                    Changes : ${s.change_val}({s.change_percent}%)
                  </Typography>
                  <Typography>Buying Price: {s.orig_price}</Typography>
                  <Typography>Current Price: {s.curr_price}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default BalancePortfolio;
