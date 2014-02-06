var dateFormat = d3.time.format("%y/%m/%d");
var dateFormat_DT = d3.time.format("%d-%m-%y");
var nepal_date = d3.time.format("%d.%m.%Y");
var influenza_date = d3.time.format("%Y/%d/%m");
/* dateFormat_DT = dateFormat; */
var geojson = {"type":"FeatureCollection","features":[]};

var max_year = 1900;

// Preprocess Data
data.forEach(function(d){

    if ((d.Date != null) && (d.Latitude != null && d.Longitude != null)){    
        var aux_date = d.Date.split(".")
        if (parseInt(aux_date[1]) > parseInt(aux_date[0])){
            d.Date = new Date(aux_date[2],aux_date[1]-1,aux_date[0])
        }else{
           d.Date = dateFormat_DT.parse(d.Date);
        }       
        if (d.Date != null && d.Date.getFullYear() >= max_year){
            d.month = d3.time.day(d.Date); // pre-calculate month for better performance
            //console.log(geojson.features);
            d.Country = d.Country.split(" ")[0];
            geojson.features.push(
              {"type":"Feature","id":"02","properties":{"data":d},"geometry":{"type":"Point",
              "coordinates":[parseInt(d.Latitude),parseInt(d.Longitude)]}});
        }
    }

}); 

// Preprocess Nepal Data
nepal_data.forEach(function(d){

    if ((d.Date != null) && (d.Latitude != null && d.Longitude != null)){    
        var aux_date = d.Date.split(".")
        if (parseInt(aux_date[1]) > parseInt(aux_date[0])){
            d.Date = new Date(aux_date[2],aux_date[1]-1,aux_date[0])
        }else{
           d.Date = nepal_date.parse(d.Date);
        }       
        if (d.Date != null && d.Date.getFullYear() >= max_year){
            d.month = d3.time.day(d.Date); // pre-calculate month for better performance
            geojson.features.push(
              {"type":"Feature","id":"02","properties":{"data":d},"geometry":{"type":"Point",
              "coordinates":[parseInt(d.Latitude),parseInt(d.Longitude)]}});
        }
    }

}); 

var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District-of-Columbia', 'Florida', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New-Hampshire', 'New-Jersey', 'New-Mexico', 'New-York', 'North-Carolina', 'North-Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode-Island', 'South-Carolina', 'South-Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West-Virginia', 'Wisconsin', 'Wyoming'];

// Preprocess Influenza Data
var counts = 0;
influenza_data.forEach(function(d){

    if ((d.Date != null) && (d.Latitude != null && d.Longitude != null)){    
        var aux_date = d.Date.split(".")
        if (parseInt(aux_date[1]) > parseInt(aux_date[0])){
            d.Date = new Date(aux_date[2],aux_date[1]-1,aux_date[0])
        }else{
           d.Date = influenza_date.parse(d.Date);
        }       
        if (d.Country == "Helsinki")
            counts +=1;
        if (d.Country == "New")
            d.Country = "New Zealand"        
        if (states.indexOf(d.Country) != -1){
            d.Country = "US"
        }
         
        if (d.Date != null && d.Date.getFullYear() >= 2010){
            d.month = d3.time.day(d.Date); // pre-calculate month for better performance
            if ((d.Country == "Helsinki" && counts <= 100) || (d.Country!="Helsinki" && d.Country!="Georgia")){
            geojson.features.push(
              {"type":"Feature","id":"02","properties":{"data":d},"geometry":{"type":"Point",
              "coordinates":[parseInt(d.Latitude),parseInt(d.Longitude)]}});
              }
        }
    }

}); 

//console.log(geojson.features);


