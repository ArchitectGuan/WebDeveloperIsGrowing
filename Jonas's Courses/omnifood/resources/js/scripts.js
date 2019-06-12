$(document).ready(() => {
    // For sticky nav
    $('.js--section-features').waypoint(function (direction) {
        direction === 'down' ? $('nav').addClass('sticky') : $('nav').removeClass('sticky');
    }, {
            offset: '120px'
        });

    // Scroll effect
    $('.js--scroll-to-plan').click(() => {
        $('html,body').animate({ scrollTop: $('.js--section-plans').offset().top }, 1000);
    });
    $('.js--scroll-to-features').click(() => {
        $('html,body').animate({ scrollTop: $('.js--section-features').offset().top }, 1000);
    });

    // Select all links with hashes
    $('a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });

    $('.js--wp-1').waypoint(function (direction) {
        $('.js--wp-1').addClass('animated fadeIn');
    }, { offset: '50%' });

    $('.js--wp-2').waypoint(function (direction) {
        $('.js--wp-2').addClass('animated fadeInUp');
    }, { offset: '50%' });

    $('.js--wp-3').waypoint(function (direction) {
        $('.js--wp-3').addClass('animated fadeIn');
    }, { offset: '50%' });

    $('.js--wp-4').waypoint(function (direction) {
        $('.js--wp-4').addClass('animated pulse');
    }, { offset: '50%' });

    // Mobile Nav
    $('.mobile-nav-icon').click(() => {
        $('.js--main-nav').slideToggle(200);
        let icon = $('.js--nav-icon i');
        if (icon.hasClass('ion-navicon')) {
            icon.removeClass('ion-navicon');
            icon.addClass('ion-close');
        } else {
            icon.removeClass('ion-close');
            icon.addClass('ion-navicon');
        }
    });


    // All for the map
    var url = 'https://webapi.amap.com/maps?v=1.4.15&key=AIzaSyB9ikPWbIzMnKLBTUMC-k3dddagVUMF3zg&callback=onLoad';
    var jsapi = document.createElement('script');
    jsapi.charset = 'utf-8';
    jsapi.src = url;
    document.head.appendChild(jsapi);
});

// For the map in the form section
window.onLoad = () => {
    
    //为了控制Marker在地图初始化时的位置显示在地图中央附近
    let width = window.innerWidth;
    let coor;
    if (width < 767)
        coor = [113.3864049, 23.0376927];
    else if (width < 1028)
        coor = [113.466047, 23.029700];
    else if (width < 1110)
        coor = [113.486047, 23.029700];
    else
        coor = [113.506047, 23.029700];

    var map = new AMap.Map('map', {
        center: coor,                                                   // x + <- 
        zoom: 12
    });

    var marker = new AMap.Marker({
        position: [113.387876, 23.037911],
        offset: new AMap.Pixel(-12, -12),
        zIndex: 101,
        title: 'Our Guangzhou HQ is here!',
        map: map
    });

}

