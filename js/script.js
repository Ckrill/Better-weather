/*jslint browser: true*/
/*global $, jQuery, alert, func*/
/*jslint plusplus: true */

// Settings
var breakpoint = 1023, // unit in px

// Settings - END

// Vars for weather API
    tempC,
    tempC1,
    tempC2,
    tempC3,
    tempF,
    tempF1,
    tempF2,
    tempF3,
    winddir,
    winddirABB,
    windchillC,
    windchillF,
    windspeed,
    uv,
    sunrise,
    sunset,
    rain1, //slet?
    rain2,
    rain3,
    rain4,
    rain5,
    rain6,
    rain7,
    rain8,
    rain,
    rainAC0 = 0,
    rainAC1 = 0,
    rainAC2 = 0,
    rainAC3 = 0;
    
// Vars for weather API - END

// Initiate slider
function initiateSlide() {
    $('.slide-container').slick({
        initialSlide: 0,
        arrows: false,
        infinite: false,
//        swipe: false,
        swipe: true,
        accessibility: false,
        variableWidth: true
//        variableWidth: true,
//        responsive: [
//            {
//                breakpoint: breakpoint + 1,
//                settings: {
//                    swipe: true
//                }
//            }
//        ]
    });
}
// Initiate slider - END

// Initiate bullets
function initiateBullets() {
    $("#bullets li").click(function () {
        var page = $(this).index("li");
        $('.slide-container').slick("slickGoTo", page);
    });
    $('.slide-container').on('afterChange', function (event, slick, direction) {
        var currentSlide = $('.slide-container').slick("slickCurrentSlide");
        $("#bullets li").toggleClass("active", false);
        $("#bullets li:nth-child(" + (currentSlide + 1) + ")").toggleClass("active", true);
    });
}
// Initiate bullets - END

// Go to slide
function toSlide(slideNumb) {
    $(".slide-container").slick("slickGoTo", slideNumb);
}
// Go to slide - END

function loadingAnimation() {
    if (window.location.hash) {
        $("html").addClass("hashtag");
        $("#searchForm span").click(function () {
            window.location = document.location.href.replace(location.hash, "" );
        });
    }
}


// Set height of Slider
function setSlideHeight() {
    var windowHeight = $(window).height();
//    console.log(windowHeight);
    if ($(window).width() > breakpoint) {
        $(".page").css("height", (windowHeight - 52) + "px");
    } else {
        $(".page").css("height", (windowHeight) + "px");
    }
}
// Set height of Slider - END

// Set width of Slider
function setSlideWidth() {
    var windowWidth = $(window).width();
    if (windowWidth > breakpoint) {
        $("#today").parent(".page").css("width", (windowWidth / 1.6666667) + "px");
        $("#future").parent(".page").css("width", (windowWidth / 2.5) + "px");
        
        var currentSlide = $('.slide-container').slick("slickCurrentSlide");
        if (currentSlide === 2) {
            toSlide(1); // if slider is on future go back to today
        }
    } else {
        $(".page:not(:first-of-type)").css("width", windowWidth + "px");
    }
}
// Set width of Slider - END

