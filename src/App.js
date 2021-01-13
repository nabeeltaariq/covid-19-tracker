import React, { useState, useEffect } from 'react'
import { Select, MenuItem, Card, CardContent } from '@material-ui/core'
import { FormControl } from '@material-ui/core'
import './App.css'
import Infobox from './Infobox'

import Table from './Table'
import { sortData } from './util'
import LineGraph from './LineGraph'
import Mapper from './Mapper'
import 'leaflet/dist/leaflet.css'
function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
  const [mapCountries, setMapCountries] = useState([])
  const [mapZoom, setMapZoom] = useState(3)

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
          setMapCountries(data)

          setMapCenter([data.countryInfo.lat, data.countryInfo.long])
          setMapZoom(4)
        })
    }
    a()
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
        <Mapper countries={mapCountries} zoom={mapZoom} center={mapCenter} />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>

          <Table countries={tableData} />
          <h3>Worldwide new Cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  )
}

export default App
