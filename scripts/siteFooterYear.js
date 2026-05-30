(function () {
  var year = String(new Date().getFullYear());
  var targets = document.querySelectorAll(".footer-year");
  targets.forEach(function (el) {
    el.textContent = year;
  });
})();
