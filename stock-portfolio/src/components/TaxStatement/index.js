import React from 'react'
import { useState, useEffect } from 'react'
import api from '../../api'
import { Box, TextField } from '@mui/material'
<<<<<<< HEAD
import Loader from '../Loader';
=======
import Loader from '../Loader'
>>>>>>> HR3900-36-tax

function TaxStatement () {
  const [isLoading, setIsLoading] = useState(false)
  const [prevI, setPrevI] = useState(0)
  const [income, setIncome] = useState(0)
  const [rate, setRate] = useState(0)
  const [tax, setTaxValue] = useState(0)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
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

  const fetchRate = () => {
    let value = 0
    if (income > 18200 && income < 37001) {
      value = 19
    } else if (income > 45200 && income < 120001) {
      value = 32.5
    } else if (income > 120000 && income < 180001) {
      value = 37
    } else if (income > 180000) {
      value = 45
    }

    setRate(value)
    fetchTaxValue(value)
  }

  const fetchTaxValue = value => {
    setTaxValue(income * value / 100)
  }

  function edit () {
    setPrevI(income)
    setEditing(true)
  }

  function handleUpdate () {
    setEditing(false)
    fetchRate()
  }

  return (
    <div class="text-center w-100 p-3">
      <form>
        <h1>
          Financial Information
          {/* {!editing && (
            <button class="btn btn-lg btn-link btn-block" onClick={edit}>
              Edit
            </button>
          )} */}
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
          <div>
            <TextField
              id="standard-read-only-input"
              label="How much you gain from stocks so far:"
              value={`$${income}`}
              InputProps={{
                readOnly: !editing
              }}
              // onChange={e => setIncome(e.target.value)}
              variant="standard"
            />
          </div>
          <br />
          {!editing && (
            <div>
              <TextField
                id="standard-read-only-input"
                label="Owned for more than a year(CGT):"
                value={`$${tax}`}
                InputProps={{
                  readOnly: !editing
                }}
                variant="standard"
              />
            </div>
          )}
          <br />
          {!editing && (
            <div>
              <TextField
                id="standard-read-only-input"
                label="Otherwise, you have to declare:"
                value={`$${rate}`}
                InputProps={{
                  readOnly: !editing
                }}
                variant="standard"
              />
            </div>
          )}
          {editing && (
            <div>
              <button
                class="btn-primary"
                onClick={() => {
                  setEditing(false)
                  setIncome(prevI)
                }}
              >
                Cancel
              </button>
              <button class="btn-primary" onClick={handleUpdate}>
                Update
              </button>
            </div>
          )}
        </Box>
      </div>
    </div>
  )
}

export default TaxStatement
