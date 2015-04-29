$(document).ready(function () {
    $("#bullets li").click(function () {
        var page = $(this).index("li");
        $('.slide-container').slick("slickGoTo", page);
    });
});