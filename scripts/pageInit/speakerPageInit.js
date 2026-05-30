window.initStandardArticlesPage({
  fallbackImage: "Images/Writingcover.jpg",
  searchFields: ["title", "authors", "journal"],
  journalNormalize: "commas-bullets",
  tagsPlacement: "under-title",
  showCourse: true,
  enableLightbox: true,
  formatDate: function (dateStr) {
    if (!dateStr) return "";
    var sameYearRange = String(dateStr).match(/^(\d{4})\s*-\s*(\d{4})$/);
    if (sameYearRange && sameYearRange[1] === sameYearRange[2]) {
      return sameYearRange[1];
    }
    return dateStr;
  },
  getSortTime: function (value) {
    if (!value) return 0;
    var text = String(value);
    if (/present/i.test(text)) {
      return new Date().getFullYear();
    }
    var matches = text.match(/\d{4}/g);
    if (matches && matches.length) {
      return parseInt(matches[matches.length - 1], 10);
    }
    return 0;
  },
  formatAuthors: function (authors, article) {
    if (!authors) return "";
    var isCPA =
      article.journal &&
      /canadian psychiatric association/i.test(article.journal);
    return isCPA ? "Collaborators: " + authors : authors;
  },
  mediaClassName: function (article) {
    var image = (article.image || "").toLowerCase();
    return image.includes("businessplanning") ? "bp-media" : "";
  },
});
