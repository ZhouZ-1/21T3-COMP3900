import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import api from '../../api';
import { TextField } from '@mui/material';
import { Grid, Card, CardHeader, CardContent } from '@mui/material';

const BalancePortfolio = (props) => {
  var history = useHistory();
  // const [balance, setBalance] = useState([]);
  const [colourGain, setColourGain] = useState('black');
  const [stock, setStock] = useState([]);
  const [overall, setOverall] = useState([0, 0]);

  useEffect(() => {
    // handleBalance();
    const balance = props.location.state.detail;
    // orig_price, curr_price, change_val, change_percent

    setOverall(balance.symbols.filter((c) => {
      if (c.symbol == 'overall') return c;
    })[0]);

    if (overall.change_val > 0) {
      setColourGain('green');
    } else if (overall.change_val < 0) {
      setColourGain('red');
    }

    setStock(
      balance.symbols.filter((c) => {
        if (c.symbol != 'overall') return c;
      })
    );
  }, []);

  // const handleBalance = async () => {
  //   // const bal = await api(
  //   //   `invested_performance?token=${sessionStorage.getItem('token')}`,
  //   //   'GET'
  //   // );
  //   await api(
  //     `invested_performance?token=3bAaXqKjTdWyguxqx8Jxhw`,
  //     'GET'
  //   ).then((bal) => {
  //     let total = parseFloat(bal.total_gains.toFixed(0));
  //     let pct = parseFloat(bal.pct_performance.toFixed(3));
  //     if (total > 0) {
  //       setColourGain('green');
  //     } else if (total < 0) {
  //       total = parseFloat(bal.total_gains.toFixed(3));
  //       pct = parseFloat(bal.pct_performance.toFixed(3));
  //       setColourGain('red');
  //     }
  //     setBalance({ total_gains: `${total}`, pct_performance: `${pct}` });
  //   });
  //   console.log(balance);
  // };
  const handleBack = () => {
    history.push(`/portfolio/${sessionStorage.getItem('id')}`);
  };

  return (
    <div class="text-center w-100 p-3">
      <button class="btn btn-lg btn-link btn-block" onClick={handleBack}>
      Go Back
      </button>
      Portfolio Balance Page
      <div>
        <div>
          <span>Total Balance: </span>
          <span style={{ color: colourGain }}>
            {' '}
            {overall.change_val} ({overall.change_percent}%)
          </span>
        </div>
        <br />
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          {stock.map((s) => (
            <Grid item xs={12} sm={6} md={3} key={stock.indexOf(s)}>
              <Card variant="outlined">
                <CardHeader
                  title={`Symbol : ${s.symbol}`}
                  subheader={`Changes : ${s.change_val}(${s.change_percent}%)`}
                />
                <CardContent>
                  <TextField
                    id="standard-read-only-input"
                    label="Buying Price"
                    value={s.orig_price}
                    variant="standard"
                  />
                  <TextField
                    id="standard-read-only-input"
                    label="Buying Price"
                    value={s.curr_price}
                    variant="standard"
                  />
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
