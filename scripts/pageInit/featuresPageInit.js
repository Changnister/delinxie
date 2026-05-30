window.initStandardArticlesPage({
  fallbackImage: "Images/Linkpopup.jpg",
  searchFields: ["title", "authors", "journal"],
  journalNormalize: "commas",
  tagsPlacement: "date-row",
  enableLightbox: true,
  previewPredicate: function (article) {
    return (
      (article.title && /Pharmacy Awareness Month/i.test(article.title)) ||
      (article.journal && /Southlake/i.test(article.journal)) ||
      (article.image && /Southlake Banner/i.test(article.image))
    );
  },
  getLightboxImage: function (article) {
    return article.image || "";
  },
});
