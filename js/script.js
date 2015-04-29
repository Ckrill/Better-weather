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
         temp = json.data.weather[0].maxtempC;
         //wind = json.data.weather[0].hourly[4].windspeedKmph;
         insertInHtml(location,".location");
         insertInHtml(temp+"°",".degrees"); 
         
         // 2 day
         var temp2 = json.data.weather[1].maxtempC;
         insertInHtml(temp2+"°","#degrees2");
        
         // 3 day
         var temp3 = json.data.weather[2].maxtempC;
         insertInHtml(temp3+"°","#degrees3"); 
         
         var temp4 = json.data.weather[3].maxtempC;
         insertInHtml(temp3+"°","#degrees4");
    });

}
//Parse position -END

//Insert data
function insertInHtml(variable, id){
     $(id).text(variable);
 };
//Insert data - END

function WeekDay() {
    x=1;
    for (i = 0; i < 3; i++) { 
        var d = new Date();
        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        weekday[7] = "Sunday";
        weekday[8] = "Monday";
        weekday[9] = "Tuesday";
        var n = weekday[d.getDay()+i+1];
        x=x+1;
        document.getElementById('weekday'+x).innerHTML = n;
    }
}


// Ready
$(document).ready(function () {
    initiateSlide();
    setSlideHeight();
    getLocation();
    WeekDay();
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