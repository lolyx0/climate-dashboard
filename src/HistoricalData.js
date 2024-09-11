import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Paper, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";

const API_KEY = process.env.REACT_APP_MYWEATHER_API;

function HistoricalData() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const fetchWeatherData = async (cityName, countryCode, start, end) => {
    try {
      const response = await axios.get(
        `https://history.openweathermap.org/data/2.5/history/city`,
        {
          params: {
            q: `${cityName},${countryCode}`,
            type: "hour",
            start: start,
            end: end,
            appid: API_KEY,
            units: "metric",
          },
        }
      );
      setWeatherData(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch weather data");
    }
  };

  const handleSearch = async () => {
    if (!city || !country || !date) {
      setError("Please enter city, country, and date");
      return;
    }

    const startTimestamp = Math.floor(new Date(date).getTime() / 1000);
    const endTimestamp = startTimestamp + 86400;

    await fetchWeatherData(city, country, startTimestamp, endTimestamp);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div style={{ padding: "40px", paddingTop: "0px", paddingLeft: "95px" }}>
        <Typography sx={{ color: "#d6d6d6" }} variant="h6" gutterBottom>
          HISTORICAL WEATHER DATA
        </Typography>
      </div>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <TextField
            sx={{
              flexGrow: 1,
              "& .MuiInputBase-input": {
                color: "#ffffff",
              },
              "& .MuiInputLabel-root": {
                color: "#ffffff",
              },
              "& .MuiInputBase-root:hover": {
                borderColor: "#ffd100",
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#ffd100",
                },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#ffd100",
                },
              "& .MuiInputBase-input::placeholder": {
                color: "white",
              },
            }}
            label="City"
            variant="outlined"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            sx={{
              flexGrow: 1,
              "& .MuiInputBase-input": {
                color: "#ffffff",
              },
              "& .MuiInputLabel-root": {
                color: "#ffffff",
              },
              "& .MuiInputBase-root:hover": {
                borderColor: "#ffd100",
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#ffd100",
                },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#ffd100",
                },
              "& .MuiInputBase-input::placeholder": {
                color: "white",
              },
            }}
            label="Country"
            variant="outlined"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </Grid>
        <Grid item>
          <TextField
            sx={{
              flexGrow: 1,
              "& .MuiInputBase-input": {
                color: "#ffffff",
              },
              "& .MuiInputLabel-root": {
                color: "#ffffff",
              },
              "& .MuiInputBase-root:hover": {
                borderColor: "#ffd100",
              },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#ffd100",
                },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#ffd100",
                },
              "& .MuiInputBase-input::placeholder": {
                color: "white",
              },
            }}
            label="Date"
            variant="outlined"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              borderRadius: "10px",
              backgroundColor: "#ffd100",
              "&:hover": {
                backgroundColor: "#fff176",
                transition: "color 0.3s ease-in-out",
                textShadow: "0.3s ease-in-out",
                color: "#000000",
              },
            }}
          >
            SEARCH
          </Button>
        </Grid>
      </Grid>
      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}
      {weatherData && (
        <Grid
          container
          spacing={3}
          justifyContent="center"
          style={{ marginTop: "20px" }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Typography variant="h6">Temperature</Typography>
              <Typography>{weatherData.list[0].main.temp} °C</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Typography variant="h6">Wind Speed</Typography>
              <Typography>{weatherData.list[0].wind.speed} m/s</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Typography variant="h6">Humidity</Typography>
              <Typography>{weatherData.list[0].main.humidity} %</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={3} style={{ padding: "20px" }}>
              <Typography variant="h6">Pressure</Typography>
              <Typography>{weatherData.list[0].main.pressure} hPa</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </motion.div>
  );
}

export default HistoricalData;
