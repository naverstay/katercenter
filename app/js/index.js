var s, heroDecoration;

$(function ($) {
    heroDecoration = $('.heroDecoration');

    initSkrollr();

});

$(window).on('scroll', function () {

    //checkHero();

});

function checkHero() {
    if (heroDecoration.length) {
        var scrtop = getScrollTop();

        console.log(scrtop, heroDecoration.offset().top);

    }
}

