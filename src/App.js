import React, { useState, useEffect } from 'react'
import { Select, MenuItem } from '@material-ui/core'
import { FormControl } from '@material-ui/core'
import './App.css'

function App() {
  const [countries, setCountries] = useState([])
  //state is something that sets value
  //https://disease.sh/v3/covid-19/countries

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2, //UK,USA
          }))

          setCountries(countries)
        })
    }
    getCountriesData()
  }, [])

  return (
    <div className='app'>
      <div className='app__header'>
        <h1>Covid-19 Tracker</h1>
        <FormControl className='app__dropdown'>
          <Select variant='outlined' value='abc'>
            <MenuItem value='worlwide'>Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Header */}
      {/* Title + Select input down field */}
      {/* infoBox */}
      {/* infoBoxes */}
      {/* Table */}
      {/* Graph */}
      {/* Map */}
    </div>
  )
}

export default App
