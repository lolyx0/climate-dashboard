import React, { useState, useEffect } from "react";
import { TextField, Button, Paper, Typography, Grid, Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const API_KEY = process.env.REACT_APP_MYWEATHER_API;

export default function AirPollution() {
  const [city, setCity] = useState("");
  const [pollutionData, setPollutionData] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
          );
          const data = await response.json();
          setCity(data.name);
        } catch (error) {
          console.error("Error fetching city name:", error);
          setError("Unable to fetch your location. Please try again.");
        }
      },
      (error) => {
        console.error("Error fetching geolocation:", error);
        setError("Unable to fetch your location. Please try again.");
      }
    );
  }, []);

  useEffect(() => {
    if (coordinates.lat && coordinates.lon) {
      fetchPollutionData(coordinates.lat, coordinates.lon);
    }
  }, [coordinates]);

  const fetchCoordinates = async (city) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
      );
      if (!response.ok) throw new Error("City not found");
      const data = await response.json();
      setCoordinates({
        lat: data.coord.lat,
        lon: data.coord.lon,
      });
      setError("");
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setError("Invalid city name. Please enter a valid city.");
    }
  };

  const fetchPollutionData = async (lat, lon) => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      if (!response.ok) throw new Error("Data fetch error");
      const data = await response.json();
      setPollutionData(data);
      setError("");
    } catch (error) {
      console.error("Error fetching air pollution data:", error);
      setError("Unable to fetch pollution data. Please try again later.");
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchCoordinates(city.trim());
    } else {
      setError("City name cannot be empty.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const fadeInAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 },
  };

  return (
    <div style={{ padding: "40px", paddingTop: "0px", paddingLeft: "95px" }}>
      <Typography sx={{ color: "#d6d6d6" }} variant="h6" gutterBottom>
        AIR POLLUTION FORECAST
      </Typography>
      <Box display="flex" gap={2} mb={3} alignItems="center">
        <TextField
          variant="outlined"
          size="small"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter city name"
          sx={{
            flexGrow: 1,
            "& .MuiInputBase-input": {
              color: "#ffffff",
              animation: `${fadeInAnimation} 0.3s ease-in-out`,
            },
            "& .MuiInputLabel-root": {
              color: "#ffffff",
            },
            "& .MuiInputBase-root:hover": {
              borderColor: "#ffd100",
            },
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
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
          style={{ marginRight: "10px" }}
        />

        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            borderRadius: "50px 2px 50px 2px",
            backgroundColor: "#ffd100",
            "&:hover": {
              backgroundColor: "#fff176",
              transition: "color 0.3s ease-in-out",
              textShadow: "0.3s ease-in-out",
              color: "#000000",
            },
          }}
        >
          <SearchRoundedIcon />
        </Button>
      </Box>

      {error && (
        <Typography sx={{ color: "red", marginBottom: "20px" }} variant="body1">
          {error}
        </Typography>
      )}

      {pollutionData && (
        <Grid container spacing={3} style={{ marginTop: "20px" }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                sx={{
                  backgroundColor: "#333533",
                  borderRadius: "22px",
                  boxShadow:
                    "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
                elevation={3}
                style={{
                  padding: "20px",
                  paddingBottom: "66px",
                }}
              >
                <Typography sx={{ color: "#ffee32" }} variant="h6" gutterBottom>
                  Air Quality Index (AQI) for {city}
                </Typography>
                <Typography
                  sx={{ color: "#fef9ef" }}
                  variant="body1"
                  gutterBottom
                >
                  AQI Level: {pollutionData.list[0].main.aqi}
                </Typography>

                <Typography sx={{ color: "#ffee32" }} variant="h6" gutterBottom>
                  Pollutants (Concentration in µg/m³):
                </Typography>
                <Typography sx={{ color: "#fef9ef" }} variant="body1">
                  PM2.5: {pollutionData.list[0].components.pm2_5} µg/m³
                </Typography>
                <Typography sx={{ color: "#fef9ef" }} variant="body1">
                  PM10: {pollutionData.list[0].components.pm10} µg/m³
                </Typography>
                <Typography sx={{ color: "#fef9ef" }} variant="body1">
                  CO: {pollutionData.list[0].components.co} µg/m³
                </Typography>
                <Typography sx={{ color: "#fef9ef" }} variant="body1">
                  NO: {pollutionData.list[0].components.no} µg/m³
                </Typography>
                <Typography sx={{ color: "#fef9ef" }} variant="body1">
                  NO2: {pollutionData.list[0].components.no2} µg/m³
                </Typography>
                <Typography sx={{ color: "#fef9ef" }} variant="body1">
                  O3: {pollutionData.list[0].components.o3} µg/m³
                </Typography>
                <Typography sx={{ color: "#fef9ef" }} variant="body1">
                  SO2: {pollutionData.list[0].components.so2} µg/m³
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                sx={{
                  backgroundColor: "#333533",
                  borderRadius: "22px",
                  boxShadow:
                    "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
                elevation={3}
                style={{
                  padding: "20px",
                  paddingBottom: "55px",
                }}
              >
                <Typography sx={{ color: "#ffee32" }} variant="h6" gutterBottom>
                  Pollutants Over Time
                </Typography>
                <Line
                  data={{
                    labels: pollutionData.list.map(
                      (_, index) => `Hour ${index + 1}`
                    ),
                    datasets: [
                      {
                        label: "PM2.5 (µg/m³)",
                        data: pollutionData.list.map(
                          (data) => data.components.pm2_5
                        ),
                        borderColor: "#ffcc00",
                        fill: false,
                      },
                      {
                        label: "PM10 (µg/m³)",
                        data: pollutionData.list.map(
                          (data) => data.components.pm10
                        ),
                        borderColor: "#00bcd4",
                        fill: false,
                      },
                    ],
                  }}
                />
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
