'use strict';

angular.module('cgeMapApp')
  .service('Markers', function Createmarkers() {
        
    // Private function to create just the markers
    function _create_markers(isolate, markerList, markers){
      var iconData = {
          iconSize:     [57,  142,5],
          iconAnchor:   [22,  94],
          popupAnchor:  [-3,  -76],
      };
      var markers_src = [
          "images/map_markers/orange-marker.svg",
          "images/map_markers/green-marker.svg",
          "images/map_markers/blue-marker.svg"
      ];   
                         
      // Place marker on every location
      if (isolate.properties.data.Pathogenic == "Yes")
        iconData.iconUrl = markers_src[0];
      else if(isolate.properties.data.Pathogenic == "No")
        iconData.iconUrl = markers_src[1];
      else
        iconData.iconUrl = markers_src[2];
      var myIcon = L.icon(iconData);
      var marker = L.marker([isolate.properties.data.Latitude, 
                             isolate.properties.data.Longitude]
                             //,{icon: myIcon}
                             );  
      marker.bindPopup("<b>Country:</b> " + isolate.properties.data.Country + "<br>" +
                        "<b>City:</b> " + isolate.properties.data.City + "<br>" +
                        "<b>Pathogenic:</b> "+ isolate.properties.data.Pathogenic); 
      markerList.push(marker);                        
      // Isolate to the scope  
      markers.push(isolate);    
    }
    
    // Service function to return isolates (GEOJSON formated) and markers
    this.createAll = function(isolates){

      var influenza_date = d3.time.format("%Y/%m/%d");
      var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District-of-Columbia', 'Florida', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New-Hampshire', 'New-Jersey', 'New-Mexico', 'New-York', 'North-Carolina', 'North-Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode-Island', 'South-Carolina', 'South-Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West-Virginia', 'Wisconsin', 'Wyoming'];      
      var year_to_star = 1000;

      // Global variables for the markers
      var markers = [];
      var markerList = [];
      isolates.forEach(function(d, i){
        if ((d.Date != null) && (d.Latitude != null && d.Longitude != null)){
          d.Date = influenza_date.parse(d.Date);
          d.month = d3.time.month(d.Date);
          if (d.Country == "New")
            d.Country = "New Zealand";      
          if (states.indexOf(d.Country) != -1){
            d.Country = "US";
          }
          if (d.Country == "Helsinki")
            d.Country = "Finland";
          // At the begining the grouping is by id, meaning just one isolate
          d.Size = 1;
          // Create isolate ready for the map in GEOJSON format 
          var isolate = {"type":"Feature","id":i.toString(),
            "properties":{
              "data":d
            },"geometry":{
                "type":"Point",
                "coordinates":[parseFloat(d.Longitude),parseFloat(d.Latitude)]
              }
            }; 
          _create_markers(isolate, markerList, markers);
        }
      });
      return {isolates: markers, markerList: markerList};
    };
    
    // Service function to return markers
    this.createMarkers = function(isolate_list){ 

      var markerList = [],
          markers = [];    
      isolate_list.forEach(function(isolate){   
         _create_markers(isolate, markerList, markers);  
      }); 
      return markerList;
    }     
  });
