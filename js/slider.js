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