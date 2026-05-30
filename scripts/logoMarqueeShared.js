(function (global) {
  function buildLogoFragment(logos) {
    var frag = document.createDocumentFragment();
    logos.forEach(function (item) {
      var img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt || item.src.split("/").pop().replace(/[-_.]/g, " ");
      img.className = "logo-img";
      img.loading = "eager";
      frag.appendChild(img);
    });
    return frag;
  }

  function calculateSequenceWidth(images, gap) {
    var measuredWidth =
      images.reduce(function (sum, img) {
        return sum + img.getBoundingClientRect().width;
      }, 0) +
      gap * (images.length - 1);

    if (measuredWidth > 10) {
      return measuredWidth;
    }

    var fallbackWidth =
      ((images[0] && parseFloat(getComputedStyle(images[0]).width)) || 140) *
        images.length +
      gap * (images.length - 1);

    return fallbackWidth > 10 ? fallbackWidth : measuredWidth;
  }

  global.initLogoMarquee = function (options) {
    var opts = options || {};
    var elementId = opts.elementId;
    var logos = Array.isArray(opts.logos) ? opts.logos : [];
    var gap = typeof opts.gap === "number" ? opts.gap : 28;
    var baseSeconds =
      typeof opts.baseSeconds === "number" ? opts.baseSeconds : 30;
    var minSeconds = typeof opts.minSeconds === "number" ? opts.minSeconds : 18;
    var maxSeconds = typeof opts.maxSeconds === "number" ? opts.maxSeconds : 80;
    var mobileMaxWidth =
      typeof opts.mobileMaxWidth === "number" ? opts.mobileMaxWidth : 700;

    if (!elementId || logos.length === 0) {
      return;
    }

    var el = document.getElementById(elementId);
    if (!el) {
      return;
    }

    var mobileMedia = window.matchMedia(
      "(max-width: " + mobileMaxWidth + "px)",
    );
    var inView = false;

    function isMobileSwipeMode() {
      return !!mobileMedia.matches;
    }

    function applyPlayback() {
      var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      var manualSwipe = isMobileSwipeMode();
      var disableAnimation = reduceMotion.matches || manualSwipe;

      if (disableAnimation) {
        el.style.animation = "none";
        el.style.animationPlayState = "paused";
        return;
      }

      el.style.animation = "";
      var shouldRun = inView && !document.hidden;
      el.style.animationPlayState = shouldRun ? "running" : "paused";
    }

    function setupPlaybackControls() {
      inView = false;

      if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(
          function (entries) {
            var entry = entries && entries[0];
            inView = !!(entry && entry.isIntersecting);
            applyPlayback();
          },
          { threshold: 0.15 },
        );

        observer.observe(el);
      } else {
        inView = true;
      }

      document.addEventListener("visibilitychange", function () {
        applyPlayback();
      });

      if (typeof mobileMedia.addEventListener === "function") {
        mobileMedia.addEventListener("change", applyPlayback);
      } else if (typeof mobileMedia.addListener === "function") {
        mobileMedia.addListener(applyPlayback);
      }

      applyPlayback();
    }

    function setupMarquee() {
      var imgs = Array.prototype.slice.call(el.querySelectorAll("img"));
      if (imgs.length === 0) {
        return;
      }

      var firstSequence = imgs.slice(0, logos.length);
      var loaded = firstSequence.every(function (img) {
        return img.complete || img.naturalWidth;
      });

      if (!loaded) {
        setTimeout(setupMarquee, 80);
        return;
      }

      var sequenceWidth = calculateSequenceWidth(firstSequence, gap);

      el.appendChild(buildLogoFragment(logos));
      el.style.setProperty("--one-seq", Math.round(sequenceWidth) + "px");
      el.style.setProperty(
        "--translate",
        "-" + Math.round(sequenceWidth) + "px",
      );

      var duration = Math.max(
        minSeconds,
        Math.min(maxSeconds, Math.round((sequenceWidth / 1000) * baseSeconds)),
      );
      el.style.setProperty("--marquee-duration", duration + "s");

      setupPlaybackControls();
    }

    el.appendChild(buildLogoFragment(logos));
    setTimeout(setupMarquee, 120);
  };

  global.initLogoMarqueeOnReady = function (options) {
    function init() {
      if (typeof global.initLogoMarquee !== "function") return;
      global.initLogoMarquee(options);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init, { once: true });
      return;
    }

    init();
  };
})(window);
