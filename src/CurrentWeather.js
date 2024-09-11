import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import "./CurrentWeather.css";

import CloudTwoToneIcon from "@mui/icons-material/CloudTwoTone";
import WbCloudyTwoToneIcon from "@mui/icons-material/WbCloudyTwoTone";
import AcUnitTwoToneIcon from "@mui/icons-material/AcUnitTwoTone";

import WbSunnyTwoToneIcon from "@mui/icons-material/WbSunnyTwoTone";
import axios from "axios";
import WaterRoundedIcon from "@mui/icons-material/WaterRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import WbTwilightRoundedIcon from "@mui/icons-material/WbTwilightRounded";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { keyframes } from "@emotion/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const fadeInAnimation = keyframes`
  from {
    border-color: transparent;
  }
  to {
    border-color: #ffd100;
  }
`;

const zoomInAnimation = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
`;

const weatherIcons = {
  Clear: <WbSunnyTwoToneIcon style={{ color: "#ffcc00" }} fontSize="large" />,
  Clouds: <CloudTwoToneIcon style={{ color: "#90a4ae" }} fontSize="large" />,
  Rain: <WbCloudyTwoToneIcon style={{ color: "#4fc3f7" }} fontSize="large" />,
  Snow: <AcUnitTwoToneIcon style={{ color: "#00bcd4" }} fontSize="large" />,
};

const ImageCard = ({ src, alt, cityName }) => (
  <>
    <img src={src} alt={alt} className="image-card-img" />
    <Typography variant="h2" className="city-name">
      {cityName}
    </Typography>
  </>
);

export default function CurrentWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [city, setCity] = useState("Amman");
  const [searchCity, setSearchCity] = useState("");
  const [view, setView] = useState("today");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_KEY = process.env.REACT_APP_MYWEATHER_API;

  useEffect(() => {
    if (city) {
      setLoading(true);

      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        )
        .then((response) => {
          setWeatherData(response.data);
          setError("");
        })
        .catch((error) => {
          console.error("Error fetching current weather data:", error);
          setWeatherData(null);
          setError("Invalid city name. Please try again.");
        });

      axios
        .get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        )
        .then((response) => {
          setHourlyData(response.data.list.slice(0, 12));

          const dailyData = response.data.list.filter((data) =>
            data.dt_txt.includes("12:00:00")
          );
          setDailyData(dailyData);
        })
        .catch((error) => {
          console.error("Error fetching hourly and daily weather data:", error);
          setHourlyData([]);
          setDailyData([]);
          setError("Invalid city name. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [city, API_KEY]);

  const handleSearch = () => {
    if (searchCity.trim() !== "") {
      setCity(searchCity);
      setSearchCity("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const pressurePercentage = (pressure) => {
    const minPressure = 950;
    const maxPressure = 1050;
    return ((pressure - minPressure) / (maxPressure - minPressure)) * 100;
  };

  const windSpeedPercentage = (speed) => {
    const maxSpeed = 100;
    return (speed / maxSpeed) * 100;
  };

  const chartData = {
    labels: hourlyData.map((data) => formatTime(data.dt)),
    datasets: [
      {
        label: "Temperature (°C)",
        data: hourlyData.map((data) => data.main.temp),
        borderColor: "#ffcc00",
        backgroundColor: "rgba(255, 204, 0, 0.2)",
        fill: true,
        pointStyle: "circle",
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: "#ffcc00",
        pointBorderColor: "#333533",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
          color: "#ffffff",
        },
        ticks: {
          color: "#ffffff",
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
          color: "#ffffff",
        },
        ticks: {
          color: "#ffffff",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
    },
  };

  return (
    <Container>
      <Typography sx={{ color: "#d6d6d6" }} variant="h6" gutterBottom>
        CURRENT WEATHER
      </Typography>
      <Box display="flex" gap={2} mb={3} alignItems="center">
        <TextField
          variant="outlined"
          size="small"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e)}
          placeholder="Enter city name"
          sx={{
            width: "30px",
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
        <Button
          variant="outlined"
          sx={{
            borderColor: "#ffd100",
            color: "#ffd100",
            borderWidth: "2px",
            "&:hover": {
              borderColor: "#fff176",
              color: "#fff176",
            },
          }}
          onClick={() => setView("today")}
        >
          TODAY
        </Button>
        <Button
          variant="outlined"
          sx={{
            borderColor: "#ffd100",
            color: "#ffd100",
            width: "auto",

            borderWidth: "2px",
            "&:hover": {
              borderColor: "#fff176",
              color: "#fff176",
            },
          }}
          onClick={() => setView("next7days")}
        >
          NEXT 7 DAYS
        </Button>
      </Box>

      {error && (
        <Typography color="error" variant="body1" align="center" mb={2}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {view === "today" && weatherData && (
            <Box display="flex">
              <Grid container spacing={3} style={{ flex: 1 }}>
                <Grid item xs={12} md={3}>
                  <Paper
                    sx={{
                      backgroundColor: "#333533",
                      borderRadius: "22px",
                      boxShadow:
                        "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        animation: `${zoomInAnimation} 0.2s ease-in-out`,
                      },
                    }}
                    elevation={3}
                    style={{
                      padding: "20px",
                      paddingBottom: "55px",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      style={{ color: "white" }}
                      variant="h6"
                      gutterBottom
                    >
                      Temperature
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      flexDirection="column"
                    >
                      {weatherIcons[weatherData.weather[0].main] || (
                        <WbSunnyTwoToneIcon
                          style={{ color: "#ffcc00" }}
                          fontSize="large"
                        />
                      )}
                      <Typography
                        style={{ color: "white", marginTop: "10px" }}
                        variant="body1"
                      >
                        {weatherData.main.temp}°C
                      </Typography>
                      <Typography variant="body2" color="white">
                        {weatherData.weather[0].description}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Paper
                    sx={{
                      backgroundColor: "#333533",
                      borderRadius: "22px",
                      boxShadow:
                        "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        animation: `${zoomInAnimation} 0.2s ease-in-out`,
                      },
                    }}
                    elevation={3}
                    style={{
                      padding: "20px",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Pressure
                    </Typography>
                    <Typography variant="body1">
                      {weatherData.main.pressure} hPa
                    </Typography>
                    <Box position="relative" display="inline-flex">
                      <CircularProgress
                        variant="determinate"
                        value={pressurePercentage(weatherData.main.pressure)}
                        size={100}
                        thickness={4}
                        style={{ color: "#ffee32", textAlign: "center" }}
                      />

                      <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Typography
                          variant="caption"
                          component="div"
                          color="white"
                        >
                          {`${Math.round(
                            pressurePercentage(weatherData.main.pressure)
                          )}%`}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={2.2}>
                  <Paper
                    sx={{
                      backgroundColor: "#333533",
                      borderRadius: "22px",
                      boxShadow:
                        "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        animation: `${zoomInAnimation} 0.2s ease-in-out`,
                      },
                    }}
                    elevation={3}
                    style={{ padding: "20px", paddingBottom: "26.3px" }}
                  >
                    <WbTwilightRoundedIcon
                      textAlign="center"
                      style={{ color: "#ffcc00" }}
                      fontSize="small"
                    />
                    <Typography style={{ color: "white" }} variant="h6">
                      Sunrise: {formatTime(weatherData.sys.sunrise)}
                    </Typography>
                    <Typography style={{ color: "white" }} variant="h6">
                      Sunset: {formatTime(weatherData.sys.sunset)}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Paper
                    sx={{
                      backgroundColor: "#333533",
                      borderRadius: "22px",
                      boxShadow:
                        "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        animation: `${zoomInAnimation} 0.2s ease-in-out`,
                      },
                    }}
                    elevation={3}
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      paddingBottom: "27.4px",
                    }}
                  >
                    <Typography
                      style={{ color: "white" }}
                      variant="h6"
                      gutterBottom
                    >
                      Wind Speed
                    </Typography>
                    <Typography style={{ color: "white" }} variant="body1">
                      {(weatherData.wind.speed * 3.6).toFixed(2)} km/h
                    </Typography>
                    <Box
                      position="relative"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <CircularProgress
                        variant="determinate"
                        value={windSpeedPercentage(
                          weatherData.wind.speed * 3.6
                        )}
                        size={100}
                        thickness={4}
                        style={{
                          transform: "rotate(-90deg)",
                          color: "#ffee32",
                        }}
                      />
                      <Box
                        top={0}
                        left={0}
                        bottom={0}
                        right={0}
                        position="absolute"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Typography
                          variant="caption"
                          component="div"
                          color="white"
                        >
                          {`${Math.round(
                            windSpeedPercentage(weatherData.wind.speed * 3.6)
                          )}%`}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Paper
                    sx={{
                      backgroundColor: "#333533",
                      borderRadius: "22px",
                      boxShadow:
                        "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        animation: `${zoomInAnimation} 0.2s ease-in-out`,
                      },
                    }}
                    elevation={3}
                    style={{
                      padding: "20px",
                      color: "white",
                      height: "190px",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      position="relative"
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      marginTop={5}
                    >
                      <WaterRoundedIcon
                        style={{ color: "#ffcc00" }}
                        fontSize="large"
                      />

                      <Typography variant="h6" gutterBottom>
                        Humidity
                      </Typography>
                      <Typography variant="body1">
                        {weatherData.main.humidity}%
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4.2}>
                  <Paper
                    sx={{
                      backgroundColor: "#333533",
                      borderRadius: "22px",
                      boxShadow:
                        "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        animation: `${zoomInAnimation} 0.2s ease-in-out`,
                      },
                    }}
                    elevation={3}
                    style={{
                      padding: "20px",
                      color: "white",
                      height: "230px",
                      textAlign: "center",
                      boxSizing: "border-box",
                    }}
                  >
                    <Typography variant="h6" gutterBottom textAlign="center">
                      Temperature by Hours
                    </Typography>
                    <div style={{ height: "170px" }}>
                      <Line data={chartData} options={chartOptions} />
                    </div>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Paper
                    className="image-card"
                    sx={{
                      backgroundColor: "#333533",
                      borderRadius: "22px",
                      boxShadow:
                        "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        animation: `${zoomInAnimation} 0.2s ease-in-out`,
                      },
                    }}
                    elevation={3}
                    style={{
                      color: "white",
                      height: "230px",

                      textAlign: "center",
                      boxSizing: "border-box",
                    }}
                  >
                    
                    <ImageCard
                      src="https://w0.peakpx.com/wallpaper/918/421/HD-wallpaper-partly-cloudy-clouds-nature-sky-weather.jpg"
                      alt="Weather illustration"
                      cityName={city}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {view === "next7days" && (
            <Grid container spacing={3}>
              {dailyData.map((day, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    sx={{
                      backgroundColor: "#333533",
                      padding: "16px",
                      textAlign: "center",

                      borderRadius: "22px",
                      boxShadow:
                        "rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                        animation: `${zoomInAnimation} 0.2s ease-in-out`,
                      },
                    }}
                  >
                    <Typography variant="h6" color="#ffd100" gutterBottom>
                      {formatDate(day.dt)}
                    </Typography>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      mb={2}
                    >
                      {weatherIcons[day.weather[0].main] || (
                        <WbSunnyTwoToneIcon />
                      )}
                    </Box>
                    <Typography variant="body2" color="#ffffff">
                      {day.weather[0].description}
                    </Typography>
                    <Typography variant="body2" color="#ffffff">
                      Temperature: {day.main.temp}°C
                    </Typography>
                    <Typography variant="body2" color="#ffffff">
                      Humidity: {day.main.humidity}%
                    </Typography>
                    <Typography variant="body2" color="#ffffff">
                      Wind Speed: {day.wind.speed} m/s
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
}
