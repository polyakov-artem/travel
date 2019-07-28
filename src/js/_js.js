(function($) {

  // intro slider ->
  var introSlider = {
    elem: $('.intro-slider'),
    pluginName: 'slick',
    options: {
      autoplay: true,
      autoplaySpeed: 5000,
      dots: true,
      arrows: false,
      infinite: true,
      speed: 500,
      fade: true,
      cssEase: 'linear'
    }
  }

  var placeSlider = {
    elem: $('.place-slider'),
    pluginName: 'slick',
    options: {
      nextArrow: '<button type="button" class="places__next-btn"><i class="fa fa-chevron-right"></i></button>',
      prevArrow: '<button type="button" class="places__prev-btn"><i class="fa fa-chevron-left"></i></button>',
      dots: false,
      arrows: true,
      infinite: true,
      speed: 500,
      fade: true,
      cssEase: 'linear'
    }
  }
  // <- intro slider

  // fotorama gallery ->
  var gallery = {
    elem: $('.gallery'),
    pluginName: 'fotorama',
    options: {
      nav: 'thumbs',
      maxheight: 385,
      thumbmargin: 8,
      thumbwidth: '138',
      thumbheight: 80,
      thumbborderwidth: 4,
      loop: "true",
      arrows: "true",
      swipe: "true",
      arrows: 'always',
      allowfullscreen: "true"
    }
  };
  // <- fotorama gallery

  // calendar ->
  var $calendar = $('.calendar'),
    $dateInputs = $('#checkIn1, #checkIn2'),
    datepickerOptions = {
      buttonText: "",
      constrainInput: true,
      dateFormat: "d MM yy",
      dayNamesMin: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      defaultDate: new Date(2014, 6, 10),
      duration: 300,
      firstDay: 0,
      gotoCurrent: false,
      hideIfNoPrevNext: false,
      nextText: "",
      prevText: "",
      selectOtherMonths: true,
      showOtherMonths: true,
      showButtonPanel: true,
      showMonthAfterYear: true,
      showOn: "both",
      stepMonths: 1,
      yearRange: '1985:2019',
      onChangeMonthYear: function(year, month, datepicker) {
        return false;
      },
      orientation: "top"
    };
  // <- calendar

  // map ->
  var $map = $('.map');

  function initMap() {
    var coordinates = { lat: -37.806006, lng: 144.961291 }, // Координаты центра карты 
      // markerImg = 'img/marker.png', //  Иконка для маркера  
      // создаем карту и настраеваем 
      map = new google.maps.Map($map[0], {
        center: coordinates,
        zoom: 16, // определяет первоначальный масштаб
        disableDefaultUI: true, // убирает элементы управления
        scrollwheel: false, // отключает масштабирование колесиком мыши (бывает полезно, если карта на всю ширину страницы и перебивает прокрутку вниз).
      });
    // маркер
    var marker = new google.maps.Marker({
      position: coordinates, // координаты маркера 
      map: map, //  ставим маркер в карту с id map
      animation: google.maps.Animation.DROP, // анимация маркера DROP / BOUNCE
      // icon: markerImg,
    });
    // Отцентровка карты при ресайзе
    google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    });
  };
  // <- map

  // nav-scroll ->
  $('.main-nav').on('click', '.main-menu__link', function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') &&
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top - 50
        }, 1000);
        $('.navbar-collapse').collapse('hide');
      }
    }
  });
  // <- nav-scroll

  // up-btn ->
  var $upBtn = $('.up-btn'),
    $window = $(window);

  if ($upBtn.length) {

    checkSroll();
    $window.scroll(checkSroll);

    function checkSroll() {
      if ($window.scrollTop() > $window.height()) {
        $upBtn.addClass('up-btn_is_active');
      } else {
        $upBtn.removeClass('up-btn_is_active');
      }
    }

    $upBtn.click(function() {
      $('body, html').stop().animate({ scrollTop: 0 }, 'slow', 'swing');
      return false;
    });
  };
  // <- up-btn

  // plugins init ->
  if (introSlider.elem.length)
    introSlider.elem[introSlider.pluginName](introSlider.options);

  if (gallery.elem.length) {
    gallery.elem[gallery.pluginName](gallery.options);
    var galleryApi = gallery.elem.data('fotorama');

    $('.s-gallery__next-btn').click(function() {
      galleryApi.show('>')
    });
    $('.s-gallery__prev-btn').click(function() {
      galleryApi.show('<')
    });
  }

  if ($calendar.length) $calendar.datepicker(datepickerOptions);

  if ($dateInputs.length) {
    $dateInputs.each(function() {
      $(this).datepicker(datepickerOptions);
    })
    $('#ui-datepicker-div').addClass('calendar calendar_theme_primary calendar_size_2');
  };

  if ($map.length) google.maps.event.addDomListener(window, 'load', initMap);

  if (placeSlider.elem.length) placeSlider.elem[placeSlider.pluginName](placeSlider.options);
  // <- plugins init

})(jQuery);