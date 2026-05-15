import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Wind, Droplets, Flame, Activity, Zap, Factory } from 'lucide-react';
import './index.css';

function App() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    Papa.parse('/india city aqi.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Filter out rows with missing vital data if necessary
        const validData = results.data.filter(row => row.aqi && row.city);
        setData(validData);
        setLoading(false);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setLoading(false);
      }
    });
  }, []);

  // Update data every 10 seconds
  useEffect(() => {
    if (data.length === 0) return;

    const intervalId = setInterval(() => {
      // Pick a random index or increment
      const nextIndex = Math.floor(Math.random() * data.length);
      setCurrentIndex(nextIndex);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [data]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>Loading Air Quality Data...</h2>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="loading-container">
        <h2>No data available. Please ensure the CSV file is present.</h2>
      </div>
    );
  }

  const currentData = data[currentIndex];
  
  // Determine color theme based on AQI category
  const category = currentData.aqi_category ? currentData.aqi_category.toLowerCase() : 'unknown';
  let themeClass = 'bg-default';
  let textClass = 'text-white';
  
  if (category.includes('good')) {
    themeClass = 'bg-good';
    textClass = 'text-good';
  } else if (category.includes('satisfactory')) {
    themeClass = 'bg-satisfactory';
    textClass = 'text-satisfactory';
  } else if (category.includes('moderate')) {
    themeClass = 'bg-moderate';
    textClass = 'text-moderate';
  } else if (category.includes('very poor')) {
    themeClass = 'bg-very-poor';
    textClass = 'text-very-poor';
  } else if (category.includes('poor')) {
    themeClass = 'bg-poor';
    textClass = 'text-poor';
  } else if (category.includes('severe')) {
    themeClass = 'bg-severe';
    textClass = 'text-severe';
  }

  // Ensure body background changes
  document.body.className = themeClass;

  const getMetricValue = (val) => (val !== undefined && val !== null && val !== '') ? Number(val).toFixed(1) : '--';

  return (
    <div className="dashboard-container">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="glass-card main-glass"
        >
          {/* Header */}
          <div className="header">
            <div className="location-info">
              {/* Removed location, title, and date as requested */}
            </div>
            <div className="live-indicator">
              <div className="pulse-dot"></div>
              LIVE PREDICTION
            </div>
          </div>

          {/* Main AQI Display */}
          <div className="aqi-main-display">
            <div className="aqi-circle">
              <div className="aqi-circle-inner">
                <span className="aqi-label">Overall AQI</span>
                <span className="aqi-value">{Math.round(currentData.aqi)}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 500 }}>Air Quality Level</h2>
              <div className={`aqi-category ${textClass}`}>
                {currentData.aqi_category || 'Unknown'}
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header"><Wind size={16} /> PM2.5</div>
              <div className="metric-value">{getMetricValue(currentData.pm25)} <span className="metric-unit">µg/m³</span></div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header"><Droplets size={16} /> PM10</div>
              <div className="metric-value">{getMetricValue(currentData.pm10)} <span className="metric-unit">µg/m³</span></div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header"><Factory size={16} /> NO2</div>
              <div className="metric-value">{getMetricValue(currentData.no2)} <span className="metric-unit">µg/m³</span></div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header"><Flame size={16} /> SO2</div>
              <div className="metric-value">{getMetricValue(currentData.so2)} <span className="metric-unit">µg/m³</span></div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header"><Activity size={16} /> CO</div>
              <div className="metric-value">{getMetricValue(currentData.co)} <span className="metric-unit">mg/m³</span></div>
            </div>
            
            <div className="metric-card">
              <div className="metric-header"><Zap size={16} /> O3</div>
              <div className="metric-value">{getMetricValue(currentData.o3)} <span className="metric-unit">µg/m³</span></div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
