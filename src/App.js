import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import HistoricalData from "./HistoricalData";
import CurrentWeather from "./CurrentWeather";
import WeatherMap from "./WeatherMap";
import AirPollution from "./AirPollution";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<CurrentWeather />} />
        <Route path="/Current weather" element={<CurrentWeather />} />
        <Route path="/Historical data" element={<HistoricalData />} />
        <Route path="/Weather map" element={<WeatherMap />} />
        <Route path="/Air pollution" element={<AirPollution />} />
      </Routes>
    </Router>
  );
};

export default App;