// Get position
function getLocation() {
    if (window.location.hash) {
        parsePosition();
    } else {
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
    if (window.location.hash) {
        var query = window.location.hash.replace("#", ""),
            url = wwo + query + mode + key;
        $("#searchInput").val(window.location.hash.replace("#", ""));
    } else {
        var /*lati = position.coords.latitude,
        longi = position.coords.longitude,
        url = wwo+ lati+","+longi+mode+key; */
        url = wwo + 55.654385 + "," + 12.5915103 + mode + key;
    }

    $.getJSON(url, function (json) {
        console.log(json);
        if (!json.data.hasOwnProperty('error')) {
            
            // Location
            var cityName = json.data.nearest_area[0].areaName[0].value,
                country = json.data.nearest_area[0].country[0].value,
                location = cityName + ", " + country;
            
            insertInHtml(location, ".location");
            
            // Weather
            
            // Today 
            tempC = json.data.weather[0].maxtempC;
            tempF = json.data.weather[0].maxtempF;
            //wind = json.data.weather[0].hourly[4].windspeedKmph;
            winddir = json.data.weather[0].hourly[4].winddirDegree;
            winddirABB = json.data.weather[0].hourly[4].winddir16Point;
            windchillC = json.data.weather[0].hourly[4].WindChillC;
            windchillF = json.data.weather[0].hourly[4].WindChillF;
            windspeed = json.data.weather[0].hourly[4].windspeedKmph;
            windspeed = (windspeed * 1000) / 3600; // m/s
            uv = json.data.weather[0].uvIndex;
            sunrise = json.data.weather[0].astronomy[0].sunrise;
            sunset = json.data.weather[0].astronomy[0].sunset;
            
//            rainAC0 = 0;
//            rainAC1 = 0;
//            rainAC2 = 0;
//            rainAC3 = 0;
            var rainDay,
                rainHour;
            for (d = 0; d < 4; d++) {
                for (i = 0; i < 8; i++) {
                    rainHour = json.data.weather[d].hourly[i].precipMM;
                    eval("rainAC" + d + "+=" + Number(rainHour) + ";");
                }
                rain = eval("rainAC" + d);
                rainDay = "day" + d;
                
            }
            
            // Day 1
            tempC1 = json.data.weather[1].maxtempC;
            tempF1 = json.data.weather[1].maxtempF;
            
            // Day 2
            tempC2 = json.data.weather[2].maxtempC;
            tempF2 = json.data.weather[2].maxtempF;
            
            // Day 3
            tempC3 = json.data.weather[3].maxtempC;
            tempF3 = json.data.weather[3].maxtempF;
            
            initiateSetting();
            insertTemperature();
            
            for (d = 0; d < 4; d++) { // Insert rain
                insertInHtml(Math.round(eval("rainAC" + d)) + " mm", "#precipitation" + d);
            }
             
        } else {
            insertInHtml("Couldn't find your location", ".location");
            insertInHtml(":(", ".degrees");
        }
        $(".loadingScreen").fadeOut();
    });
}
//Parse position - END

//Insert data
function insertInHtml(variable, id) {
    $(id).text(variable);
}
//Insert data - END

function settingsToggle(nameId, units) {
    var uvIndex = $('<div class="uvIndex"><div class="graphic"><img class="speedometer" src="img/speedometer.svg"><img class="speedometer-pin" src="img/speedometer-pin.svg" style="transform: rotate(' + (110 + (uv * 20)) + 'deg);"></div><div class="text">UV Index</div></div>'),
        sun = $('<div class="sun"><div class="graphic"><img src="img/sunUpDown.svg"></div><div class="sunrise text">' + sunrise + '</div><div class="sunset text">' + sunset + '</div></div>'),
        windSpeed = $('<div class="windSpeed"><div class="graphic"><img class="fan" src="img/fan.svg" style="animation-duration: ' + (8 / windspeed) + 's; -webkit-animation-duration: ' + (8 / windspeed) + 's;"></div><div class="text">' + Math.round(windspeed) + ' m/s</div></div>'),
        windDir = $('<div class="windDir"><div class="graphic"><img class="compass" src="img/winddir.svg"><img class="pin" src="img/pin.svg" style="-webkit-transform: rotate(' + winddir + 'deg); -moz-transform: rotate(' + winddir + 'deg); -ms-transform: rotate(' + winddir + 'deg); transform: rotate(' + winddir + 'deg);"></div><span class="text">' + winddirABB + '</span></div>'),
        windChill = $('<div class="windChill"><div class="text">Feels like</div><div class="windChillTemp">' + eval("windchill" + units) + '°</div></div>');
    if ($('.' + nameId).length > 0) {
        $(".optionalInfo ." + nameId + ", .optionalInfo1 ." + nameId + ", .optionalInfo2 ." + nameId + ", .optionalInfo3 ." + nameId).show();
    } else {
        $(".optionalInfo").append(eval(nameId).clone());
        $(".optionalInfo1").append(eval(nameId).clone());
        $(".optionalInfo2").append(eval(nameId).clone());
        $(".optionalInfo3").append(eval(nameId).clone());
    }
}

// Weekday handler
function WeekDay() {
    var x = 1;
    for (i = 0; i < 2; i++) {
        var d = new Date(),
            weekday = new Array(7);
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
        var n = weekday[d.getDay() + i + 1];
        x = x + 1;
        document.getElementById('weekday' + x).innerHTML = n;
    }
}
// Weekday handler - END

$("#searchForm").submit(function (e) {
    var hashtag = $("#searchInput").val();
    window.location.href = '#' + hashtag;
    location.reload();
    return false;
});


function searchBar() {
    $("#searchIcon").click(function () {
        $("#searchForm").addClass("searchActive");
        $("#searchInput").focus();
        $("#searchInput").focusout(function () {
            $("#searchForm").removeClass("searchActive");
        });
    });
}
function checkboxCheck() {
    $('.setting input').change(function () {
        var value = this.checked ? 'true' : 'false',
            nameId = $(this).parents('.setting').attr('id');
        if (value === "true") {
            localStorage.setItem(nameId, "true");
//            eval('' + nameId + '(nameId1)');
            if ($('#' + nameId).hasClass("trueFalse")) {
                var units = "C";
                if ($("#degree input:checked").length) {
                    units = "F";
                } else {
                    units = "C";
                }
                settingsToggle(nameId, units);
            }
        } else {
            localStorage.setItem(nameId, "0");
            $('.' + nameId).hide();
        }
    });
}

function initiateSetting() {
    var myStringArray = ["degree", "precipitation", "uvIndex", "windDir", "windChill", "windSpeed", "sun"],
        arrayLength = myStringArray.length;
    for (var i = 0; i <= arrayLength; i++) {
        if (localStorage.getItem(myStringArray[i]) == "true"){
            $('#' + myStringArray[i] + ' input').prop('checked', true);
            if ($('#' + myStringArray[i]).hasClass("trueFalse")) {
                var units = "C";
                if ($("#degree input:checked").length) {
                    units = "F";
                } else {
                    units = "C";
                }
                settingsToggle(myStringArray[i], units);
            }
        }
    }
}

function settingsIcon() {
    var currentSlide = $('.slide-container').slick("slickCurrentSlide");
    if (currentSlide !== 0) {
        toSlide(0);
        $(".settingsIcon").css("transform", "rotate(180deg)");
        $(".settingsIcon").toggleClass("active", true);
    } else {
        toSlide(1);
        $(".settingsIcon").css("transform", "rotate(0deg)");
        $(".settingsIcon").toggleClass("active", false);
    }
}

// Insert temperature
function insertTemperature() {
    setTimeout(function () {
        if ($("#degree input:checked").length) {
            insertInHtml(tempF + "°", ".degrees");
            insertInHtml(tempF1 + "°", "#degrees1");
            insertInHtml(tempF2 + "°", "#degrees2");
            insertInHtml(tempF3 + "°", "#degrees3");
            insertInHtml(windchillF + "°", ".windChillTemp");
        } else {
            insertInHtml(tempC + "°", ".degrees");
            insertInHtml(tempC1 + "°", "#degrees1");
            insertInHtml(tempC2 + "°", "#degrees2");
            insertInHtml(tempC3 + "°", "#degrees3");
            insertInHtml(windchillC + "°", ".windChillTemp");
        }
    }, 50);
}
// Insert temperature - END

// Insert rain
function insertRain() {
    setTimeout(function () {
        if ($("#precipitation input:checked").length) {
//            insertInHtml(tempC + "°", ".degrees");
            rainDay = "day" + 0;
            if (rain > 0.9) {
                if (rain > 40) {
                    rain = 40;
                }
                new Rain(rainDay, {
                    angle: 3,
                    intensity: rain
                });
            }
            $("#day0").show();
            console.info("Let it rain!");
        } else {
            $("#day0").hide();
            console.info("Stahp!");
        }
    }, 50);
}
// Insert rain - END


// Mobile Keyboard resize fix 
function keyboardCheck() {
    if ($(document.activeElement).attr('type') === 'search') {
        setSlideWidth();
    } else {
        setSlideHeight();
        setSlideWidth();
    }
}
// Mobile Keyboard resize fix -END

// Click
function clickEvents() {
    $(".settingsIcon").click(function () {
        settingsIcon();
    });
    $("#degree label").click(function () {
        insertTemperature();
    });
    $("#precipitation label").click(function () {
        insertRain();
    });
    searchBar();
}
// Click - END

// Ready
$(document).ready(function () {
    loadingAnimation();
    initiateSlide();
    setSlideHeight();
    setSlideWidth();
    initiateBullets();
    parsePosition(); //getLocation();
    WeekDay();
//    moveFuture();
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
    keyboardCheck();
//    moveFuture();
});
//Resize - END

// Arrow keys
$(document).keyup(function (e) {
	if (e.which === 40) { // Down
        // Test here
	}
});
// Arrow keys - END