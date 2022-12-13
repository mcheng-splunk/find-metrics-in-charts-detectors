import fetch from 'node-fetch';
import jq from 'node-jq';
import readcsv from './readcsv.js';
import dotenv from 'dotenv';


dotenv.config()
// Please configure TOKEN and REALM 
const TOKEN = process.env.TOKEN
const REALM = process.env.REALM

const typesEnum = {
  CHART: "chart",
  DETECTOR: "detector",
}


var charts
var chartId
var result
var chartObj
var chartProgramText
var fileName
var chartOrDetector 
var found=false

//jq filtering criteria
var filter = '.results[].id'
const options = {input: 'json'}


// Check Param 0 - Read from parameter. Parameter will determine if we are checking against Charts Or Detectors 
const myArgs = process.argv.slice(2);
if (Object.values(typesEnum).includes(myArgs[0].toLowerCase())) {
  chartOrDetector = myArgs[0].toLowerCase()
  //console.log("found " + myArgs[0].toLowerCase())
} else {
  console.log("Please select to filter again chart or detector")
  process.exit()
}

// Check Param 1 - Read from parameter. Parameter will determine if read filter criteria from external csv file or default csv file. 
// const myArgs = process.argv.slice(2);
switch (myArgs[1]) {
  case null:
  case "":
  case undefined:
    fileName = "sample.csv";
    break;
  default:
    fileName = myArgs[1];
    break;
}
const signalfxFilters = readcsv(fileName)

//console.log(`The result is: ${signalfxFilters}`);

var signalfxFiltersArray =  String(signalfxFilters).split(",");
// console.log("The filters is: " + signalfxFiltersArray);


// Common method for charts and get chart Id metadata
async function getCharts(id){

  var url = "https://api." + REALM + ".signalfx.com/v2/" + chartOrDetector + "/" + id
  //console.log("url is " + url)

  return fetch(url,{
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 
                  'X-SF-TOKEN': TOKEN}
  }).then(res => res.json())
    .then(json => charts = json);
}


// Getting the individual chart 
getCharts("").then(
  result  => 
  {
    let chartId = jq.run(filter, charts, options)
    .then((output) => {
      chartId = output.split(/\n/)  // split the string into array by \n 
      chartObj = chartId
      // console.log(chartId.length)
      
      // loop through all the chart Id to get the metadata. 
      console.log("Following " + chartOrDetector + "s are using the filter dimension: " + signalfxFiltersArray)
      for (const index in chartId) {  
        var noQuotes = chartId[index].split('"').join('') // remove the double quote before passing back to the fetch method
        getCharts(noQuotes)
        .then((chartRes) => { 
          //console.log(chartRes)
          filter = '.id , .name , .programText'
          jq.run(filter, chartRes, options)
          .then((output) => {

            chartProgramText = output.split(/\n/)  // split the string into array by \n 

            // Individual chart 3 metadata ( id & name & programText )
            // Start of searching logic

            for (let signalfxFilter in signalfxFiltersArray ) {

                var signalfxFiltersArrayString = signalfxFiltersArray[signalfxFilter].replace(/\s/g, '')
                var programText = chartProgramText[2]

                if (new RegExp("\\b" + signalfxFiltersArrayString + "\\b").test(programText)){

                  console.log("******* " + "Id:" + chartProgramText[0] + " - Name:" + chartProgramText[1] + " - Filter:" + signalfxFiltersArrayString)
                  found = true  
                }
            }           
          })
        })
      } // end of for loop

      if (!found){
        console.log("Search has not found matching filter in " + chartOrDetector )
      }
    })
    .catch((err) => {
      console.error(err)
      // Something went wrong...
    })
  }
)  
