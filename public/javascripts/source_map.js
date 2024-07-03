// chỗ này viết code js của file source_map.ejs

function httpAsync(postData, url, method, callback) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(JSON.stringify(postData));
    xmlHttp.onload = function () {
        if (xmlHttp.readyState === xmlHttp.DONE) {
            if (xmlHttp.status === 200) {
                callback(xmlHttp.responseText);
            }
        }
    }
}


$(document).ready(function () {
    get_map_list();
})

var LANG = "en";

function get_map_list() {
    httpAsync(null, "/map/get_map_list", "GET", function (result) {
        httpAsync(null, "/source/get/lang", "GET", function (result_lang) {
            let l = JSON.parse(result_lang);
            LANG = l.lang;
            let data = [];
            if (result == "" || result == null) {
                initMap(data);
            } else {
                data = JSON.parse(result);
                initMap(data);
            }
        })
        // console.log(result)
    })
}

// cấu hình dữ liệu
// function change_time(x) {
//     if (x == null || x == "") {
//         return "";
//     } else if (Number.isNaN(Number(x))) {
//         var y = new Date(x);
//         return y.toString().slice(0, 25);
//     } else {
//         var y = new Date(Number(x));
//         return y.toString().slice(0, 25);
//     }
// }
function change_time(x){
    if(x == null || x == ""){
        return "";
    } else if(Number.isNaN(Number(x))){
      var y = new Date(x);
      return y.toLocaleString('en-GB', { timeZone: 'GMT' });
    }else{
    var y = new Date(Number(x));
    return y.toLocaleString('en-GB', { timeZone: 'GMT' });
    }
  }

  function not_null(x){
    if(x == null || x =="null"){
      return "";
    }else{
      return x;
    }
  }


window.initMap = function(data) {
    // map options
    var options = {
        zoom: 5,
        center: { lat: 21.028511, lng: 105.804817 }
    };

    // New map
    var map = new google.maps.Map(document.getElementById("map"), options);

    //Add marker
    for (var i = 0; i < data.length; i++) {
        var coords = { lat: Number(data[i].location_lat), lng: Number(data[i].location_long) };
        console.log(data.length);
        if (data[i].status == 1) {
            var marker = new google.maps.Marker({
                position: coords,
                map: map,
                animation: google.maps.Animation.DROP,
                // icon: /images/ + data[i].icon
                icon: return_icon(data[i].status)
            });
        } else {
            var marker = new google.maps.Marker({
                position: coords,
                map: map,
                animation: google.maps.Animation.DROP,
                // icon: /images/ + data[i].icon
                icon: return_icon(data[i].status)
            });
        }
        function return_icon(status) {
            if (status == 1) {
                return "/images/small-connect.png";
            } else {
                return "/images/small-disconnect.png";
            }
        }
        let conten_ = "";
        if(LANG == "en"){
            conten_ =  '<p>' + "ID: " + not_null(data[i].id) + '</p>' + '<p>' + "Name: " + not_null(data[i].name) + '</p>' + '<p>'+ "Time: " + not_null(change_time(data[i].last_data_time)) + '</p>' + '<p>' + "Value of num: " + not_null(data[i].last_ValOfNum) + '</p>' + '<p>' + "Address: " + not_null(data[i].address) + '</p>' 
        }else{
            conten_ =  '<p>' + "ID: " + not_null(data[i].id) + '</p>' + '<p>' + "Tên: " + not_null(data[i].name) + '</p>' + '<p>'+ "Thời điểm: " + not_null(change_time(data[i].last_data_time)) + '</p>'  + '<p>' + "Chỉ số: " + not_null(data[i].last_ValOfNum) + '</p>' + '<p>' + "Địa chỉ: " + not_null(data[i].address) + '</p>' 
        }

        marker['infowindow'] = new google.maps.InfoWindow({
            content: conten_
        });

        google.maps.event.addListener(marker, 'click', function () {
            this['infowindow'].open(map, this);
        });


        // //Array of marker
        // var markers = [
        //     {
        //         coords: { lat: data[i].lat, lng: data[i].lng },
        //         content: data[i].content,
        //         iconImage: data[i].icon
        //     }
        // ];
        // //Loop through markers
        // for (var i = 0; i < markers.length; i++) {
        //     //Add markers
        //     addMarker(markers[i]);


        // }
        // //Add Marker Function
        // function addMarker(props) {
        //     var marker = new google.maps.Marker({
        //         position: props.coords,
        //         map: map,
        //         icon: props.iconImage
        //     });
        //     if (props.content) {
        //         var infoWindow = new google.maps.InfoWindow({
        //             content: props.content
        //         });
        //         marker.addListener('click', function () {
        //             infoWindow.open(map, marker);
        //         });
        //     }
        // }

    }

}

