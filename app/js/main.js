var body, html, doc, wnd,
    closeMenuTimer,
    boardGrid;

$(function ($) {

    body = $('body');
    html = $('html');

    $(document).on('click', function (e) {
        if (!($(e.target).hasClass('multiPicker') || $(e.target).closest('.multiPicker').length)) {
            $('.multiPicker').removeClass('_opened');
            body.removeClass('_slider_opened');
        }
    });

    body.delegate('.openMobMenu', 'click', function () {
        if (!(body.hasClass('_slider_opened') || body.hasClass('_popup_opened'))) {
            if (html.hasClass('_menu_opened')) {
                html.removeClass('_menu_opened').css('margin-right', '');
                $('.callback_block').addClass('_invis');
                setTimeout(function () {
                    $('.callback_block').removeClass('_invis');
                }, 200);
            } else {
                html.addClass('_menu_opened').css('margin-right', getScrollbarWidth());
            }
        }

        $('.fancybox-close-small').click();

        body.removeClass('_slider_opened');

        $('.multiPicker').removeClass('_opened');

        initBoard();

        return false;

    }).delegate('.tabCloseLink', 'click', function () {
        var btn = $(this);

        btn.closest('.tabContainer').removeClass('_tab_switched');

        return false;
    }).delegate('.categoryBtn', 'click', function () {
        var btn = $(this);

        btn.closest('.tabContainer').addClass('_open_tabs');

        return false;
    }).delegate('.closeCategoryBtn', 'click', function () {
        var btn = $(this);

        btn.closest('.tabContainer').removeClass('_open_tabs');

        return false;
    }).delegate('.filterRmBtn', 'click', function () {
        var btn = $(this), rslts = btn.closest('.multiPickerResults');

        btn.closest('.filter_item').remove();

        rslts.closest('.multiPicker').removeClass('_opened').toggleClass('_not_empty', !!rslts.find('li').length);

        body.removeClass('_slider_opened');

        return false;
    }).delegate('.multiPickerLabel, .multiPickerResults', 'click', function () {
        var pckr = $(this).closest('.multiPicker');

        $('.multiPicker').not(pckr).removeClass('_opened');

        pckr.toggleClass('_opened');

        body.addClass('_slider_opened');

        return false;
    }).delegate('.multiPickerBtn', 'click', function () {
        var pckr_btn = $(this),
            pckr = pckr_btn.closest('.multiPicker'),
            sldr = pckr.find('.filterToddler'),
            format = sldr.attr('data-format') || '',
            rslts = pckr.find('.multiPickerResults'),
            limit = pckr.attr('data-limit') || 0,
            val = sldr[0].noUiSlider.get();

        if (limit) {
            do
                pckr.find('.multiPickerResults li').last().remove();
            while (pckr.find('.multiPickerResults li').length >= limit)
        }

        rslts.append('<li class="filter_item" title="Металл"><span class="filter_remove filterRmBtn">×</span>' +
            (format ? ('money' === format ? parseMoney(val[0].toString(), 1) : parseInt(val[0])) : parseInt(val[0])) + ' – ' +
            (format ? ('money' === format ? parseMoney(val[1].toString(), 1) : parseInt(val[1])) : parseInt(val[1])) +
            '</li>');

        pckr.addClass('_not_empty').removeClass('_opened');

        body.removeClass('_slider_opened');

        return false;
    });

    loadImages();

    initThanksPopup();

    initMask();

    initBoard();

    initBS();

    initStick();

    initTabs();

    initToddlers();

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

function initThanksPopup() {
    //var thanks_modal = $("#thanks_modal").fancybox({
    //    maxWidth: 800,
    //    maxHeight: 600,
    //    fitToView: false,
    //    width: '70%',
    //    height: '70%',
    //    autoSize: false,
    //    closeClick: false,
    //    openEffect: 'none',
    //    closeEffect: 'none',
    //    afterLoad: function () {
    //
    //    }
    //});


    //$('.openThanksPopup').on('click', function () {
    //
    //    $.fancybox.open($("#thanks_modal"), {
    //        helpers: {
    //            overlay: {
    //                locked: false
    //            }
    //        }
    //    });
    //
    //    return false;
    //});


    $.fancyConfirm = function (opts) {
        opts = $.extend(true, {
            title: 'Are you sure?',
            message: '',
            okButton: 'OK',
            noButton: 'Cancel',
            callback: $.noop
        }, opts || {});

        $.fancybox.open({
            type: 'html',
            src:
            '<div class="fc-content">' +
            '<div class="popup_decor">' +
            '<div class="pop_decor _dec-bird-1"><img src="./images/decor_bird.svg"/></div>' +
            '<div class="pop_decor _dec-bird-2"><img src="./images/decor_bird.svg"/></div>' +
            '<div class="pop_decor _dec-wave-2"><img src="./images/decor_wave_2.svg"/></div>' +
            '</div>' +
            '<div class="popup_inner">' +
            '<h3 class="popup_title">' + opts.title + '</h3>' +
            '<p class="popup_text">' + opts.message + '</p>' +
            '<div class="popup_controls">' +
            '<a data-value="0" href="javascript:return:false;" class="btn_v2 popup_btn btn_blue" data-fancybox-close>' + opts.noButton + '</a>' +
            (opts.okButton ? '<button data-value="1" data-fancybox-close class="btn btn_v2 popup_btn btn_blue">' + opts.okButton + '</button>' : '') +
            '</div>' +
            '</div>' +
            '</div>',
            opts: {
                animationDuration: 350,
                animationEffect: 'material',
                //modal: true,
                helpers: {
                    overlay: {
                        locked: false
                    }
                },
                baseTpl:
                '<div class="fancybox-container fc-container fancybox-container-v1" role="dialog" tabindex="-1">' +
                '<div class="fancybox-bg"></div>' +
                '<div class="fancybox-inner">' +
                '<div class="fancybox-stage"></div>' +
                '</div>' +
                '</div>',
                beforeShow: function () {
                    body.addClass('_popup_opened');
                },
                afterClose: function (instance, current, e) {
                    body.removeClass('_popup_opened');

                    var button = e ? e.target || e.currentTarget : null;
                    var value = button ? $(button).data('value') : 0;

                    opts.callback(value);
                }
            }
        });
    };

    $(".openThanksPopup").on('click', function (e) {
        e.preventDefault();

        // Open customized confirmation dialog window
        $.fancyConfirm({
            title: 'Спасибо!',
            message: 'Ваша заявка отправлена.',
            okButton: false,
            noButton: 'Закрыть',
            helpers: {
                overlay: {
                    locked: false
                }
            },
            callback: function (value) {
                if (value) {
                    console.log("Let's do this!", value);

                } else {
                    console.log("Maybe later.", value);
                }

                return false;
            }
        });

        return false;
    });

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
                img.addClass('_loaded');
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
        $('.header').addClass('_wide');
        $(this).addClass('_top');
    }).on('sticky_kit:unstick', function (e) {
        $('.header').removeClass('_wide');
        $(this).removeClass('_top');
    }).on('sticky_kit:bottom', function (e) {
        $(this).addClass('_bottom');
    }).on('sticky_kit:unbottom', function (e) {
        $(this).removeClass('_bottom');
    }).each(function (ind) {
        var stck = $(this);

        stck.css('padding-top', stck.attr('data-margin-top') + 'px').stick_in_parent({
            sticky_class: stck.attr('data-sticky-class')
        });
    });
}

