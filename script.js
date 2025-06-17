const apiKey = "511c8a9f4915723ac6b5adcd00fb5b05";

document.getElementById("cityInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});

function showLoading(show = true) {
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

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    showLoading(true);
    const response = await fetch(url);
    showLoading(false);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

async function getWeatherByLocation() {
  const resultDiv = document.getElementById("weatherResult");
  resultDiv.innerHTML = "";

  if (!navigator.geolocation) {
    resultDiv.innerHTML = "<p>Geolocation is not supported by your browser.</p>";
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
      showLoading(true);
      const response = await fetch(url);
      showLoading(false);

      if (!response.ok) throw new Error("Unable to fetch weather.");
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
  }, (error) => {
    resultDiv.innerHTML = `<p>Geolocation error: ${error.message}</p>`;
  });
}

function displayWeather(data) {
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const now = new Date().toLocaleString();

  const html = `
    <div class="weather-card">
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>${now}</p>
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
