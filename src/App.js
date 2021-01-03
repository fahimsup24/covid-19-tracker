import './App.css';
import React, { useEffect, useState } from 'react'
import { Select, FormControl, MenuItem, Card, CardContent } from '@material-ui/core';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import { sortData } from './util';
import LineGraph from './components/LineGraph';
import 'leaflet/dist/leaflet.css'

// STATE = How to write a variable in React

// https://disease.sh/v3/covid-19/countries

// USEEFFECT = Runs a piece of code based on a given condition.

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 90, lng: 65 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data)
    });
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value

    setCountry(countryCode)

    const url = 
      countryCode === 'worldwide'
       ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode)
      setCountryInfo(data)

      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4)
    });
  };

  useEffect(() => {
    // the code here will run once when the component loads and not again.
    // if there is a variable in the '[]' it will run only when the variable changes
    // async -> send a request, wait for it, do something with it

    const getCountriesData = async () => {
      await fetch ('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));

        const sortedData = sortData(data);
        setTableData(sortedData)
        setMapCountries(data)
        setCountries(countries)
      });
    };

    getCountriesData()
  }, []);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className='app__dropdown'>
            <Select onChange={onCountryChange} variant='outlined' value={country}>
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        
        
        <div className="app__stats">
            <InfoBox title='Coronavirus Cases' cases={countryInfo.todayCases} total={countryInfo.cases} />
            <InfoBox title='Recovered' cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
            <InfoBox title='Deaths' cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>
        <Map 
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide New Cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
      
    </div>
  );
}

export default App;
