import React, { useState, useEffect } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import { Button, ButtonGroup, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import "./WeatherMap.css";

const CustomButton = styled(motion(Button))(({ theme }) => ({
  borderColor: "#ffcc00",
  color: "#ffcc00",
  width: "100%",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    backgroundColor: "#ffcc00",
    borderColor: "#ffcc00",
    color: "#fff",
  },
}));

const WeatherMap = () => {
  const [weatherLayer, setWeatherLayer] = useState("clouds_new");
  const API_KEY = process.env.REACT_APP_MYWEATHER_API;

  useEffect(() => {
    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          }),
          zIndex: 0,
        }),
        new TileLayer({
          source: new XYZ({
            url: `https://tile.openweathermap.org/map/${weatherLayer}/{z}/{x}/{y}.png?appid=${API_KEY}`,
          }),
          zIndex: 1,
        }),
      ],
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });

    const updateWeatherLayer = () => {
      map
        .getLayers()
        .item(1)
        .setSource(
          new XYZ({
            url: `https://tile.openweathermap.org/map/${weatherLayer}/{z}/{x}/{y}.png?appid=${API_KEY}`,
          })
        );
    };

    updateWeatherLayer();

    return () => map.setTarget(undefined);
  }, [weatherLayer, API_KEY]);

  const getGradientBackground = (layer) => {
    switch (layer) {
      case "temp_new":
        return "linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)";
      case "precipitation_new":
        return "linear-gradient(to right, #ffffff, #00ffff, #0000ff)";
      case "wind_new":
        return "linear-gradient(to right, #ffff00, #ffcc00, #ff6600, #cc0000)";
      default:
        return "linear-gradient(to right, #cccccc, #666666)";
    }
  };

  return (
    <div className="weather-map-container">
      <div className="weather-map-sidebar">
        <Typography
          sx={{ color: "#d6d6d6", marginBottom: "20px" }}
          variant="h6"
        >
          WEATHER MAP
        </Typography>
        <ButtonGroup
          variant="outlined"
          orientation="vertical"
          style={{ width: "100%" }}
        >
          <CustomButton
            onClick={() => setWeatherLayer("clouds_new")}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 10px rgba(255, 204, 0, 0.5)",
            }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Clouds
          </CustomButton>
          <CustomButton
            onClick={() => setWeatherLayer("precipitation_new")}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 10px rgba(255, 204, 0, 0.5)",
            }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Precipitation
          </CustomButton>
          <CustomButton
            onClick={() => setWeatherLayer("wind_new")}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 10px rgba(255, 204, 0, 0.5)",
            }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Wind
          </CustomButton>
          <CustomButton
            onClick={() => setWeatherLayer("temp_new")}
            whileHover={{
              scale: 1.1,
              boxShadow: "0px 0px 10px rgba(255, 204, 0, 0.5)",
            }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Temperature
          </CustomButton>
        </ButtonGroup>
        <Paper elevation={3} className="map-key">
          <Typography variant="h6" sx={{ color: "#ffffff" }}>
            Map Key
          </Typography>
          <div style={{ marginTop: "10px" }}>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", marginBottom: "10px" }}
            >
              <strong>Temperature:</strong> Represents temperature variations.
            </Typography>
            <div
              style={{
                height: "20px",
                background: getGradientBackground("temp_new"),
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            ></div>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", marginBottom: "10px" }}
            >
              <strong>Precipitation:</strong> Displays precipitation levels.
            </Typography>
            <div
              style={{
                height: "20px",
                background: getGradientBackground("precipitation_new"),
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            ></div>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", marginBottom: "10px" }}
            >
              <strong>Wind:</strong> Indicates wind speed and direction.
            </Typography>
            <div
              style={{
                height: "20px",
                background: getGradientBackground("wind_new"),
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            ></div>
          </div>
        </Paper>
      </div>
      <div className="weather-map-content">
        <div id="map"></div>
      </div>
    </div>
  );
};

export default WeatherMap;
