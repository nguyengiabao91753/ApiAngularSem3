"user strict";

// Preloader
$(window).on("load", function () {
    $(".preloader").fadeOut(1000);
});

//Menu Dropdown
$("ul>li>.sub-menu").parent("li").addClass("has-sub-menu");

$(".menu li a").on("click", function (e) {
    var element = $(this).parent("li");
    if (element.hasClass("open")) {
        element.removeClass("open");
        element.find("li").removeClass("open");
        element.find("ul").slideUp(400, "swing");
    } else {
        element.addClass("open");
        element.children("ul").slideDown(400, "swing");
        element.siblings("li").children("ul").slideUp(400, "swing");
        element.siblings("li").removeClass("open");
        element.siblings("li").find("li").removeClass("open");
        element.siblings("li").find("ul").slideUp(400, "swing");
    }
});

// Responsive Menu
var headerTrigger = $(".header-trigger");
headerTrigger.on("click", function () {
    $(".menu,.header-trigger").toggleClass("active");
    $(".overlay").toggleClass("overlay-color");
    $(".overlay").removeClass("active");
});

var headerTrigger2 = $(".top-bar-trigger");
headerTrigger2.on("click", function () {
    $(".header-top").toggleClass("active");
    $(".overlay").toggleClass("overlay-color");
    $(".overlay").removeClass("active");
});

var over = $(".overlay");
over.on("click", function () {
    $(".overlay").removeClass("overlay-color");
    $(".menu, .header-trigger").removeClass("active");
    $(".header-top").removeClass("active");
});

// Scroll To Top
var scrollTop = $(".scrollToTop");
$(window).on("scroll", function () {
    if ($(this).scrollTop() < 500) {
        scrollTop.removeClass("active");
    } else {
        scrollTop.addClass("active");
    }
});

//Click event to scroll to top
$(".scrollToTop").on("click", function () {
    $("html, body").animate(
        {
            scrollTop: 0,
        },
        300
    );
    return false;
});

// pagination
$(".pagination li a").on("click", function () {
    $(".pagination li a").removeClass("active");
    $(this).addClass("active");
});



//Faq
$(".faq-wrapper .faq-title, .faq-wrapper-two .faq-title-two").on(
    "click",
    function (e) {
        var element = $(this).parent(".faq-item, .faq-item-two");
        if (element.hasClass("open")) {
            element.removeClass("open");
            element.find(".faq-content, .faq-content-two").removeClass("open");
            element
                .find(".faq-content, .faq-content-two")
                .slideUp(300, "swing");
        } else {
            element.addClass("open");
            element
                .children(".faq-content, .faq-content-two")
                .slideDown(300, "swing");
            element
                .siblings(".faq-item, .faq-item-two")
                .children(".faq-content, .faq-content-two")
                .slideUp(300, "swing");
            element.siblings(".faq-item, .faq-item-two").removeClass("open");
            element
                .siblings(".faq-item, .faq-item-two")
                .find(".faq-title, .faq-title-two")
                .removeClass("open");
            element
                .siblings(".faq-item, .faq-item-two")
                .find(".faq-content, .faq-content-two")
                .slideUp(300, "swing");
        }
    }
);

// $(".faq-item").on("click", function () {
//     $(".faq-content")
//       .not($(this).parent().find(".action-dropdown"))
//       .removeClass("show");
//     $(this).parent().find(".action-dropdown").toggleClass("show");
//   });


// Bus Ticket Filter
$(".ticket-type li a").on("click", function () {
    $(".ticket-type li a").removeClass("active");
    $(this).addClass("active");
});

// Select Seats
$(".seat-wrapper .seat").on("click", function () {
    if (!$(this).parent().hasClass("disabled")) $(this).toggleClass("selected");
});
// Seat Expand
$(".select-seat-btn").on("click", function () {
    $(this)
        .closest(".ticket-item")
        .children(".seat-plan-wrapper")
        .toggleClass("selected");
});
// Close Pane
$(".tab-pane .close-btn").on("click", function () {
    $(this).parent().removeClass("active");
});

$(".info-item").on("mouseover", function () {
    $(".info-item").removeClass("active");
    $(this).addClass("active");
});
