var body, html, doc, wnd,
    closeMenuTimer,
    boardGrid,
    callback_popup,
    auth_popup,
    fail_popup,
    success_popup,
    quick_search_popup,
    add2cart_popup,
    recovery_popup;

$(function ($) {

    body = $('body');
    html = $('html');

    body.delegate('.openMobMenu', 'click', function () {
        if (html.hasClass('menu_opened')) {
            html.removeClass('menu_opened').css('margin-right', '');
            $('.callback_block').addClass('_invis');
            setTimeout(function () {
                $('.callback_block').removeClass('_invis');
            }, 200);
        } else {
            html.addClass('menu_opened').css('margin-right', getScrollbarWidth());
        }

        initBoard();

        return false;

    }).delegate('.openFav', 'click', function () {

        body.toggleClass('fav_opened');
        return false;

    }).delegate('.toggleOneClick', 'click', function () {

        $('.oneClickForm').toggle();
        return false;

    }).delegate('.favBtn', 'click', function () {
        $(this).toggleClass('favorite');
        return false;
    });

    loadImages();

    initMask();

    initBoard();

    initBS();

    initStick();

    initInputFillChecker();

    initCallbackPopup();

    initAuthPopup();

    initRecoveryPopup();

    initFailPopup();

    initSuccessPopup();

    initAddToCartPopup();

    initQuickSearchPopup();

    initTabs();

    initAsideSubmenu();

    initSelect2();

    all_dialog_close();

});

function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}

function initBoard() {
    if ((boardGrid && boardGrid.length && boardGrid.data() && boardGrid.data('isotope'))) {
        setTimeout(function () {
            boardGrid.isotope('layout');
        }, 20);
    } else if ($('.boardGrid').length) {
        boardGrid = $('.boardGrid').isotope({
            percentPosition: true,
            gutter: 0,
            // main isotope options
            itemSelector: '.gridItem',
            // set layoutMode
            layoutMode: 'packery'
        });
    }
}

function loadImages() {
    $('.imgLoad').each(function (ind) {
        var img = $(this);

        img.imagesLoaded()
            .always(function (instance) {
                console.log(img.addClass('_loaded'));
            })
            .done(function (instance) {

            })
            .fail(function () {

            })
            .progress(function (instance, image) {
            });
    });
}

function initMask() {
    $("input").filter(function (i, el) {
        return $(el).attr('data-inputmask') != void 0;
    }).inputmask();
}

function initBS() {
    $('.bs').each(function (ind) {
        var bs = $(this);
        bs.addClass('_backstretched').backstretch(bs.find('img').attr('src'));
    });
}

function initStick() {

    $('.sticky').on('sticky_kit:stick', function (e) {
        $(this).addClass('_top');
    }).on('sticky_kit:unstick', function (e) {
        $(this).removeClass('_top');
    }).on('sticky_kit:bottom', function (e) {
        $('.header').addClass('_wide');
        $(this).addClass('_bottom');
    }).on('sticky_kit:unbottom', function (e) {
        $('.header').removeClass('_wide');
        $(this).removeClass('_bottom');
    }).each(function (ind) {
        var stck = $(this);

        stck.css('padding-top', stck.attr('data-margin-top') + 'px').stick_in_parent({
            sticky_class: stck.attr('data-sticky-class')
        });
    });
}

function initInputFillChecker() {
    $('input').on('change keyup blur', function () {
        var inp = $(this);

        if ('text' == inp[0].type && 'required' == inp.attr('required')) {
            inp.toggleClass('empty', inp.val() == 0);
        }
    });
}

function initQuickSearchPopup() {

    quick_search_popup = $('#quick_search_popup').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'no_close_mod no_title dialog_fixed',
        //appendTo: '.wrapper',
        width: '100%',
        draggable: true,
        collision: "fit",
        position: {my: "top center", at: "top center", of: window},
        open: function (event, ui) {
            body.addClass('modal_opened overlay_v2');
        },
        close: function (event, ui) {
            body.removeClass('modal_opened overlay_v2');
        }
    });

    $('.quickSearchBtn').on('click', function () {

        quick_search_popup.dialog('open');

        return false;
    });

}

function initAddToCartPopup() {

    add2cart_popup = $('#add2cart_popup').dialog({
        autoOpen: false,
        modal: false,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'no_close_on_dt dialog_close_butt_mod_1 dialog_g_size_3 mob_dialog_fixed',
        //appendTo: '.wrapper',
        width: 430,
        draggable: true,
        collision: "fit",
        position: {
            my: "right-5 top+15",
            at: "right bottom",
            of: $('.cartLink')
        },
        open: function (event, ui) {
            //body.addClass('modal_opened overlay_v2');
        },
        close: function (event, ui) {
            //body.removeClass('modal_opened overlay_v2');
        }
    });

    $('.addToCart').on('click', function () {

        add2cart_popup.dialog('open');

        setTimeout(function () {
            add2cart_popup.dialog('close');
        }, 3000);

        return false;
    });

}

