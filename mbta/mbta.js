function getTimes(station_data, station_name) {
  // gets 4 latest schedules
  var arrive;
  var depart;
  var trains = [[0,0],[0,0],[0,0],[0,0]];
  var direction = ['tbd', 'tbd', 'tbd', 'tbd'];
  for (var i = 0; i < 4; i++) {
      arrive = station_data.data[i].attributes.arrival_time;
      //console.log('arrival time is: ' + arrive);

      depart = station_data.data[i].attributes.departure_time;
      //console.log('departure time is: ' + depart);
      if (arrive != null && depart != null) {
        arrive = arrive.substring(11,16);
        trains[i][0] = arrive;
        depart = depart.substring(11,16);
        trains[i][1] = depart;
        console.log('Got both arrive and depart!');
      }
      else if (arrive == null && depart != null) {
        trains[i][0] = 'Not available';
        depart = depart.substring(11,16);
        trains[i][1] = depart;
        console.log('Got only depart');
      }
      else if (depart == null && arrive != null) {
        arrive = arrive.substring(11,16);
        trains[i][0] = arrive;
        trains[i][1] = 'Not available';
        console.log('Got only arrive!');
      }  
      else {
          trains[i][0] = 'Not available'; 
          trains[i][1] = 'Not available'; 
        console.log("Didn't get anything :(");
      }
  }
  for (var i = 0; i < 4; i++) {
    if (station_data.data[i].attributes.direction_id == '0')
      direction[i] = 'Southbound (to Ashmont/Braintree)';
    else 
      direction[i] = 'Northbound (to Alewife)';
    console.log(direction[i]);
  }

  time = '<h1> Station: ' + station_name + '</h1>' + '<table>' + '<tr>' + '<th> Arrival time</th>' + '<th> Departure time</th>' + '<th> Direction</th>' + '</tr>' +
        '<tr>' + '<td>' + trains[0][0] + '</td>' + '<td>' + trains[0][1] + '</td>' + '<td>' + direction[0] + '</td>' + 
        '<tr>' + '<td>' + trains[1][0] + '</td>' + '<td>' + trains[1][1] + '</td>' + '<td>' + direction[1] + '</td>' + 
        '<tr>' + '<td>' + trains[2][0] + '</td>' + '<td>' + trains[2][1] + '</td>' + '<td>' + direction[2] + '</td>' + 
        '<tr>' + '<td>' + trains[3][0] + '</td>' + '<td>' + trains[3][1] + '</td>' + '<td>' + direction[3] + '</td>' + '</table>';
  return time;
}

///* 
function makeinfowindow(station, curr_mark) {
    var link = "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=" + station[4];
    var request = new XMLHttpRequest();
    request.open('GET', link, true);
    request.send();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            data = request.responseText;
            station_data = JSON.parse(data);
            console.log(station_data);
            var info_w = new google.maps.InfoWindow();
            info_w.setContent(getTimes(station_data,station[0]) /*station_data.data[4].attributes.departure_time*/);
            info_w.open(map,curr_mark);
        }
    }


    //format: 2018-10-24T18:04:00-04:00
}


//*/




//Declaring the stations
var stations = [
      ['South Station', 42.352271 , -71.05524200000001, 1,'place-sstat'],
      ['Andrew', 42.330154, -71.057655, 2,'place-andrw'],
      ['Porter Square', 42.3884, -71.11914899999999, 3,'place-portr'],
      ['Harvard Square', 42.373362, -71.118956, 4,'place-harsq'],
      ['JFK/UMass', 42.320685, -71.052391, 5,'place-jfk'],
      ['Savin Hill', 42.31129, -71.053331, 6,'place-shmnl'],
      ['Park Street', 42.35639457, -71.0624242, 7,'place-pktrm'],
      ['Broadway', 42.342622, -71.056967, 8,'place-brdwy'],
      ['North Quincy', 42.275275, -71.029583, 9,'place-nqncy'],
      ['Shawmut', 42.29312583, -71.06573796000001, 10,'place-smmnl'],
      ['Davis', 42.39674, -71.121815, 11,'place-davis'],
      ['Alewife', 42.395428, -71.142483, 12,'place-alfcls'],
      ['Kendall/MIT', 42.36249079, -71.08617653, 13,'place-knncl'],
      ['Charles/MGH', 42.361166, -71.070628, 14,'place-chmnl'],
      ['Downtown Crossing', 42.355518, -71.060225, 15,'place-dwnxg'],
      ['Quincy Center', 42.251809, -71.005409, 16,'place-qnctr'],
      ['Quincy Adams', 42.233391, -71.007153, 17,'place-qamnl'],
      ['Ashmont', 42.284652, -71.06448899999999, 18,'place-asmnl'],
      ['Wollaston', 42.2665139, -71.0203369, 19,'place-wlsta'],
      ['Fields Corner', 42.300093, -71.061667, 20,'place-fldcr'],
      ['Central Square', 42.365486, -71.103802, 21,'place-cntsq'],
      ['Braintree', 42.2078543, -71.0011385, 22,'place-brntn']
    ]; 

