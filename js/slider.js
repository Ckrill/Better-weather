$(document).ready(function () {
    $("#bullets li").click(function () {
        var page = $(this).index("li");
        $('.slide-container').slick("slickGoTo", page);
    });
    $('.slide-container').on('afterChange', function (event, slick, direction) {
        var currentSlide = $('.slide-container').slick("slickCurrentSlide");
        $("#bullets li").toggleClass("active", false);
        $("#bullets li:nth-child(" + (currentSlide + 1) + ")" ).toggleClass("active", true);
    });
});

// Set height of Slider
function setSlideWidth() {
    var windowWidth = $(window).width();
    console.log(windowWidth);
    $(".page:not(:first-of-type)").css("width", windowWidth + "px");
}
// Set height of Slider - END

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

$(document).ready(function () {
    setSlideWidth();
    clickEvents();
});