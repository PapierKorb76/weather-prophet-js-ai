import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';

function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const USERNAME = 'none_ira_giuseppefrancesco';
  const PASSWORD = 'qMv0O3Sd1x';
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.meteomatics.com/2024-02-06T00:00:00Z--2024-02-09T00:00:00Z:PT1H/t_2m:C/52.520551,13.461804/json`,
          {
            auth: {
              username: USERNAME,
              password: PASSWORD
            }
          }
        );

        // Extract temperature data from the response
        const temperatureData = response.data?.data[0]?.coordinates[0]?.dates.map(entry => entry.value);

        // Set weather data state
        setWeatherData(temperatureData);

        // Assuming TensorFlow.js model prediction
        const prediction = await runModel(temperatureData);
        setPrediction(prediction);
      } catch (error) {
        console.error('Error during API request:', error);
      }
    };

    fetchData();
  }, []);

  // Sample TensorFlow.js model for demonstration
  async function runModel(inputData) {
    try {
      // Load model
      const model = await tf.loadLayersModel('url_of_your_model');
      // Process input data
      const inputTensor = tf.tensor2d(inputData, [1, inputData.length]);
      // Make prediction
      const outputTensor = model.predict(inputTensor);
      // Get prediction value
      const prediction = outputTensor.dataSync()[0];
      return prediction;
    } catch (error) {
      console.error('Error running model:', error);
      return null;
    }
  }

  return (
    <div className="weather-app">
      <h1>Weather App</h1>
      {weatherData && (
        <div>
          <p>Temperature Data: {JSON.stringify(weatherData)}</p>
        </div>
      )}
      {prediction !== null && (
        <p>Model Prediction: {prediction.toFixed(2)}</p>
      )}
    </div>
  );
}

export default WeatherApp;