function display_station (nearest, distance) {
var display_station = '<h2>Nearest station is: </h1>' + nearest[0] + '<h3>Distance from you: </h3>' + distance;
  return display_station;
}

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: 42.352271, lng: -71.05524200000001},
    mapTypeId: 'terrain'
  });       
  setpolyline(map);
  setMarkers(map);
  locate_me(map);


}

function locate_me(map) {
                // Function to determine closest station
                function get_station_distance(lat, long, closest_distance) {
                  var station_distances = [];
                  var closest_station = stations[0];
                  for (var i = 0; i < stations.length; i++) {
                      var curr_distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(lat, long), new google.maps.LatLng(stations[i][1], stations[i][2]));
                      if (curr_distance < closest_distance) {
                        closest_distance = curr_distance;
                        closest_station = stations[i];
                      }
                    }
                  return closest_station;
                 }

                  // Steps to determine location and add marker
                var options = {
                  enableHighAccuracy: false,
                  timeout: 30000,
                  maximumAge: 0
                  };

                // Success function implements all equatiosn related to self
                function success(position) {
                  var crd = position.coords;
                  lat = position.coords.latitude;
                  long = position.coords.longitude;
                  map.setCenter(new google.maps.LatLng(lat,long));
                  var loc_marker = new google.maps.Marker({
                          position: {lat:lat,lng:long},
                          map: map,
                          title: "You're here"
                  });

                  // EQUATION FOR INITIATING POLYLINE TO CLOSEST STATION
                  var distance = 10000;
                  var closest_station = get_station_distance(lat, long, distance);
                  loc_marker.addListener('click', function() {
                  // Opens infowindow for loc_marker that shows where. 
                  var nearest_train = new google.maps.InfoWindow({
                      content: display_station(closest_station,distance)
                    });
                  nearest_train.open(map,loc_marker); 
                    });

                  //***********Drawing polyline 
                  var closest_path = new google.maps.Polyline({
                    path: [{lat: closest_station[1], lng:closest_station[2]},{lat:lat, lng:long}],
                    geodesic: true,
                    strokeColor: '#ADD8E6',
                    strokeOpacity: 1.0,
                    strokeWeight: 6
                  });
                  closest_path.setMap(map);
                  //**************
                  }
                  function error(err) {
                    console.warn(`ERROR(${err.code}): ${err.message}`);
                  }
                  navigator.geolocation.getCurrentPosition(success, error, options);
}






function setpolyline (map) {
                // Script for the polyline
                var flightPlanCoordinates = [
                  {lat: stations[11][1], lng: stations[11][2]}, {lat: stations[10][1], lng: stations[10][2]}, {lat: stations[2][1], lng: stations[2][2]},
                  {lat: stations[3][1], lng: stations[3][2]}, {lat: stations[20][1], lng: stations[20][2]}, {lat: stations[12][1], lng: stations[12][2]},
                  {lat: stations[13][1], lng: stations[13][2]}, {lat: stations[6][1], lng: stations[6][2]}, {lat: stations[14][1], lng: stations[14][2]},
                  {lat: stations[0][1], lng: stations[0][2]}, {lat: stations[7][1], lng: stations[7][2]}, {lat: stations[1][1], lng: stations[1][2]},
                  {lat: stations[4][1], lng: stations[4][2]},
                  // Up to JFK/UMASS
                  {lat: stations[8][1], lng: stations[8][2]}, {lat: stations[18][1], lng: stations[18][2]}, {lat: stations[15][1], lng: stations[15][2]},
                  {lat: stations[16][1], lng: stations[16][2]}, {lat: stations[21][1], lng: stations[21][2]},
                  // Going back up to JFK UMASS
                  {lat: stations[16][1], lng: stations[16][2]}, {lat: stations[15][1], lng: stations[15][2]}, {lat: stations[18][1], lng: stations[18][2]},
                  {lat: stations[8][1], lng: stations[8][2]}, {lat: stations[4][1], lng: stations[4][2]},

                  // End of one fork
                  {lat: stations[5][1], lng: stations[5][2]}, {lat: stations[19][1], lng: stations[19][2]}, {lat: stations[9][1], lng: stations[9][2]},
                  {lat: stations[17][1], lng: stations[17][2]},
                ];

                var flightPath = new google.maps.Polyline({
                  path: flightPlanCoordinates,
                  geodesic: true,
                  strokeColor: '#FF0000',
                  strokeOpacity: 1.0,
                  strokeWeight: 2
                });

                flightPath.setMap(map);
}


