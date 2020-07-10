const userFormEl = document.querySelector("#user-form");
const cityInputEl = document.querySelector("#city-name");
const cityNameEl = document.querySelector("#city-name-span");
const dateEl = document.querySelector("#date-span");
const temperatureEl = document.querySelector("#temperature-span");
const humidityEl = document.querySelector("#humidity-span");
const windSpeedEl = document.querySelector("#wind-speed-span");
const uvIndexEl = document.querySelector("#uv-index-span");

const formSubmitHandler = function() {
    event.preventDefault();
    // get value from input
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getForecast(cityName);
        cityNameEl.value = '';
    }
    else {
        alert("Please enter a valid city!");
    }
};

const getForecast = function(city) {
    // format weather api url
    const apiKey = `bb7e1bece1c4e598bb1f8819dfe626cd`;
    const currentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    // make request to api
    fetch(currentWeatherApiUrl)
    .then(function(currentWeatherResponse) {
        if (currentWeatherResponse.ok) {
            return currentWeatherResponse.json();
        }
        else {
            alert("Please enter a valid city and try again!")
        }    
    })
    .then(function(currentWeatherResponse) {
        const lat = currentWeatherResponse.coord.lat;
        const lon = currentWeatherResponse.coord.lon;

        const unixTimestamp = currentWeatherResponse.dt;
        const milliseconds = unixTimestamp * 1000
        const dateObject = new Date(milliseconds)
        const humanDateFormat = dateObject.toLocaleString()

        cityNameEl.textContent = currentWeatherResponse.name;
        dateEl.textContent = humanDateFormat
                
        return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`);
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        cityInputEl.textContent = ``;
        temperatureEl.textContent= ` ${data.current.temp}°F`;
        humidityEl.textContent = ` ${data.current.humidity}%`;
        windSpeedEl.textContent = ` ${data.current.wind_speed} Mph`;
        uvIndexEl.textContent = ` ${data.current.uvi}`;


        if (uvIndexEl.textContent <= 3.3) {
            uvIndexEl.setAttribute("class", "bg-success border border-success rounded");
        }
        else if (uvIndexEl.textContent > 3.3 && uvIndexEl.textContent <= 6.6) {
            uvIndexEl.setAttribute("class", "bg-warning  border border-warning rounded");
        }
        else if (uvIndexEl.textContent > 6.6) {
            uvIndexEl.setAttribute("class", "bg-danger  border border-danger rounded");
        }
    })
};

userFormEl.addEventListener("submit", formSubmitHandler);