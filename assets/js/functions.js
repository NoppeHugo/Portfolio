// @codekit-prepend "/vendor/hammer-2.0.8.js";

$(document).ready(function () {
  // Portfolio Modal
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', () => {
      const modalId = item.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('show');
        document.body.classList.add('modal-open'); // ✅ Empêche scroll page
      }
    });
  });

  document.querySelectorAll('.portfolio-modal .close').forEach(close => {
    close.addEventListener('click', () => {
      const modal = close.closest('.portfolio-modal');
      modal.classList.remove('show');
      document.body.classList.remove('modal-open'); // ✅ Restaure scroll page
    });
  });

  window.addEventListener('click', e => {
    if (e.target.classList.contains('portfolio-modal')) {
      e.target.classList.remove('show');
      document.body.classList.remove('modal-open'); // ✅ Restaure scroll page
    }
  });

  // DOMMouseScroll included for firefox support
  var canScroll = true,
    scrollController = null;
  $(this).on('mousewheel DOMMouseScroll', function (e) {
    if ($('body').hasClass('modal-open')) return; // ✅ Empêche navigation en scroll si modale ouverte
    if (!($('.outer-nav').hasClass('is-vis'))) {
      e.preventDefault();
      var delta = (e.originalEvent.wheelDelta) ? -e.originalEvent.wheelDelta : e.originalEvent.detail * 20;
      if (delta > 50 && canScroll) {
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function () {
          canScroll = true;
        }, 800);
        updateHelper(1);
      } else if (delta < -50 && canScroll) {
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function () {
          canScroll = true;
        }, 800);
        updateHelper(-1);
      }
    }
  });

  $('.side-nav li, .outer-nav li').click(function () {
    if (!($(this).hasClass('is-active'))) {
      var $this = $(this),
        curActive = $this.parent().find('.is-active'),
        curPos = $this.parent().children().index(curActive),
        nextPos = $this.parent().children().index($this),
        lastItem = $(this).parent().children().length - 1;

      updateNavs(nextPos);
      updateContent(curPos, nextPos, lastItem);
    }
  });

  $('.cta').click(function () {
    var curActive = $('.side-nav').find('.is-active'),
      curPos = $('.side-nav').children().index(curActive),
      lastItem = $('.side-nav').children().length - 1,
      nextPos = lastItem;

    updateNavs(lastItem);
    updateContent(curPos, nextPos, lastItem);
  });

  var targetElement = document.getElementById('viewport'),
    mc = new Hammer(targetElement);
  mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
  mc.on('swipeup swipedown', function (e) {
    if ($('body').hasClass('modal-open')) return; // ✅ bloque swipe si modale ouverte
    updateHelper(e);
  });

  $(document).keyup(function (e) {
    if (!($('.outer-nav').hasClass('is-vis')) && !$('body').hasClass('modal-open')) {
      e.preventDefault();
      updateHelper(e);
    }
  });

  function updateHelper(param) {
    var curActive = $('.side-nav').find('.is-active'),
      curPos = $('.side-nav').children().index(curActive),
      lastItem = $('.side-nav').children().length - 1,
      nextPos = 0;

    if (param.type === "swipeup" || param.keyCode === 40 || param > 0) {
      if (curPos !== lastItem) {
        nextPos = curPos + 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      } else {
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    } else if (param.type === "swipedown" || param.keyCode === 38 || param < 0) {
      if (curPos !== 0) {
        nextPos = curPos - 1;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      } else {
        nextPos = lastItem;
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem);
      }
    }
  }

  function updateNavs(nextPos) {
    $('.side-nav, .outer-nav').children().removeClass('is-active');
    $('.side-nav').children().eq(nextPos).addClass('is-active');
    $('.outer-nav').children().eq(nextPos).addClass('is-active');
  }

  function updateContent(curPos, nextPos, lastItem) {
    $('.main-content').children().removeClass('section--is-active');
    $('.main-content').children().eq(nextPos).addClass('section--is-active');
    $('.main-content .section').children().removeClass('section--next section--prev');

    if (curPos === lastItem && nextPos === 0 || curPos === 0 && nextPos === lastItem) {
      $('.main-content .section').children().removeClass('section--next section--prev');
    } else if (curPos < nextPos) {
      $('.main-content').children().eq(curPos).children().addClass('section--next');
    } else {
      $('.main-content').children().eq(curPos).children().addClass('section--prev');
    }

    if (nextPos !== 0 && nextPos !== lastItem) {
      $('.header--cta').addClass('is-active');
    } else {
      $('.header--cta').removeClass('is-active');
    }
  }

  function outerNav() {
    $('.header--nav-toggle').click(function () {
      $('.perspective').addClass('perspective--modalview');
      setTimeout(function () {
        $('.perspective').addClass('effect-rotate-left--animate');
      }, 25);
      $('.outer-nav, .outer-nav li, .outer-nav--return').addClass('is-vis');
    });

    $('.outer-nav--return, .outer-nav li').click(function () {
      $('.perspective').removeClass('effect-rotate-left--animate');
      setTimeout(function () {
        $('.perspective').removeClass('perspective--modalview');
      }, 400);
      $('.outer-nav, .outer-nav li, .outer-nav--return').removeClass('is-vis');
    });
  }

  function workSlider() {
    const items = document.querySelectorAll('.slider--item');
    let currentIndex = 1;

    function updateClasses() {
      items.forEach((item, index) => {
        item.classList.remove('slider--item-left', 'slider--item-center', 'slider--item-right');
        if (index === currentIndex) {
          item.classList.add('slider--item-center');
        } else if (index === (currentIndex - 1 + items.length) % items.length) {
          item.classList.add('slider--item-left');
        } else if (index === (currentIndex + 1) % items.length) {
          item.classList.add('slider--item-right');
        }
      });
    }

    document.querySelector('.slider--next').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % items.length;
      updateClasses();
    });

    document.querySelector('.slider--prev').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateClasses();
    });

    updateClasses();
  }

  function transitionLabels() {
    $('.work-request--information input').focusout(function () {
      var textVal = $(this).val();
      if (textVal === "") {
        $(this).removeClass('has-value');
      } else {
        $(this).addClass('has-value');
      }
      window.scrollTo(0, 0);
    });
  }

  outerNav();
  workSlider();
  transitionLabels();
});
