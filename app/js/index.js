var s, heroDecoration;

$(function ($) {
    heroDecoration = $('.heroDecoration');

    //initSkrollr();

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

function destroySkrollr() {
    if (s) {
        var elements = $('.skrollable');
        s.destroy();
        elements.removeAttr('style');
    }
}

function mobileCheck() {
    return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera) || (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function initSkrollr() {
    var $window = $(window);

    if ($window.width() > 980) {
        var scrollTime = .1;			//Scroll time
        var scrollDistance = 50;		//Distance. Use smaller value for shorter scroll and greater value for longer scroll

        if (mobileCheck()) {
            destroySkrollr();
        } else {
            s = skrollr.init({
                forceHeight: false,
                //scale: .6,
                mobileCheck: false,
                //skrollrBody: 'scroll-content',
                //edgeStrategy: 'reset',
                easing: 'easeOutQuad'
            });
        }
    } else {
        destroySkrollr();
    }
}
