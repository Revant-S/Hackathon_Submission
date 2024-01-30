const apiKey = "9746d16daefe53f9f358984c8144a90f";

async function getPollutionData(city){
    
    const {lat: lat, lon: lon} = await getCoordinates(city);
    //console.log({lat,lon});
    const PollutionURL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const PollutionResponse = await fetch(PollutionURL);
    if(!PollutionResponse.ok){
        throw new Error("Couln't fetch weather data, Try enter a valid city");
    }
    //console.log(PollutionResponse);
    return await PollutionResponse.json();
}

async function getCoordinates(city){
    const coordinateUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
    const response2 = await fetch(coordinateUrl);
    const [firstResult] = await response2.json();
    if(!firstResult){
        throw new Error("The coordinates for the given location couldn't be found");
    }
    const {lat, lon} = firstResult;
    return {lat, lon};
}



async function getForecastInfo(city){
    
    const {lat: lat, lon: lon} = await getCoordinates(city);
    const ForecastURL = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const ForecastResponse = await fetch(ForecastURL);
    if(!ForecastResponse.ok){
        throw new Error("Couln't fetch forecast data, Try enter a valid city");
    }
    //console.log(ForecastResponse);
    return await ForecastResponse.json();
}

async function getHistoricalInfo(city){
    const end = Math.floor(new Date().getTime()/1000);
    const start = end - (7*24*60*60);
    const {lat:lat, lon:lon}=await getCoordinates(city);
    const HistoricalURL = `http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${apiKey}`;
    const HistoricalResponse = await fetch(HistoricalURL);
    if(!HistoricalResponse.ok){
        throw new Error("Couldn't fetch the historical data, Try enter a valid city");
    }
    return await HistoricalResponse.json();
}


export{
    getPollutionData,
    getForecastInfo,
    getCoordinates,
    getHistoricalInfo
}