function initTabs() {

    $('.tabContainer').each(function (ind) {
        var tabs = $(this);

        tabs.bind('easytabs:before', function (event, link, panel) {
            var func = $(this).attr('data-mob-event');

            if (func in window) {
                window[func](event, link, panel, $(this));
            }
        }).easytabs({
            animationSpeed: 0,
            tabs: '.tabControls>li'
        });
    });
}

function mobTabSwitcher(event, link, panel, tabHolder) {
    tabHolder.addClass('_tab_switched');

    console.log(tabHolder, link);
    console.log(event);
    console.log(panel);
}

function initToddlers() {
    var canUpdate = true;

    $('.filterToddler').each(function (ind) {
        var tdlr = $(this),
            plural = tdlr.attr('data-plural'),
            plural_text = tdlr.attr('data-plural-text') || '',
            format = tdlr.attr('data-format') || '',
            plural_1 = '',
            plural_2 = '',
            suffix_1 = tdlr.attr('data-suffix_1') || '',
            suffix_2 = tdlr.attr('data-suffix_2') || '',
            arr = [],
            filter = tdlr.closest('.multiPickerPopup'),
            single = tdlr.attr('data-single'),
            min = parseInt(tdlr.attr('data-min')) || 0,
            max = parseInt(tdlr.attr('data-max')) || 10,
            val_1 = min,
            val_2 = max;

        if (single) {
            noUiSlider.create(this, {
                start: min + Math.floor((max - min) * .5),
                connect: [true, false],
                range: {
                    'min': min,
                    'max': max
                }
            });
        } else {
            noUiSlider.create(this, {
                start: [min + Math.floor((max - min) * .2), min + Math.floor((max - min) * .8)],
                connect: true,
                range: {
                    'min': min,
                    'max': max
                }
            });
        }

        if (plural !== void 0) {
            arr = plural.split(',');
            plural_1 = plural.length > 0 ? getPural(val_1, arr[0], arr[1], arr[2]) : '';
            plural_2 = plural.length > 0 ? getPural(val_2, arr[0], arr[1], arr[2]) : '';

        } else if (plural_text.length) {
            plural_1 = plural_2 = plural_text;
        }

        filter.find('.min').html(
            (format ? ('money' === format ? parseMoney(val_1.toString()) : suffix_1) : suffix_1)
        );

        filter.find('.max').html(
            (format ? ('money' === format ? parseMoney(val_2.toString()) : suffix_2) : suffix_2)
        );

        filter.find('.toddlerVal').text(min + ' – ' + max);

        this.noUiSlider.on('update', function (values, handle) {
            var target = $(this.target),
                filter = target.closest('.multiPickerPopup'),
                plural = target.attr('data-plural'),
                plural_text = target.attr('data-plural-text') || '',
                format = target.attr('data-format') || '',
                suffix = target.attr('data-suffix') || '',
                suffix_1 = target.attr('data-suffix_1') || '',
                suffix_2 = target.attr('data-suffix_2') || '',
                val_1 = parseInt(values[0]),
                val_2 = parseInt(values[1]),
                plural_suffix_1 = target.attr('data-plural-suffix_1') || false,
                plural_suffix_2 = target.attr('data-plural-suffix_2') || false,
                plural_1 = '',
                plural_2 = '',
                arr = [];

            //if (plural !== void 0) {
            //    arr = plural.split(',');
            //    plural_1 = plural.length > 0 ? getPural(val_1, arr[0], arr[1], arr[2]) : '';
            //    plural_2 = plural.length > 0 ? getPural(val_2, arr[0], arr[1], arr[2]) : '';
            //
            //} else if (plural_text.length) {
            //    plural_1 = plural_2 = plural_text;
            //}

            filter.find('.toddlerVal').text(
                (format ? ('money' === format ? parseMoney(val_1.toString(), 1) : val_1) : val_1 + plural_text) + ' – ' +
                (format ? ('money' === format ? parseMoney(val_2.toString(), 1) : val_2) : val_2 + plural_text));

            //if (canUpdate) {
            //    resize(filter.find('.start .val').val(
            //        (format ? ('money' == format ? moneyFormat(val_1.toString()) : val_1) : val_1) +
            //        suffix_1 + (plural_suffix_1 ? getPural(val_1, arr[0], arr[1], arr[2]) : '')
            //    ));
            //
            //    resize(filter.find('.end .val').val(
            //        (format ? ('money' == format ? moneyFormat(val_2.toString()) : val_2) : val_2) +
            //        suffix_2 + (plural_suffix_2 ? getPural(val_2, arr[0], arr[1], arr[2]) : '')
            //    ));
            //}

        });

        //filter.find('.start input.val').on('keyup keypress change update', function () {
        //    canUpdate = false;
        //    tdlr[0].noUiSlider.set([toNum($(this).val()), null]);
        //}).on('blur', function () {
        //    canUpdate = true;
        //    tdlr[0].noUiSlider.set([toNum($(this).val()), null]);
        //});
        //
        //filter.find('.end input.val').on('keyup keypress change update', function () {
        //    canUpdate = false;
        //    tdlr[0].noUiSlider.set([null, toNum($(this).val())]);
        //}).on('blur', function () {
        //    canUpdate = true;
        //    tdlr[0].noUiSlider.set([null, toNum($(this).val())]);
        //});

        //filter.find('.toddlerSelect').each(function (ind) {
        //    var slct = $(this), target = filter.find(slct.attr('data-target'));
        //
        //    slct.on('change', function (e) {
        //        var _this = $(this);
        //        canUpdate = true;
        //
        //        if (_this.attr('data-target') == '.start') {
        //            tdlr[0].noUiSlider.set([_this.val(), null]);
        //        } else if ($(this).attr('data-target') == '.end') {
        //            tdlr[0].noUiSlider.set([null, _this.val()]);
        //        }
        //
        //    }).select2({
        //        minimumResultsForSearch: Infinity,
        //        dropdownParent: target,
        //        width: '100%',
        //        language: {
        //            noResults: function (e, r) {
        //                return 'Нет результатов';
        //                // return "Город не найден. <a href='#' class='gl_link _clr_turqoise'>Список городов</a>";
        //            }
        //        },
        //        templateResult: function (data) {
        //            return $.isNumeric(data.text) ? numFormat(data.text) : data.text;
        //        },
        //        escapeMarkup: function (markup) {
        //            return markup;
        //        },
        //        adaptDropdownCssClass: function () {
        //            return slct.attr('data-dropdown-class');
        //        }
        //    });
        //
        //    target.on('click', function () {
        //        slct.select2('open');
        //        return false;
        //    });
        //});

    });
}

