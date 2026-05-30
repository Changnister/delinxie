(function () {
  var FALLBACK_LATEST = [
    {
      date: "April 2, 2026",
      title: "Three ways AI enables the entrepreneurship process",
      journal: "Canadian Healthcare Network",
      url: "https://canadianhealthcarenetwork.ca/three-ways-ai-enables-entrepreneurship-process",
      image: "Images/artificialintelligencearticle.jpg",
      width: 1400,
      height: 788,
    },
    {
      date: "March 4, 2026",
      title: "Why (and How) Teachers Should Use Generative AI in the Classroom",
      journal: "Faculty Focus",
      url: "https://www.facultyfocus.com/articles/teaching-with-technology-articles/why-and-how-teachers-should-use-generative-ai-in-the-classroom/",
      image: "Images/facultyfocus.jpg",
      width: 1400,
      height: 788,
    },
    {
      date: "February 13, 2026",
      title: "Bridging intergenerational tensions in the workplace",
      journal: "CareerWise / CERIC",
      url: "https://careerwise.ceric.ca/2026/02/13/bridging-intergenerational-tensions-in-the-workplace-2/",
      image: "Images/intergenerational.jpg",
      width: 1000,
      height: 550,
    },
  ];

  function getDateTime(value) {
    var time = new Date(value || 0).getTime();
    return Number.isNaN(time) ? 0 : time;
  }

  function getImageDimensions(article) {
    if (article && article.width && article.height) {
      return { width: article.width, height: article.height };
    }

    return { width: 1400, height: 788 };
  }

  function getLatestArticles() {
    var allArticles = window.ALL_ARTICLES;
    if (!Array.isArray(allArticles) || allArticles.length === 0) {
      return FALLBACK_LATEST.slice(0, 3);
    }

    var sorted = allArticles
      .slice()
      .sort(function (a, b) {
        return getDateTime(b.date) - getDateTime(a.date);
      })
      .slice(0, 3)
      .map(function (article) {
        var dimensions = getImageDimensions(article);
        return {
          date: article.date,
          title: article.title,
          journal: article.journal,
          url: article.url,
          image: article.image,
          width: dimensions.width,
          height: dimensions.height,
        };
      });

    return sorted.length ? sorted : FALLBACK_LATEST.slice(0, 3);
  }

  function createCard(article, index) {
    var card = document.createElement("article");
    card.className = "bento-card";

    var link = document.createElement("a");
    link.className = "card-link";
    link.href = article.url || "#";
    if (article.url) {
      link.target = "_blank";
      link.rel = "noopener";
    }

    var media = document.createElement("img");
    media.className = "card-media";
    media.alt = article.title || "";
    media.loading = index === 0 ? "eager" : "lazy";
    media.decoding = "async";
    media.fetchPriority = index === 0 ? "high" : "low";
    media.width = article.width || 1400;
    media.height = article.height || 788;
    media.src = article.image || "Images/Linkpopup.jpg";

    var body = document.createElement("div");
    body.className = "card-body";

    var content = document.createElement("div");
    content.className = "card-content";

    var title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = article.title || "";
    content.appendChild(title);

    if (article.journal) {
      var journal = document.createElement("div");
      journal.className = "card-journal";
      journal.textContent = article.journal;
      content.appendChild(journal);
    }

    var metaBlock = document.createElement("div");
    metaBlock.className = "card-meta-block";

    if (article.date) {
      var dateEl = document.createElement("div");
      dateEl.className = "card-date";
      dateEl.textContent = article.date;
      metaBlock.appendChild(dateEl);
    }

    body.appendChild(content);
    body.appendChild(metaBlock);

    link.appendChild(media);
    link.appendChild(body);
    card.appendChild(link);

    return card;
  }

  function populateHomeFeatured() {
    var homeContainer = document.getElementById("homeFeaturedList");
    if (!homeContainer) return;
    var latestArticles = getLatestArticles();

    homeContainer.innerHTML = "";

    var grid = document.createElement("div");
    grid.className = "bento-grid";

    latestArticles.forEach(function (article, index) {
      grid.appendChild(createCard(article, index));
    });

    homeContainer.appendChild(grid);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", populateHomeFeatured);
  } else {
    populateHomeFeatured();
  }
})();
