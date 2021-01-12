import React, { useState, useEffect } from 'react'
import { Select, MenuItem, Card, CardContent } from '@material-ui/core'
import { FormControl } from '@material-ui/core'
import './App.css'
import Infobox from './Infobox'
import Map from './Map'
import Table from './Table'
import { sortData } from './util'
function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])

  //state is something that sets value
  //https://disease.sh/v3/covid-19/countries
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data)
      })
  }, [])
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2, //UK,USA
          }))

          let sortedData = sortData(data)
          console.log(sortedData)
          setCountries(countries)
          setTableData(sortedData)
        })
    }
    getCountriesData()
  }, [])

  const onCountryChange = (event) => {
    const countryCode = event.target.value

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    const a = async () => {
      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setCountry(countryCode)
          setCountryInfo(data)
        })
    }
    a()
    console.log(countryInfo)
  }

  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>Covid-19 Tracker</h1>
          <FormControl className='app__dropdown'>
            <Select
              onClick={onCountryChange}
              variant='outlined'
              value={country}
            >
              <MenuItem value='worldwide'>{country}</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className='app__stats'>
          <Infobox
            title='Coronavirus Cases'
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />

          <Infobox
            title=' Recovered'
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <Infobox
            title=' Deaths'
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>
        <Map></Map>
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>

          <Table countries={tableData} />
          <h3>Worldwide new Cases</h3>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
