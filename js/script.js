// Initiate slider
function initiateSlide() {
    $('.slide-container').slick({
        initialSlide: 1,
        arrows: false,
        infinite: false
    });
}
// Initiate slider - END

// Set height of Slider
function setSlideHeight() {
    var windowHeight = $(window).height();
    console.log(windowHeight);
    $(".page").css("height", windowHeight + "px");
}
// Set height of Slider - END

// Get position
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(parsePosition);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}
// Get position -END

//Parse position
function parsePosition(position) {
    var wwo = "http://api.worldweatheronline.com/free/v2/weather.ashx?q=",
    lati = position.coords.latitude,
    longi = position.coords.longitude,
    mode = "&format=json&num_of_days=4&includelocation=yes",
    key =  "&key=82594deb029ae9095181418b6edfd", 
    url = wwo+ lati+","+longi+mode+key;
    
    $.getJSON(url, function (json) {
         console.log(json);
         var cityName = json.data.nearest_area[0].areaName[0].value,
         country = json.data.nearest_area[0].country[0].value,
         location = cityName+", "+country,
         
         // Today 
         temp = json.data.weather[0].maxtempC,
         wind = json.data.weather[0].hourly[4].windspeedKmph;
         console.log(wind);
         
         insertInHtml(location,".location");
         insertInHtml(temp+"°",".degrees"); 
    });

}
//Parse position -END

//Insert data
function insertInHtml(variable, id){
     $(id).text(variable);
 };
//Insert data - END




// Ready
$(document).ready(function () {
    initiateSlide();
    setSlideHeight();
    getLocation();
});

// Ready - END

// Scroll
$(window).scroll(function () {
});
// Scroll - END


// Resize
$(window).resize(function () {
    setSlideHeight();
});
//Resize - END