// Script for the Markers
  
function setMarkers(map) {
                  var icon = {
                      url: "MBTA.png",
                      scaledSize: new google.maps.Size(20, 20), 
                      origin: new google.maps.Point(0,0),
                      anchor: new google.maps.Point(0,0) 
                  };
                  var shape = {
                    coords: [1, 1, 1, 20, 18, 20, 18, 1],
                    type: 'poly'
                  };
                  for (var i = 0; i < stations.length; i++) {
                    var station = stations[i];
                    var marker = new google.maps.Marker({
                      position: {lat: station[1], lng: station[2]},
                      map: map,
                      icon: icon,
                      shape: shape,
                      title: station[0],
                      zIndex: station[3]
                    });
                    // Passed into function for closure
                    pass_into_listener(station, marker);
                  }
}

function pass_into_listener(station, marker) {
        google.maps.event.addListener(marker, 'click', function() {
      makeinfowindow(station, marker);
  });
 }

  /*

                  marker[0].addListener('click', function() {
                    infowindow = new google.maps.InfoWindow({
                      content: def
                    });
                    var content = getdata(infowindow,0, marker[0]);
                    infowindow.setContent(content)
                    infowindow.open(map,marker[0]); 
                    });


                  marker[1].addListener('click', function() {
                    infowindow = getdata(1);
                    infowindow.open(map,marker[1]); 
                    });
                  marker[2].addListener('click', function() {
                    infowindow = getdata(2);
                    infowindow.open(map,marker[2]); 
                    });
                  marker[3].addListener('click', function() {
                    infowindow = getdata(3);
                    infowindow.open(map,marker[3]); 
                    });
                  marker[4].addListener('click', function() {
                    infowindow = getdata(4);
                    infowindow.open(map,marker[4]); 
                    });
                  marker[5].addListener('click', function() {
                    infowindow = getdata(5);
                    infowindow.open(map,marker[5]); 
                    });
                  marker[6].addListener('click', function() {
                    infowindow = getdata(6);
                    infowindow.open(map,marker[6]); 
                    });
                  marker[7].addListener('click', function() {
                    infowindow = getdata(7);
                    infowindow.open(map,marker[7]); 
                    });
                  marker[8].addListener('click', function() {
                    infowindow = getdata(8);
                    infowindow.open(map,marker[8]); 
                    });
                  marker[9].addListener('click', function() {
                    infowindow = getdata(9);
                    infowindow.open(map,marker[9]); 
                    });
                  marker[10].addListener('click', function() {
                    infowindow = getdata(10);
                    infowindow.open(map,marker[10]); 
                    });
                  marker[11].addListener('click', function() {
                    infowindow = getdata(11);
                    infowindow.open(map,marker[11]); 
                    });
                  marker[12].addListener('click', function() {
                    infowindow = getdata(12);
                    infowindow.open(map,marker[12]); 
                    });
                  marker[13].addListener('click', function() {
                    infowindow = getdata(13);
                    infowindow.open(map,marker[13]); 
                    });
                  marker[14].addListener('click', function() {
                    infowindow = getdata(14);
                    infowindow.open(map,marker[14]); 
                    });
                  marker[15].addListener('click', function() {
                    infowindow = getdata(15);
                    infowindow.open(map,marker[15]); 
                    });
                  marker[16].addListener('click', function() {
                    infowindow = getdata(16);
                    infowindow.open(map,marker[16]); 
                    });
                  marker[17].addListener('click', function() {
                    infowindow = getdata(17);
                    infowindow.open(map,marker[17]); 
                    });
                  marker[18].addListener('click', function() {
                    infowindow = getdata(18);
                    infowindow.open(map,marker[18]); 
                    });
                  marker[19].addListener('click', function() {
                    infowindow = getdata(19);
                    infowindow.open(map,marker[19]); 
                    });
                  marker[20].addListener('click', function() {
                    infowindow = getdata(20);
                    infowindow.open(map,marker[20]); 
                    });
                  marker[21].addListener('click', function() {
                    infowindow = getdata(21);
                    infowindow.open(map,marker[21]); 
                    });
                    */

// Move line to only when clicked
// Factor in station the station that has no schedule and null
// Check if infowindow exist, else close




