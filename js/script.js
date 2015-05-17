/*jslint browser: true*/
/*global $, jQuery, alert, func*/
/*jslint plusplus: true */

var winddir = "",
winddirABB = "",
windchill = "",
windspeed = "",
uv = "",
sunrise = "",
sunset = "";

// Initiate slider
function initiateSlide() {
    $('.slide-container').slick({
        initialSlide: 1,
        arrows: false,
        infinite: false,
        swipe: false,
        variableWidth: true,
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

function loadingAnimation() {
    if(window.location.hash) {
        $("html").addClass("hashtag");
        $("#searchForm span").click(function() {
             window.location = document.location.href.replace(location.hash , "" );;
        });
    }
}


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

// Set width of Slider
function setSlideWidth() {
    var windowWidth = $(window).width();
    console.log(windowWidth);
    $(".page:not(:first-of-type)").css("width", windowWidth + "px");
}
// Set width of Slider - END

// Get position
function getLocation() {
    if(window.location.hash){
        parsePosition();
    }else{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(parsePosition);
        } else { 
            alert("Geolocation is not supported by this browser.");
        }
    }
}
// Get position -END

//Parse position
function parsePosition(position) {
    var wwo = "http://api.worldweatheronline.com/free/v2/weather.ashx?q=",
    mode = "&format=json&num_of_days=4&includelocation=yes",
    key =  "&key=82594deb029ae9095181418b6edfd";
    if(window.location.hash){
        var query = window.location.hash.replace("#", ""),
        url = wwo+query+mode+key;
        $("#searchInput").val(window.location.hash.replace("#", ""));
    }else{
        var /*lati = position.coords.latitude,
        longi = position.coords.longitude,
        url = wwo+ lati+","+longi+mode+key; */
        url = wwo+ 55.654385+","+12.5915103+mode+key;
    }
    
    $.getJSON(url, function (json) {
         console.log(json);
         if(!json.data.hasOwnProperty('error')){
             var cityName = json.data.nearest_area[0].areaName[0].value,
             country = json.data.nearest_area[0].country[0].value,
             location = cityName+", "+country,

             // Today 
             temp = json.data.weather[0].maxtempC;
             //wind = json.data.weather[0].hourly[4].windspeedKmph;
             winddir = json.data.weather[0].hourly[4].winddirDegree,
             winddirABB = json.data.weather[0].hourly[4].winddir16Point,
             windchill = json.data.weather[0].hourly[4].WindChillC,
             windspeed = json.data.weather[0].hourly[4].windspeedKmph,
             windspeed = (windspeed *1000)/3600, // m/s
             uv = json.data.weather[0].uvIndex,
             sunrise = json.data.weather[0].astronomy[0].sunrise,
             sunset = json.data.weather[0].astronomy[0].sunset,
             rain1 = json.data.weather[0].hourly[0].precipMM,
             rain2 = json.data.weather[0].hourly[1].precipMM,
             rain3 = json.data.weather[0].hourly[2].precipMM,
             rain4 = json.data.weather[0].hourly[3].precipMM,
             rain5 = json.data.weather[0].hourly[4].precipMM,
             rain6 = json.data.weather[0].hourly[5].precipMM,
             rain7 = json.data.weather[0].hourly[6].precipMM,
             rain8 = json.data.weather[0].hourly[7].precipMM,
             rain = Number(rain1)+Number(rain2)+Number(rain3)+Number(rain4)+Number(rain5)+Number(rain6)+Number(rain7);

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
             initiateSetting();
         }else{
            insertInHtml("Couldn't find your location",".location");
            insertInHtml(":(",".degrees");
        }
        $(".loadingScreen").fadeOut();
    });
}
//Parse position -END

//Insert data
function insertInHtml(variable, id){
     $(id).text(variable);
 };
//Insert data - END

function windDir(){
    if ($('#winddir').length > 0) {
        $(this).show();
    }else{
        
        $('<div class="windDir"><img src="img/winddir.svg"><img class="pin" src="img/pin.svg" style="-webkit-transform: rotate('+ winddir +'deg); -moz-transform: rotate('+ winddir +'deg); -ms-transform: rotate('+ winddir +'deg); transform: rotate('+ winddir +'deg);"><span class="dirABB">'+winddirABB+'</span></div>').appendTo(".optionalInfo");
    }
}

function uvIndex(){
    if ($('.uv').length > 0) {
        $(this).show();
    }else{
     $('<div class="uvIndex"><img src="img/speedometer.svg"><img src="img/speedometer-pin.svg" style="transform: rotate('+(110+(uv*20))+'deg);"></div>').appendTo(".optionalInfo");
    }
}

 function windChill(){
    if ($('.windChill').length > 0) {
            $(this).show();
    }else{
        $('<div class="windChill">'+windchill+'°</div>').appendTo(".optionalInfo");
    }
 }


 function windSpeed(){
     if ($('.windSpeed').length > 0) {
            $(this).show();
    }else{
     $('<div class="windSpeed"><img src="img/fan_ikkesvg.png" style="animation-duration: '+(8/windspeed)+'s; -webkit-animation-duration: '+(8/windspeed)+'s;"><div>'+Math.round(windspeed)+'</div><span>m/s</span></div>').appendTo(".optionalInfo");
    }
 }


function sun(){
    if ($('.sun').length > 0) {
            $(this).show();
    }else{
        $('<div class="sun"><img src="img/sunUpDown.svg"><div class="sunrise">'+sunrise+'</div><div class="sunset">'+sunset+'</div></div>').appendTo(".optionalInfo");
    }
}

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


function toSlide(slideNumb){
    $(".slide-container").slick("slickGoTo", slideNumb);
}

function moveFuture(){
     if ($(window).width() > 750) {
         $("#future").appendTo("div[data-slick-index='1']");
         $("body").addClass("desktopMode");
         //$('.slide-container').slick("slickGoTo", 1);
    }
    else {
        $("#future").appendTo("div[data-slick-index='2']");
        $("body").removeClass("desktopMode");
    }
}

$("#searchForm").submit(function(e){
    var hashtag = $("#searchInput").val();
    window.location.href = '#'+hashtag;
    location.reload();
    return false;
});


function searchBar() {
    $("#searchIcon").click(function() {
        $("#searchForm").addClass("searchActive");
        $("#searchInput").focus();
        $( "#searchInput" ).focusout(function() {
            $( "#searchForm" ).removeClass("searchActive");
        });
    });
}
function checkboxCheck() {
    $('.setting input').change(function(){
        var value = this.checked ? 'true' : 'false';
        var nameId = $(this).parents('.setting').attr('id');
        console.info($(this).parents('.setting'));
        console.log(value);
        if(value == "true" ) {
            localStorage.setItem(nameId, "true");
            eval(''+nameId+'()');
            
        } else {
            localStorage.setItem(nameId, "0");
            $('.'+nameId+'').hide();
        }
    });
}

function initiateSetting() {
    var myStringArray = ["uvIndex","windDir","windChill", "windSpeed","sun"];
    var arrayLength = myStringArray.length;
    for (var i = 0; i <= arrayLength; i++) {
        if (localStorage.getItem(myStringArray[i]) == "true"){
            $('#' + myStringArray[i] + ' input').prop('checked', true);
            eval('' + myStringArray[i] + '()');
        }
    }
}

// Click
function clickEvents() {
    $(".settingsIcon").click(function () {
        var currentSlide = $('.slide-container').slick("slickCurrentSlide");
        if (currentSlide !== 0) {
            toSlide(0);
            $(".settingsIcon").css("transform", "rotate(180deg)");
            $(".settingsIcon").toggleClass("active", true);
        } else {
            toSlide(1);
            $(".settingsIcon").css("transform", "rotate(0deg)");
            $(".settingsIcon").toggleClass("active", false);
        };
    });
};
// Click - END

// Ready
$(document).ready(function () {
    loadingAnimation();
    initiateSlide();
    setSlideHeight();
    setSlideWidth();
    parsePosition(); //getLocation();
    WeekDay();
    moveFuture();
    searchBar();
    checkboxCheck();
    clickEvents();
});
// Ready - END

// Scroll
$(window).scroll(function () {
});
// Scroll - END


// Resize
$(window).resize(function () {
    setSlideHeight();
    setSlideWidth();
    moveFuture();
});
//Resize - END