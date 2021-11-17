import React from 'react';
import { useState, useEffect } from 'react';
import api from '../../api';
import { Box, TextField } from '@mui/material';

function TaxStatement() {
  const [income, setIncome] = useState(0);
  const [rate, setRate] = useState(0);
  const [tax, setTaxValue] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem('token') == null)
      return alert('Not loading the portfolio');

    api(
      `invested_performance/tax?token=${sessionStorage.getItem('token')}`,
      'GET'
    ).then((res) => {
      if (res) {
        setIncome(res.yearly_gain);
        setTaxValue(res.CGT);
        setRate(res.to_declare);
      }
    });
  }, []);

  return (
    <div class="text-center w-100 p-3">
      <form>
        <h1>Financial Information</h1>
      </form>

      <div>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          autoComplete="off"
        >
          <TextField
            id="standard-read-only-input"
            label="How much you gain from stocks so far:"
            value={`$${income}`}
            variant="standard"
          />
          <br />
          <TextField
            id="standard-read-only-input"
            label="Owned for more than a year(CGT):"
            value={`$${tax}`}
            variant="standard"
          />
          <br />
          <TextField
            id="standard-read-only-input"
            label="Otherwise, you have to declare:"
            value={`$${rate}`}
            variant="standard"
          />
        </Box>
      </div>
    </div>
  );
}

export default TaxStatement;