function parseMoney(money, fix) {
    var m = money, l = '';

    if ((money / 1000000) >= 1) {
        m = (money / 1000000).toFixed(fix || 0);
        l = 'м';
    } else if ((money / 1000) >= 1) {
        m = (money / 1000).toFixed(fix || 0);
        l = 'к';
    }

    return m + l;
}

function initSelect2() {
    $.fn.select2.amd.define('select2/i18n/ru', [], function () {
        // Russian
        return {
            errorLoading: function () {
                return 'Результат не может быть загружен.';
            },
            inputTooLong: function (args) {
                var overChars = args.input.length - args.maximum;
                return 'Пожалуйста, удалите ' + overChars + ' символ' + getPural(overChars, '', 'а', 'ов');
            },
            inputTooShort: function (args) {
                var remainingChars = args.minimum - args.input.length;

                return 'Пожалуйста, введите ' + remainingChars + ' или более символов';
            },
            loadingMore: function () {
                return 'Загружаем ещё ресурсы…';
            },
            maximumSelected: function (args) {
                return 'Вы можете выбрать ' + args.maximum + ' элемент' + getPural(args.maximum, '', 'а', 'ов').trim();
            },
            noResults: function () {
                return 'Ничего не найдено';
            },
            searching: function () {
                return 'Поиск…';
            }
        };
    });

    $('.select2').each(function (ind) {
        var slct = $(this);

        slct.on('select2:open', function () {
            $('.multiPicker').removeClass('_opened');
            body.removeClass('_slider_opened');
        }).select2({
            minimumResultsForSearch: Infinity,
            dropdownParent: slct.parent(),
            width: '100%'
        });
    });
}

function getPural(n, str1, str2, str5) {
    return ' ' + ((((n % 10) == 1) && ((n % 100) != 11)) ? (str1) : (((((n % 10) >= 2) && ((n % 10) <= 4)) && (((n % 100) < 10) || ((n % 100) >= 20))) ? (str2) : (str5)))
}

function moneyFormat(str) {
    return (str + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
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

function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function mobileCheck() {
    return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera) || (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}

$(window).on('scroll', function () {

});
