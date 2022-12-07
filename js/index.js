//Falta ajeitar a barra debaixo que ta preta 

function locateCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve(position);
      },
      error => {
        console.log(error.message);
        reject(error);
      },
    );
  })
};

async function searchWeather(searchByLocation = false) {
  const cityInput = document.querySelector('input\[name=city\]');
  const cityName = cityInput.value;

  if (cityName === '' && !searchByLocation) {
    alert("Por favor, digite o nome de uma cidade.");
    return;
  }

  let url;
  if (searchByLocation) {
    let latitude;
    let longitude;

    await locateCurrentPosition().then(position => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      const endpoint = `https://api.hgbrasil.com/weather?format=json-cors&key=5ef34385&lat=${latitude}&lon=${longitude}&user_ip=remote`;
      url = endpoint;
    });

  } else {
    const endpoint = `https://api.hgbrasil.com/weather?format=json-cors&key=5ef34385&city_name=${cityName}`;
    url = endpoint;
  }

  const xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.onreadystatechange = () => {
    const operationIsComplete = xhr.readyState == 4;
    if (operationIsComplete) {
      if (xhr.status = 200) {
        console.log(JSON.parse(xhr.responseText));
        fillHTMLFields(JSON.parse(xhr.responseText));
      } else if (xhr.status = 404) {
        alert('Cidade não encontrada.');
      }
    }
  }

  xhr.send();
}

function fillHTMLFields(json) {
  const daysElements = document.getElementsByClassName('day');
  for (let i = 0; i < daysElements.length; i++) {
    daysElements[i].innerHTML = json.results.forecast[i].weekday;
  }

  const cityNameElement = document.getElementById('city-name');
  cityNameElement.innerHTML = json.results.city_name;

  const dateElement = document.getElementById('date')
  dateElement.innerHTML = json.results.date;

  const actualTempElement = document.getElementById('temp');
  actualTempElement.innerHTML = json.results.temp + '°C';

  const tempElements = document.getElementsByClassName('max-degree');
  const tempMinElements = document.getElementsByClassName('min-degree');
  for (let i = 0; i < tempElements.length; i++) {

    let minTemp = json.results.forecast[i].min;
    let maxTemp = json.results.forecast[i].max;

    tempElements[i].innerHTML = maxTemp;
    tempMinElements[i].innerHTML = minTemp;
  }

  const humidityElement = document.getElementById('humidity');
  const humidityImage = "<img src='images/icon-umberella.png' alt=''></img>"
  const humidityString = humidityImage + json.results.humidity + '%';
  humidityElement.innerHTML = humidityString;

  const windElement = document.getElementById('wind');
  const windImage = "<img src='images/icon-wind.png' alt=''></img>"
  const windString = windImage + json.results.wind_speedy;
  windElement.innerHTML = windString;

  const iconsElements = document.querySelectorAll('.forecast-icon > img');
  for (let i = 0; i < iconsElements.length; i++) {
    let description;
    if (i == 0) {
      description = json.results.description;
    } else {
      description = json.results.forecast[i].description;
    }

    const icon = weatherIcons[description];

    if (!icon) {
      iconsElements[i].src = 'images/icons/icon-1.svg';
    } else {
      iconsElements[i].src = `images/icons/${icon}.svg`;
    }
  }
}

document.onkeydown = (keyboardEvent) => {
  let keyCode = keyboardEvent.key;
  if (keyCode === "Enter") {
    keyboardEvent.preventDefault();
    searchWeather();

    return false;
  }
}

const weatherIcons = {
  "Sol com poucas nuvens": "icon-1",
  "Ensolarado": "icon-2",
  "Ensolarado com muitas nuvens": "icon-3",
  "Tempo nublado": "icon-4",
  "Parcialmente nublado": "icon-4",
  "Chuva": "icon-9",
  "Chuvas esparsas": "icon-9",
  "Tempestades": "icon-11",
  "Queda de neve": "icon-13",
  "Neve": "icon-13",
}

// searchWeather(true);