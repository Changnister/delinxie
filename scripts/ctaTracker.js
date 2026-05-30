(function () {
  function sendCtaEvent(name) {
    try {
      if (window.gtag) {
        gtag("event", "cta_click", {
          event_category: "CTA",
          event_label: name,
          page_location: window.location.pathname,
        });
      }
      if (window.dataLayer && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: "cta_click", cta_name: name });
      }
    } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("a.track-cta").forEach(function (a) {
      a.addEventListener("click", function () {
        var name = a.dataset.cta || "unknown_cta";
        sendCtaEvent(name);
      });
    });
  });
})();
