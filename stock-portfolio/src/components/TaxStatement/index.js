import React from 'react'
import { useState, useEffect } from 'react'
import api from '../../api'
import { Box, TextField } from '@mui/material'
import Loader from '../Loader'

function TaxStatement () {
  const [isLoading, setIsLoading] = useState(false)
  const [prevI, setPrevI] = useState(0)
  const [income, setIncome] = useState(0)
  const [rate, setRate] = useState(0)
  const [tax, setTaxValue] = useState(0)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('token') == null) return alert("Not loading the portfolio");

    setIsLoading(true)
    api(
      `invested_performance/tax?token=${localStorage.getItem('token')}`,
      'GET'
    ).then(res => {
      if (res.CGT) {
        setIncome(res.yearly_gain)
        setTaxValue(res.CGT)
        setRate(res.to_declare)
      } else {
        alert('No Stocks yet')
      }
    })
    setIsLoading(false)
  }, [])


  return (
    <div class="text-center w-100 p-3">
      <form>
        <h1>
          Financial Information
        </h1>
      </form>

      <div>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' }
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
  )
}

export default TaxStatement
