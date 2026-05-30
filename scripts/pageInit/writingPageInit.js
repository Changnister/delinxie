window.initStandardArticlesPage({
  fallbackImage: "Images/Writingcover.jpg",
  searchFields: ["title", "authors", "journal"],
  journalNormalize: "none",
  tagsPlacement: "none",
});

// Keep the hero publication count in sync with the data array
(function () {
  const el = document.getElementById("writing-pub-count");
  if (el && Array.isArray(window.articlesData)) {
    el.textContent = window.articlesData.length;
  }
})();
