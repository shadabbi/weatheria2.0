const cityForm = document.querySelector('form');
const card = document.querySelector('.card');
const details = document.querySelector('.details')
const time = document.querySelector('img.time');
const icon = document.querySelector('.icon img');


const updateUI = (data,state_district,suburb)=>{
    const {cityData,weather} = data;
    if(state_district && suburb){
        details.innerHTML = `
        <h5 class="my-3">${state_district}</h5>
        <h6 class="my-3">${suburb}</h6>
        <div class="my-3">${weather.WeatherText}</div>
        <div class="display-4 my-4">
          <span>${weather.Temperature.Metric.Value}</span>
          <span>&deg;C</span>
        </div>
    
        `;
    }

    else{
        details.innerHTML = `
        <h5 class="my-3">${cityData.EnglishName}</h5>
        <div class="my-3">${weather.WeatherText}</div>
        <div class="display-4 my-4">
          <span>${weather.Temperature.Metric.Value}</span>
          <span>&deg;C</span>
        </div>
    
        `;
    }
    

    let iconSrc = `img/icons/${weather.WeatherIcon}.svg`;
    icon.setAttribute('src',iconSrc);

    let timeSrc = null;

    if(weather.IsDayTime){
        timeSrc = 'img/day.svg';
    }
    else{
        timeSrc = 'img/night.svg';
    }

    time.setAttribute('src',timeSrc);

    if(card.classList.contains('d-none')){
        card.classList.remove('d-none');
    }
}


const updateCity = async (city)=>{ 
    const cityData = await getCity(city);
    const weather = await getWeather(cityData.Key);
    return { cityData,weather} 
}


cityForm.addEventListener('submit',e =>{
    e.preventDefault();
    const city = cityForm.city.value.trim();
    cityForm.reset();

    updateCity(city)
    .then(data=>{
        updateUI(data);
    }).catch(er=>{
        console.log('yes'+er)
    })
})





function init(){
    const loc = async (positon)=>{
        const {latitude,longitude} = positon.coords;
        const data = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=d54a9cf2bf7148e584ee91ac9cdb1dba`)
        let {state,state_district,suburb} = data.data.results[0].components;
        updateCity(state)
        .then(data=>{
            updateUI(data,state_district,suburb);
        }).catch(er=>{
            console.log('yes'+er)
        })
    }
    navigator.geolocation.getCurrentPosition(loc);
}
init()