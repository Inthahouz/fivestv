(function ($, window, undefined) {

    'use strict';

    var $burger = $('#burger');
    var $nav = $('#nav');

    $('body')
        .on('click', '#burger', function () {
            $nav.toggleClass('is-open');
            $burger.toggleClass('is-open');
        });


})(jQuery, window);