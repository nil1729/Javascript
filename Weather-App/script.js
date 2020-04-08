const weatherTemperature = document.querySelector('.weather-temperature');
const weatherCondition = document.querySelector('.weather-description');
const locationName = document.querySelector('.location-name');
const icon = document.querySelector('.icon');
const notification = document.querySelector('.notification');

let latitude;
let longitude;
let temperatureUnit = 'celsius';
let temperatureValue;

weatherTemperature.addEventListener('click', () => {
    if (temperatureValue === undefined) {
        return;
    } else {
        if (temperatureUnit === 'celsius') {
            temperatureValue = Math.floor(((temperatureValue * 9) / 5) + 32);
            weatherTemperature.innerHTML = `<span>${temperatureValue} </span><span>&deg</span>F`
            temperatureUnit = 'fahrenheit'
        } else {
            temperatureValue = Math.floor(((temperatureValue - 32) * 5) / 9);
            weatherTemperature.innerHTML = `<span>${temperatureValue} </span><span>&deg</span>C`
            temperatureUnit = 'celsius'
        }
    }
})

function setPosition(position) {
    console.log(position);
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    getWeather();
}

function showError(error) {
    notification.style.display = 'flex';
    console.log(error);
    notification.innerHTML = `<span>${error.message}</span>`
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    } else {
        notification.innerHTML = `<span>Browser don't Support Geolocation</span>`
    }
}

getLocation();

function getWeather() {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=82005d27a116c2880c8f0fcb866998a0`;
    fetch(api)
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            console.log(data);
            temperatureValue = Math.floor(data.main.temp - 273);
            weatherTemperature.innerHTML = `<span>${temperatureValue} </span><span>&deg</span>c`;
            weatherCondition.innerHTML = data.weather[0].description;
            locationName.innerHTML = data.name;
            icon.innerHTML = `<img src="./icons/${data.weather[0].icon}.png" alt="initial">`
        });
}
