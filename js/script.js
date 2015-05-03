// Initiate slider
function initiateSlide() {
    $('.slide-container').slick({
        initialSlide: 1,
        arrows: false,
        infinite: false,
        swipe: false,
        responsive: [
            {
                breakpoint: 960,
                settings: {
                    swipe: true
                }
            }
        ]
    });
}
// Initiate slider - END

// Set height of Slider
function setSlideHeight() {
    var windowHeight = $(window).height();
    console.log(windowHeight);
    if ($(window).width() > 750) {
         $(".page").css("height", (windowHeight-50) + "px");
    }else{
        $(".page").css("height", (windowHeight) + "px");
    }
}
// Set height of Slider - END

// Get position
/*function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(parsePosition);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}*/
// Get position -END

//Parse position
function parsePosition(position) {
    var wwo = "http://api.worldweatheronline.com/free/v2/weather.ashx?q=",
    mode = "&format=json&num_of_days=4&includelocation=yes",
    key =  "&key=82594deb029ae9095181418b6edfd";
    if(position==0){
        var query = $("#searchInput").val();
        url = wwo+query+mode+key;
    }else{
        var /*lati = position.coords.latitude,
        longi = position.coords.longitude,
        url = wwo+ lati+","+longi+mode+key; */
        url = wwo+ 55.654385+","+12.5915103+mode+key;
    }
    //url = wwo+ 55.654385+","+12.5915103+mode+key;
    
    $.getJSON(url, function (json) {
         console.log(json);
         var cityName = json.data.nearest_area[0].areaName[0].value,
         country = json.data.nearest_area[0].country[0].value,
         location = cityName+", "+country,
         
         // Today 
         temp = json.data.weather[0].maxtempC,
         //wind = json.data.weather[0].hourly[4].windspeedKmph;
         winddir = json.data.weather[0].hourly[4].winddirDegree,
         winddirABB = json.data.weather[0].hourly[4].winddir16Point,
         windchill = json.data.weather[0].hourly[4].WindChillC,
         windspeed = json.data.weather[0].hourly[4].windspeedKmph,
         windspeed = (windspeed *1000)/3600, // m/s
         uv = json.data.weather[0].uvIndex,
         sunrise = json.data.weather[0].astronomy[0].sunrise,
         sunset = json.data.weather[0].astronomy[0].sunset;
         insertInHtml(location,".location");
         insertInHtml(temp+"°",".degrees");
         function windDir(){
             $(".pin").css({
                 '-webkit-transform' : 'rotate('+ winddir +'deg)',
                 '-moz-transform' : 'rotate('+ winddir +'deg)',
                 '-ms-transform' : 'rotate('+ winddir +'deg)',
                 'transform' : 'rotate('+ winddir +'deg)'
             }
             );
             insertInHtml(winddirABB,".dirABB");
         }
         windDir();
         
         function uxindex(){
            insertInHtml(uv,".uv");
         }
         uxindex();
        
         function windChill(){
            insertInHtml(windchill+"°",".windChill");
         }
         windChill();
         
        
         function windSpeed(){
            $(".windspeed img").css({
                 'animation-duration' : (8/windspeed)+'s',
                 '-webkit-animation-duration' : (8/windspeed)+'s',
                 }
             );
             $(".windspeed div").text(Math.round(windspeed));
         }
         windSpeed();
        
        
         function sun(){
            insertInHtml(sunrise,".sunrise");
            insertInHtml(sunset,".sunset");
         }
        sun();
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

// Weekday handler
function WeekDay() {
    x=1;
    for (i = 0; i < 2; i++) { 
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
// Weekday handler - END


function ToSlide(slideNumb){
    $(".slide-container").slick("slickGoTo", slideNumb);
}

function moveFuture(){
     if ($(window).width() > 750) {
         $("#future").appendTo("div[data-slick-index='1']");
         $("body").addClass("desktopMode");
         $('.slide-container').slick("slickGoTo", 1);
    }
    else {
        $("#future").appendTo("div[data-slick-index='2']");
        $("body").removeClass("desktopMode");
    }
};

$("#searchForm").submit(function(e){
    
    parsePosition("0");
    return false;
});

function searchBar() {
    $("#searchIcon").hover(function() {
        $("#searchInput").addClass("searchActive");
        $("#searchInput").focus();
        $( "#searchInput" ).mouseout(function() {
            $( this ).removeClass("searchActive");
        });
    });
}

// Ready
$(document).ready(function () {
    initiateSlide();
    setSlideHeight();
    parsePosition(); //getLocation();
    WeekDay();
    moveFuture();
    searchBar();
});
// Ready - END

// Scroll
$(window).scroll(function () {
});
// Scroll - END


// Resize
$(window).resize(function () {
    setSlideHeight();
    moveFuture();
});
//Resize - END

