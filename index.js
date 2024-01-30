import * as definations from "../Dynamic Chart/definations.js";

const row1 = document.getElementById("row1");
const row2 = document.getElementById("row2");
const row3 = document.getElementById("row3");

const currentTimeMillis = new Date().getTime();
const currentTimeSeconds = Math.floor(currentTimeMillis/1000);
const prevDay = currentTimeSeconds-(24*60*60);
const nextDay = currentTimeSeconds+(24*60*60);

const chartContainer=document.querySelector('.chartContainer');
const tableBody = document.querySelector('.tableBody');
const cityInput=document.querySelector(".cityInput");
const submitBtn=document.querySelector(".submitBtn");
const pollutionForm=document.querySelector(".pollutionForm");

let intervalId; 

pollutionForm.addEventListener("submit",async event=>{
    event.preventDefault();

    if(intervalId){
        clearInterval(intervalId);
    }
    
    //Calling immediately to print result
    try{
        const city = cityInput.value;
        const pollutionData = await definations.getPollutionData(city);
        const forecastData = await definations.getForecastInfo(city);
        const historicalData = await definations.getHistoricalInfo(city);
        
        displayChart(historicalData,pollutionData,forecastData);
        let histData = {};
        for(let i=0;i<historicalData.list.length;i++){
            historicalData.list[i].dt==prevDay;
            histData = historicalData.list[i];
        }

        // Repeat the same process for currData and futureData
        let currData = {};
        for(let i=0;i<pollutionData.list.length;i++){
            pollutionData.list[i].dt==prevDay;
            currData = pollutionData.list[i];
        }

        let futureData = {};
        for(let i=0;i<forecastData.list.length;i++){
            forecastData.list[i].dt==prevDay;
            futureData = forecastData.list[i];
        }
        displayTable(histData,currData,futureData);
    }
    catch(error){
        console.error(error);
        displayError(error);
    }

    //Repeated calling to show live updates in the statistics
    intervalId=setInterval(async () =>{
        try{
            const city = cityInput.value;
            const pollutionData = await definations.getPollutionData(city);
            const forecastData = await definations.getForecastInfo(city);
            const historicalData = await definations.getHistoricalInfo(city);
            
            displayChart(historicalData,pollutionData,forecastData);
            
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    },6000); 
});
  
async function displayChart(pastData, currentData, futureData){

    const minHeight = chartContainer.clientHeight;

    chartContainer.innerHTML='';

    chartContainer.style.minHeight = `${minHeight}px`;

    console.log(pastData);
    // console.log(currentData);
    // console.log(futureData);

    //Declaring arrays to store the data of x-axis for each graph
    let timeStamps=[];
    let coData=[];
    let no2Data=[];
    let o3Data=[];
    let pm10Data=[];
    let pm2_5Data=[];
    let so2Data=[];

    //Intializing all the arrays
    pastData.list.forEach((data)=>{
        timeStamps.push(data.dt);
        coData.push(data.components.co);
        no2Data.push(data.components.no2);
        o3Data.push(data.components.o3);
        pm10Data.push(data.components.pm10);
        pm2_5Data.push(data.components.pm2_5);
        so2Data.push(data.components.so2);
    })
    currentData.list.forEach((data)=>{
        timeStamps.push(data.dt);
        coData.push(data.components.co);
        no2Data.push(data.components.no2);
        o3Data.push(data.components.o3);
        pm10Data.push(data.components.pm10);
        pm2_5Data.push(data.components.pm2_5);
        so2Data.push(data.components.so2);

    })
    futureData.list.forEach((data)=>{
        timeStamps.push(data.dt);
        coData.push(data.components.co);
        no2Data.push(data.components.no2);
        o3Data.push(data.components.o3);
        pm10Data.push(data.components.pm10);
        pm2_5Data.push(data.components.pm2_5);
        so2Data.push(data.components.so2);

    })
    const xAxes=returnFormatedTime(timeStamps);
    displayCoInfo(xAxes,coData,timeStamps);
    displayno2Info(xAxes,no2Data,timeStamps);
    display03Info(xAxes,o3Data,timeStamps);
    displaypm10Info(xAxes,pm10Data,timeStamps);
    displaypm2_5Info(xAxes,pm2_5Data,timeStamps);
    displayso2Info(xAxes,so2Data,timeStamps);

}

//Created a class to make the code reusable for displaying the graph
class BarChart {
    constructor(ctx, labelData, dataSetsData, yAxisLabel,labelLineData, threshold) {
        this.ctx = ctx;
        this.labelData = labelData;
        this.dataSetsData = dataSetsData;
        this.yAxisLabel = yAxisLabel;
        this.labelLineData = labelLineData;
        this.threshold = threshold;

        this.createChart();
    }

    createChart() {
        new Chart(this.ctx, {
            type: 'bar',
            data: {
                labels: this.labelData,
                datasets: [{
                    data: this.dataSetsData,
                    borderWidth: 1,
                    backgroundColor: this.labelLineData.map((index) => (index >= this.threshold) ? 'hsl(129, 90%, 54%)' : 'hsl(207, 90%, 54%)'),
                    borderColor: this.labelLineData.map((index) => (index >= this.threshold) ? 'hsl(129, 90%, 54%)' : 'hsl(207, 90%, 54%)'),
                    hoverBorderColor: 'hsl(207, 90%, 4%)',
                    pointStyle: 'circle',
                },]
            },
            options: {
                scales: {
                    y: {
                        grid: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: this.yAxisLabel,
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                },
                plugins:{
                    legend:{
                        display: false,
                        
                    },
                },
                
            },
        });
    }
}

//Displaying the graphs
async function displayCoInfo(labelData, dataSetsData, labelData2) {
    const label = document.createElement('p');
    label.textContent="Concentration levels of CO";
    chartContainer.appendChild(label);
    const ctx = document.createElement('canvas');
    chartContainer.appendChild(ctx);

    new BarChart(ctx, labelData, dataSetsData, 'Conc. in ppm',labelData2,currentTimeSeconds);
}

async function displayno2Info(labelData, dataSetsData,labelData2) {
    const label = document.createElement('p');
    label.textContent="Concentration levels of NO2";
    chartContainer.appendChild(label);
    const ctx = document.createElement('canvas');
    chartContainer.appendChild(ctx);

    new BarChart(ctx, labelData, dataSetsData, 'Conc. in ppm',labelData2,currentTimeSeconds);
}

async function display03Info(labelData, dataSetsData,labelData2) {
    const label = document.createElement('p');
    label.textContent="Concentration levels of 03";
    chartContainer.appendChild(label);
    const ctx = document.createElement('canvas');
    chartContainer.appendChild(ctx);

    new BarChart(ctx, labelData, dataSetsData, 'Conc. in ppm',labelData2,currentTimeSeconds);
}

async function displaypm10Info(labelData, dataSetsData,labelData2) {
    const label = document.createElement('p');
    label.textContent="Concentration levels of PM-10";
    chartContainer.appendChild(label);
    const ctx = document.createElement('canvas');
    chartContainer.appendChild(ctx);

    new BarChart(ctx, labelData, dataSetsData, 'Conc. in ppm',labelData2,currentTimeSeconds);
}

async function displaypm2_5Info(labelData, dataSetsData,labelData2) {
    const label = document.createElement('p');
    label.textContent="Concentration levels of PM-2.5";
    chartContainer.appendChild(label);
    const ctx = document.createElement('canvas');
    chartContainer.appendChild(ctx);

    new BarChart(ctx, labelData, dataSetsData, 'Conc. in ppm',labelData2,currentTimeSeconds);
}

async function displayso2Info(labelData, dataSetsData,labelData2) {
    const label = document.createElement('p');
    label.textContent="Concentration levels of SO2";
    chartContainer.appendChild(label);
    const ctx = document.createElement('canvas');
    chartContainer.appendChild(ctx);

    new BarChart(ctx, labelData, dataSetsData, 'Conc. in ppm',labelData2,currentTimeSeconds);
}

async function displayTable(past, current, future){
    
    //appneding the previous day data
    let tabelDate=document.createElement('td');
    const day1=returnTime(prevDay);
    tabelDate.textContent=day1;
    row1.appendChild(tabelDate);

    let tableaqi=document.createElement('td');
    tableaqi.textContent=past.main.aqi;
    row1.appendChild(tableaqi);


    let tableCO=document.createElement('td');
    tableCO.textContent=past.components.co;
    row1.appendChild(tableCO);
    let tableNO2=document.createElement('td');
    tableNO2.textContent=past.components.no2;
    row1.appendChild(tableNO2);
    let tableO3=document.createElement('td');
    tableO3.textContent=past.components.o3;
    row1.appendChild(tableO3);
    let tablePM10=document.createElement('td');
    tablePM10.textContent=past.components.pm10;
    row1.appendChild(tablePM10);
    let tablePM2_5=document.createElement('td');
    tablePM2_5.textContent=past.components.pm2_5;
    row1.appendChild(tablePM2_5);
    let tableSO2=document.createElement('td');
    tableSO2.textContent=past.components.so2;
    row1.appendChild(tableSO2);



    tabelDate=document.createElement('td');
    const day2=returnTime(currentTimeSeconds);
    tabelDate.textContent=day2;
    row2.appendChild(tabelDate);

    tableaqi=document.createElement('td');
    tableaqi.textContent=current.main.aqi;
    row2.appendChild(tableaqi);

    tableCO=document.createElement('td');
    tableCO.textContent=current.components.co;
    row2.appendChild(tableCO);
    tableNO2=document.createElement('td');
    tableNO2.textContent=current.components.no2;
    row2.appendChild(tableNO2);
    tableO3=document.createElement('td');
    tableO3.textContent=current.components.o3;
    row2.appendChild(tableO3);
    tablePM10=document.createElement('td');
    tablePM10.textContent=current.components.pm10;
    row2.appendChild(tablePM10);
    tablePM2_5=document.createElement('td');
    tablePM2_5.textContent=current.components.pm2_5;
    row2.appendChild(tablePM2_5);
    tableSO2=document.createElement('td');
    tableSO2.textContent=current.components.so2;
    row2.appendChild(tableSO2);

    tabelDate=document.createElement('td');
    const day3 = returnTime(nextDay);
    tabelDate.textContent=day3;
    row3.appendChild(tabelDate);

    tableaqi=document.createElement('td');
    tableaqi.textContent=future.main.aqi;
    row3.appendChild(tableaqi);


    tableCO=document.createElement('td');
    tableCO.textContent=future.components.co;
    row3.appendChild(tableCO);
    tableNO2=document.createElement('td');
    tableNO2.textContent=future.components.no2;
    row3.appendChild(tableNO2);
    tableO3=document.createElement('td');
    tableO3.textContent=future.components.o3;
    row3.appendChild(tableO3);
    tablePM10=document.createElement('td');
    tablePM10.textContent=future.components.pm10;
    row3.appendChild(tablePM10);
    tablePM2_5=document.createElement('td');
    tablePM2_5.textContent=future.components.pm2_5;
    row3.appendChild(tablePM2_5);
    tableSO2=document.createElement('td');
    tableSO2.textContent=future.components.so2;
    row3.appendChild(tableSO2);
}

function displayError(error){
    console.error(error);
}

function returnFormatedTime(timeStamps){
    let formattedDate=[];
    timeStamps.map(timeStamp=>{
        const date = new Date(timeStamp*1000);
        formattedDate.push(date.getDate()+"-"+getMonthName(date.getMonth()));
    })
    return formattedDate;
}

function returnTime(timeStamp){
    let formattedDate;
    
        const date = new Date(timeStamp*1000);
        formattedDate=(date.getDate()+"-"+getMonthName(date.getMonth()));
    return formattedDate;
}

function getMonthName(monthIndex) {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthIndex];
}