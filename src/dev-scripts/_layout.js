(function($) {

    var layoutWrapClass = 'layout-wrap',
        imgClass = 'layout-img',
        imgPath = 'layout/layout.jpg',
        btnClass = 'show-layout-btn';

    var layoutWrapStyles = {
        'position': 'absolute',
        'width': '100%',
        'opacity': '.5',
        'top': '0',
        'left': '50%',
        'transform': 'translateX(-50%)',
        ' background-size': 'contain',
        'z-index': '500'
    };

    var imgStyles = {
        'max-width': '100%',
        'display': 'block',
        'margin': '0 auto',
        'outline': '1px solid black'
    };

    var showLayoutBtnStyles = {
        'position': 'fixed',
        'right': '0',
        'top': '150px',
        'padding': '10px 20px',
        'font-size': '20px',
        'color': ' #fff',
        'background-color': '#004a85',
        'z-index': '1000'
    };

    $('body').append(`
       <div class=${layoutWrapClass}>
           <img class=${imgClass} src=${imgPath}>
       </div>
       <button class=${btnClass} >Layout</button>
    `);

    $('.' + layoutWrapClass).css(layoutWrapStyles).hide();
    $('.' + imgClass).css(imgStyles);
    $('.' + btnClass).css(showLayoutBtnStyles).click(function() {
        $('.' + layoutWrapClass).toggle()
    });

})(jQuery);