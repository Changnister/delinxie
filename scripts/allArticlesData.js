(function (global) {
  var ALL = []
    .concat(global.WRITING_ARTICLES || [])
    .concat(global.RESEARCH_ARTICLES || [])
    .concat(global.FEATURES_ARTICLES || [])
    .concat(global.CREATIVE_ARTICLES || []);

  ALL.sort(function (x, y) {
    return new Date(y.date) - new Date(x.date);
  });

  global.ALL_ARTICLES = ALL;
})(window);
