/*jslint browser: true*/
/*global $, jQuery, alert, func*/
/*jslint plusplus: true */

// Settings
var breakpoint = 1023, // unit in px
    days = 4, // Number of days the app is showing

// Settings - END

// Vars for weather API
    // Temerature
    tempC0,
    tempC1,
    tempC2,
    tempC3,
    tempF0,
    tempF1,
    tempF2,
    tempF3,
    
    // Wind
    winddir0,
    winddir1,
    winddir2,
    winddir3,
    
    winddirABB0,
    winddirABB1,
    winddirABB2,
    winddirABB3,
    
    windchillC0,
    windchillC1,
    windchillC2,
    windchillC3,
    windchillF0,
    windchillF1,
    windchillF2,
    windchillF3,
    
    windspeedC0,
    windspeedC1,
    windspeedC2,
    windspeedC3,
    windspeedF0,
    windspeedF1,
    windspeedF2,
    windspeedF3,
    
    // UV Index
    uv0,
    uv1,
    uv2,
    uv3,
    
    // Sunrise / Sunset
    sunrise0,
    sunrise1,
    sunrise2,
    sunrise3,
    
    sunset0,
    sunset1,
    sunset2,
    sunset3,
    
    // Rain
    rainAC0 = 0,
    rainAC1 = 0,
    rainAC2 = 0,
    rainAC3 = 0;
    
// Vars for weather API - END

// Initiate slider
function initiateSlide() {
    $('.slide-container').slick({
        initialSlide: 1,
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
//        console.log(json);
        if (!json.data.hasOwnProperty('error')) {
            
            // Location
            var cityName = json.data.nearest_area[0].areaName[0].value,
                country = json.data.nearest_area[0].country[0].value,
                location = cityName + ", " + country;
            
            insertInHtml(location, ".location");
            
            // Weather
            for (d = 0; d < days; d++) {
                eval("tempC" + d + " = json.data.weather[" + d + "].maxtempC;");
                eval("tempF" + d + " = json.data.weather[" + d + "].maxtempF;");
                
                eval("sunrise" + d + " = json.data.weather[" + d + "].astronomy[0].sunrise;");
                eval("sunset" + d + " = json.data.weather[" + d + "].astronomy[0].sunset;");
                eval("uv" + d + " = json.data.weather[" + d + "].uvIndex;");
                
                eval("windspeedK" + d + " = json.data.weather[" + d + "].hourly[4].windspeedKmph;");
                eval("windspeedK" + d + " =  + (windspeedK" + d + " * 1000) / 3600;"); // m/s
                eval("windspeedM" + d + " = json.data.weather[" + d + "].hourly[4].windspeedMiles;");
//                eval("windspeedM" + d + " =  + (windspeedK" + d + " * 1000) / 3600;"); // m/s // This should be changed to miles, but what do Americans use?
                
                eval("windchillC" + d + " = json.data.weather[" + d + "].hourly[4].WindChillC;");
                eval("windchillF" + d + " = json.data.weather[" + d + "].hourly[4].WindChillF;");
                
                eval("winddir" + d + " = json.data.weather[" + d + "].hourly[4].winddirDegree;");
                eval("winddirABB" + d + " = json.data.weather[" + d + "].hourly[4].winddir16Point;");
            }
            
            var rainDay,
                rainHour;
            for (d = 0; d < days; d++) {
                for (i = 0; i < 8; i++) {
                    rainHour = json.data.weather[d].hourly[i].precipMM;
                    eval("rainAC" + d + " += " + Number(rainHour) + ";");
                }
                rainDay = "day" + d;
            }
            
            initiateSetting();
            insertTemperature();
            
            for (d = 0; d < days; d++) { // Insert rain
                insertInHtml(Math.floor(eval("rainAC" + d)) + "<span class='units'> mm</span>", "#precipitation" + d);
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
    $(id).html(variable);
}
//Insert data - END

function settingsToggle(nameId, units) {
    for (d = 0; d < days; d++) {
//        console.log(nameId + " - - - " + units);
        var uvIndex = $('<div class="uvIndex"><div class="graphic"><img class="speedometer" src="img/speedometer.svg"><img class="speedometer-pin" src="img/speedometer-pin.svg" style="transform: rotate(' + (110 + (eval("uv" + d) * 20)) + 'deg);"></div><div class="text">UV Index</div></div>'),
            sun = $('<div class="sun"><div class="graphic"><img src="img/sunUpDown.svg"></div><div class="sunrise text">' + eval("sunrise" + d) + '</div><div class="sunset text">' + eval("sunset" + d) + '</div></div>'),
            windSpeed = $('<div class="windSpeed"><div class="graphic"><img class="fan" src="img/fan.svg" style="animation-duration: ' + (8 / eval("windspeedK" + d)) + 's; -webkit-animation-duration: ' + (8 / eval("windspeedK" + d)) + 's;"></div><div class="text">' + Math.round(eval("windspeedK" + d)) + ' m/s</div></div>'),
            windDir = $('<div class="windDir"><div class="graphic"><img class="compass" src="img/winddir.svg"><img class="pin" src="img/pin.svg" style="-webkit-transform: rotate(' + eval("winddir" + d) + 'deg); -moz-transform: rotate(' + eval("winddir" + d) + 'deg); -ms-transform: rotate(' + eval("winddir" + d) + 'deg); transform: rotate(' + eval("winddir" + d) + 'deg);"></div><span class="text">' + eval("winddirABB" + d) + '</span></div>'),
            windChill = $('<div class="windChill"><div class="text">Feels like</div><div class="windChillTemp">' + eval("windchill" + units + d) + '</div></div>');
        if ($(".optionalInfo" + d + " ." + nameId).length > 0) {
            $(".optionalInfo" + d + " ." + nameId).show();
        } else {
            if (nameId === "precipitation") {
                insertRain();
            } else {
                $(".optionalInfo" + d).append(eval(nameId).clone());
            }
        }
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
        var n = weekday[d.getDay() + i + 2];
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
//        console.log(nameId);
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
            $('.' + nameId+'2').hide();
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
        for (d = 0; d < days; d++) {
            if ($("#degree input:checked").length) {
                insertInHtml(eval("tempF" + d) + "°", "#degrees" + d);
                insertInHtml(eval("windchillF" + d), ".optionalInfo" + d + " .windChillTemp");
            } else {
                insertInHtml(eval("tempC" + d) + "°", "#degrees" + d);
                insertInHtml(eval("windchillC" + d), ".optionalInfo" + d + " .windChillTemp");
            }
        }
    }, 50);
}
// Insert temperature - END

var rainAC;
// Insert rain
function insertRain() {
    setTimeout(function () {
        for (d = 0; d < 5; d++) {
            if ($("#precipitation input:checked").length) {
    //            insertInHtml(tempC + "°", ".degrees");
                if( $('#day'+d).is(':empty') ) {
                    rainDay = "day" + d;
                    rainAC = eval("rainAC"+d);
//                    console.log(rainAC);
                    if (rainAC > 0.9) {          //denne er vist ikke day0s værdi, men day3
                        if (rainAC > 40) {
                            rainAC = 40;
                        }
                        new Rain(rainDay, {
                            angle: 3,
                            intensity: rainAC
                        });
                    }
                }else{
                    $(".precipitation2").show();
//                    console.info("Show rain!");
                }
            } else {
                $("#day0 svg").hide();
//                console.info("Stahp!");
            }
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