function initCallbackPopup() {

    callback_popup = $('#callback_popup').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'no_close_mod dialog_g_size_1',
        //appendTo: '.wrapper',
        width: 300,
        draggable: true,
        collision: "fit",
        position: {my: "top center", at: "top center", of: window},
        open: function (event, ui) {
            body.addClass('modal_opened overlay_v2');
        },
        close: function (event, ui) {
            body.removeClass('modal_opened overlay_v2');
        }
    });

    $('.callbackBtn').on('click', function () {

        callback_popup.dialog('open');

        return false;
    });

}

function initAuthPopup() {

    auth_popup = $('#auth_popup').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'no_close_mod dialog_g_size_1',
        //appendTo: '.wrapper',
        width: 462,
        draggable: true,
        collision: "fit",
        position: {my: "top center", at: "top center", of: window},
        open: function (event, ui) {
            body.addClass('modal_opened overlay_v2');
        },
        close: function (event, ui) {
            body.removeClass('modal_opened overlay_v2');
        }
    });

    $('.authBtn').on('click', function () {

        auth_popup.dialog('open');

        return false;
    });

}

function initFailPopup() {

    fail_popup = $('#fail_popup').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'no_close_mod dialog_g_size_1',
        //appendTo: '.wrapper',
        width: 462,
        draggable: true,
        collision: "fit",
        position: {my: "top center", at: "top center", of: window},
        open: function (event, ui) {
            body.addClass('modal_opened overlay_v2');
        },
        close: function (event, ui) {
            body.removeClass('modal_opened overlay_v2');
        }
    });

    $('.openFailPopup').on('click', function () {

        fail_popup.dialog('open');

        return false;
    });

}

function initSuccessPopup() {

    success_popup = $('#success_popup').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'no_close_mod dialog_g_size_1',
        //appendTo: '.wrapper',
        width: 462,
        draggable: true,
        collision: "fit",
        position: {my: "top center", at: "top center", of: window},
        open: function (event, ui) {
            body.addClass('modal_opened overlay_v2');
        },
        close: function (event, ui) {
            body.removeClass('modal_opened overlay_v2');
        }
    });

    $('.openSuccessPopup').on('click', function () {

        success_popup.dialog('open');

        return false;
    });

}

function initRecoveryPopup() {

    recovery_popup = $('#recovery_popup').dialog({
        autoOpen: false,
        modal: true,
        closeOnEscape: true,
        closeText: '',
        dialogClass: 'no_close_mod dialog_g_size_1',
        //appendTo: '.wrapper',
        width: 462,
        draggable: true,
        collision: "fit",
        position: {my: "top center", at: "top center", of: window},
        open: function (event, ui) {
            body.addClass('modal_opened overlay_v2');
        },
        close: function (event, ui) {
            body.removeClass('modal_opened overlay_v2');
        }
    });

    $('.passRecoveryBtn').on('click', function () {
        auth_popup.dialog('close');

        recovery_popup.dialog('open');

        return false;
    });

}

function initAsideSubmenu() {

    $('body').delegate('.menuItem', 'mouseenter ', function (e) {
        $(this).addClass('hovered just_hovered');
    }).delegate('.menuItem', 'mouseleave', function (e) {
        $(this).removeClass('hovered just_hovered');
    }).delegate('.menuItem', 'click', function (e) {

        var el = $(this);

        if (el.hasClass('just_hovered')) {
            el.removeClass('just_hovered');
        } else {
            el.toggleClass('hovered');
        }
    });

}

function initTabs() {

    $('.tabBlock').each(function (ind) {
        var tab = $(this);

        tab.tabs({
            active: 0,
            tabContext: tab.attr('data-tab-context'),
            activate: function (e, u) {

            }
        });
    });
}

function initSelect2() {

    $('.select2').each(function (ind) {
        var slct = $(this);

        slct.select2({
            minimumResultsForSearch: Infinity,
            dropdownParent: slct.parent(),
            width: '100%'
        });
    });
}

function all_dialog_close() {
    body.on('click', '.ui-widget-overlay, .popupClose', all_dialog_close_gl);
}

function all_dialog_close_gl() {
    $(".ui-dialog-content").each(function () {
        var $this = $(this);
        if (!$this.parent().hasClass('always_open')) {
            $this.dialog("close");
        }
    });
}
