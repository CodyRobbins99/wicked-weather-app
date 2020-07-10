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
const searchButtonsEl = document.querySelector("#search-history-btns");

const formSubmitHandler = function() {
    event.preventDefault();
    // get value from input
    var cityName = cityInputEl.value.trim();

    if (cityName) {
        getForecast(cityName);
        cityInputEl.value = '';
        forecastContainerEl.innerHTML='';
    }
    else {
        alert("Please enter a valid city!");
    }
};

const buttonClickHandler = function(event) {
    const city = event.target.getAttribute("data-city");
    if (city) {
        getForecast(city);

        forecastContainerEl.innerHTML='';
    }
}

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

        var cityButton = document.createElement(`button`)
        cityButton.textContent = currentWeatherResponse.name;
        cityButton.setAttribute(`data-city`,currentWeatherResponse.name);
        cityButton.classList= `btn col-9 bg-info border border-info rounded m-2`
        searchButtonsEl.appendChild(cityButton);
                
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

        for (var i = 1; i < data.daily.length - 2; i++) {
            // create a div for forecast card
            const forecastCardEl = document.createElement(`div`);
            forecastCardEl.classList = `col-lg-2 col-md-12  bg-info row p-1 m-1 border border-info rounded`;

            // create a date 
            const unixTimestamp = data.daily[i].dt;
            const milliseconds = unixTimestamp * 1000
            const dateObject = new Date(milliseconds)
            const humanDateFormat = dateObject.toLocaleString()
            const forecastCardDate = document.createElement(`h5`);
            forecastCardDate.textContent = humanDateFormat;
            forecastCardDate.classList = `text-uppercase col-lg-12 col-md-8 col-sm-8`

            // append to container
            forecastCardEl.appendChild(forecastCardDate);

            // create an icon
            const iconValue = data.daily[i].weather[0].icon
            const forecastIconEl = document.createElement(`img`);
            forecastIconEl.setAttribute(`src`,`http://openweathermap.org/img/wn/${iconValue}@2x.png`);
            forecastIconEl.classList = `col-lg-12 col-md-3 col-sm-3`;

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
searchButtonsEl.addEventListener("click", buttonClickHandler);