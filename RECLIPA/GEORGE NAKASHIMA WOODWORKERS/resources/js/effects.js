$(document).ready(() => {
    // Top main nav hover effects
    $('.js--light-toggler').hover(() => {
        layer = $('.layer');
        if (!layer.length) {
            layer = document.createElement('div');
            layer.setAttribute('class', 'layer');
            $('header').append(layer);
            console.log('I run once...');
        }
        $('.layer').animate({ opacity: 0.5 }, 200);
    }, () => {
        $('.layer').animate({ opacity: 0 }, 200);
    });
});