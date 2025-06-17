const apiKey = "511c8a9f4915723ac6b5adcd00fb5b05";

function showLoading(show) {
  document.getElementById("loading").style.display = show ? "block" : "none";
}

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const resultDiv = document.getElementById("weatherResult");
  resultDiv.innerHTML = "";
  if (!city) {
    resultDiv.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  showLoading(true);

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  } finally {
    showLoading(false);
  }
}

function getWeatherByLocation() {
  const resultDiv = document.getElementById("weatherResult");
  resultDiv.innerHTML = "";
  showLoading(true);

  if (!navigator.geolocation) {
    showLoading(false);
    resultDiv.innerHTML = "<p>Geolocation is not supported by your browser.</p>";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch weather data.");
        const data = await response.json();
        displayWeather(data);
      } catch (error) {
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
      } finally {
        showLoading(false);
      }
    },
    (error) => {
      showLoading(false);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          resultDiv.innerHTML = "<p>Permission denied. Please allow location access.</p>";
          break;
        case error.TIMEOUT:
          resultDiv.innerHTML = "<p>Location request timed out.</p>";
          break;
        default:
          resultDiv.innerHTML = `<p>Geolocation error: ${error.message}</p>`;
      }
    },
    {
      enableHighAccuracy: false,
      timeout: 8000, // 8 seconds
      maximumAge: 0,
    }
  );
}

function displayWeather(data) {
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  const html = `
    <div class="weather-card">
      <h2>${data.name}, ${data.sys.country}</h2>
      <img src="${iconUrl}" alt="${data.weather[0].description}" />
      <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
      <p><strong>Feels Like:</strong> ${data.main.feels_like} °C</p>
      <p><strong>Condition:</strong> ${data.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
      <p><strong>Wind:</strong> ${data.wind.speed} m/s</p>
    </div>
  `;
  document.getElementById("weatherResult").innerHTML = html;
}
