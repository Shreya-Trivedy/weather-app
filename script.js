let currentData = null;
let isFahrenheit = false;

function toggleUnit() {
  isFahrenheit = document.getElementById('unitToggle').checked;
  if (currentData) {
    renderWeather(currentData);
  }
}

async function getWeather() {
  const location = document.getElementById('locationInput').value.trim();
  if (!location) {
    showError('⚠️ Please enter a location.');
    return;
  }
  fetchWeather(location);
}

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const coords = `${position.coords.latitude},${position.coords.longitude}`;
      fetchWeather(coords);
    }, () => {
      showError('⚠️ Unable to access your location.');
    });
  } else {
    showError('⚠️ Geolocation not supported.');
  }
}

async function fetchWeather(query) {
  const weatherInfo = document.getElementById('weatherInfo');
  const errorMsg = document.getElementById('errorMsg');

  errorMsg.innerText = '';
  weatherInfo.innerHTML = '<p>Loading...</p>';

  const API_KEY = 'aa90273cae784e02a4e94340250907';
  const URL = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}&aqi=yes`;

  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data.error) {
      showError(data.error.message);
      return;
    }

    currentData = data;
    renderWeather(data);
  } catch (error) {
    showError('❌ Unable to fetch data. Please try again later.');
    console.error(error);
  }
}

function renderWeather(data) {
  const weatherInfo = document.getElementById('weatherInfo');

  const temp = isFahrenheit ? data.current.temp_f + '°F' : data.current.temp_c + '°C';
  const feelsLike = isFahrenheit ? data.current.feelslike_f + '°F' : data.current.feelslike_c + '°C';

  const html = `
    <img src="https:${data.current.condition.icon}" alt="Weather Icon" />
    <div class="temp">${temp}</div>
    <div class="desc">${data.current.condition.text}</div>
    <div class="desc">📍 ${data.location.name}, ${data.location.country}</div>
    <div class="details">
      <p><strong>Feels Like:</strong> ${feelsLike}</p>
      <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
      <p><strong>Wind:</strong> ${data.current.wind_kph} kph</p>
      <p><strong>Air Quality (PM2.5):</strong> ${data.current.air_quality.pm2_5.toFixed(2)}</p>
      <p><strong>Last Updated:</strong> ${data.current.last_updated}</p>
    </div>
  `;

  weatherInfo.innerHTML = html;
}

function showError(message) {
  document.getElementById('weatherInfo').innerHTML = '';
  document.getElementById('errorMsg').innerText = message;
}
