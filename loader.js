; (function () {
  window.addEventListener('DOMContentLoaded', function () {
    var loadQueue = [],
      loadCounter = 0,
      animEls = [],
      all = document.all;

    all = Array.prototype.slice.call(all);

    all.forEach(function (el, i, arr) {
      var css = window.getComputedStyle(el);

      for (var rule in css) {
        if (rule == "background-image") {
          var regex = /url\(\"?([^\"\(\)]+)\"?\)/i;
          var matches = regex.exec(css[rule]);

          if (matches && matches[1]) {
            loadQueue.push(matches[1]);
          }
        }

        if (rule == "animation-name" && css[rule] != 'none') {
          animEls.push(el);
          el.style.webkitAnimationName = 'none';
          el.style.msAnimationName = 'none';
          el.style.animationName = 'none';
          el.style.webkitAnimationPlayState = 'paused';
          el.style.msAnimationPlayState = 'paused';
          el.style.animationPlayState = 'paused';
        }
      }

      if (el instanceof HTMLImageElement && el.getAttribute('src')) {
        loadQueue.push(el.getAttribute('src'));
      }
    });

    loadQueue.forEach(function (imgSrc, i, arr) {
      var img = new Image();
      img.onload = function () {
        loadCounter++;

        if (loadCounter == loadQueue.length - 1) {
          var event = document.createEvent('Event');
          event.initEvent('imagesLoaded', true, false);

          window.dispatchEvent(event);
          document.dispatchEvent(event);

          animEls.forEach(function (el, i, arr) {
            el.style.webkitAnimationName = '';
            el.style.msAnimationName = '';
            el.style.animationName = '';

            el.style.webkitAnimationPlayState = '';
            el.style.msAnimationPlayState = '';
            el.style.animationPlayState = '';
          });
        }
      };
      img.src = imgSrc;
    });
  });
})();
