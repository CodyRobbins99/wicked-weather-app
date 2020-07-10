const userFormEl = document.querySelector("#user-form");
const cityInputEl = document.querySelector("#city-name");
const cityNameEl = document.querySelector("#city-name-span");
const dateEl = document.querySelector("#date-span");
const temperatureEl = document.querySelector("#temperature-span");
const humidityEl = document.querySelector("#humidity-span");
const windSpeedEl = document.querySelector("#wind-speed-span");
const uvIndexEl = document.querySelector("#uv-index-span");
const weatherIconEl = document.querySelector("#weather-icon-span");
const forecastContainerEl = document.querySelector("#forecast-container");

const formSubmitHandler = function() {
    event.preventDefault();
    // get value from input
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getForecast(cityName);
        cityInputEl.value = '';
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

        const icon = currentWeatherResponse.weather[0].icon
        weatherIconEl.innerHTML = `<img src="http://openweathermap.org/img/wn/${icon}@2x.png" />`
        weatherIconEl.setAttribute("class", "mw-25 mh-25")

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

        for (var i = 0; i < data.daily.length - 3; i++) {
            // create a div for forecast card
            const forecastCardEl = document.createElement(`div`);
            forecastCardEl.classList = `col-2 bg-info row p-1 border border-info rounded`;

            // create a date 
            const unixTimestamp = data.daily[i].dt;
            const milliseconds = unixTimestamp * 1000
            const dateObject = new Date(milliseconds)
            const humanDateFormat = dateObject.toLocaleString()
            const forecastCardDate = document.createElement(`h5`);
            forecastCardDate.textContent = humanDateFormat;
            forecastCardDate.classList = `text-uppercase col-12`

            // append to container
            forecastCardEl.appendChild(forecastCardDate);

            // create an icon
            const iconValue = data.daily[i].weather[0].icon
            const forecastIconEl = document.createElement(`img`);
            forecastIconEl.setAttribute(`src`,`http://openweathermap.org/img/wn/${iconValue}@2x.png`);
            forecastIconEl.classList = `mw-25 mh-25 col-12`;

            // append to container
            forecastCardEl.appendChild(forecastIconEl);

            // create a temp
            const tempValue = data.daily[i].temp.day
            const forecastTempEl = document.createElement(`p`);
            forecastTempEl.textContent = `${tempValue}°F`
            forecastTempEl.classList = `col-12 text-uppercase`

            // append to container
            forecastCardEl.appendChild(forecastTempEl);

            // create a humidity
            const humidtyValue = data.daily[i].humidity
            const forecastHumidityEl = document.createElement(`p`);
            forecastHumidityEl.textContent = `${humidtyValue}% Humidity`
            forecastHumidityEl.classList = `col-12`

            // append to container
            forecastCardEl.appendChild(forecastHumidityEl);

            forecastContainerEl.appendChild(forecastCardEl);
        }        
    })
};

userFormEl.addEventListener("submit", formSubmitHandler);