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

// Ready
$(document).ready(function () {
    initiateSlide();
    setSlideHeight();
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