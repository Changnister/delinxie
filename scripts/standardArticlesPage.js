(function (global) {
  function normalizeJournalText(text, mode) {
    if (!text) return "";
    if (mode === "commas") return String(text).replace(/,\s*/g, " | ");
    if (mode === "commas-bullets") {
      return String(text).replace(/[\u2022\u00B7,]\s*/g, " | ");
    }
    return String(text);
  }

  function getOrCreateLightbox() {
    var overlay = document.getElementById("sharedCardLightboxOverlay");
    var img = document.getElementById("sharedCardLightboxImage");
    if (overlay && img) {
      return { overlay: overlay, img: img };
    }

    overlay = document.createElement("div");
    overlay.id = "sharedCardLightboxOverlay";
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("aria-hidden", "true");

    var closeButton = document.createElement("button");
    closeButton.className = "lightbox-close";
    closeButton.setAttribute("aria-label", "Close");
    closeButton.textContent = "x";

    var content = document.createElement("div");
    content.className = "lightbox-content";

    img = document.createElement("img");
    img.id = "sharedCardLightboxImage";
    img.alt = "Expanded image";
    img.loading = "eager";
    img.decoding = "async";

    content.appendChild(img);
    overlay.appendChild(closeButton);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    function closeLightbox() {
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      img.src = "";
    }

    closeButton.addEventListener("click", function (event) {
      event.stopPropagation();
      closeLightbox();
    });

    overlay.addEventListener("click", function () {
      closeLightbox();
    });

    content.addEventListener("click", function (event) {
      event.stopPropagation();
    });

    return { overlay: overlay, img: img };
  }

  function openLightbox(src) {
    if (!src) return;
    var lightbox = getOrCreateLightbox();
    lightbox.img.src = src;
    lightbox.overlay.classList.add("open");
    lightbox.overlay.setAttribute("aria-hidden", "false");
  }

  function createTagsInline(tags) {
    var tagsContainer = document.createElement("div");
    tagsContainer.className = "card-tags-inline";
    tags.forEach(function (tag) {
      var tagEl = document.createElement("span");
      tagEl.className = "tag";
      tagEl.textContent = tag;
      tagsContainer.appendChild(tagEl);
    });
    return tagsContainer;
  }

  function renderArticles(articles, config) {
    var container = document.getElementById(config.containerId);
    if (!container) return;
    container.innerHTML = "";

    var grid = document.createElement("div");
    grid.className = "bento-grid";

    articles.forEach(function (article) {
      var card = document.createElement("article");
      card.className = "bento-card";

      var link = document.createElement("a");
      link.className = "card-link";
      var shouldPreview =
        config.enableLightbox &&
        ((typeof config.previewPredicate === "function" &&
          config.previewPredicate(article)) ||
          (!article.url && (article.image || article.coverText)));

      link.href = shouldPreview ? "#" : article.url || "#";
      if (link.href !== "#") {
        link.target = "_blank";
        link.rel = "noopener";
      }

      if (shouldPreview) {
        link.addEventListener("click", function (event) {
          event.preventDefault();
          var previewSrc =
            (typeof config.getLightboxImage === "function" &&
              config.getLightboxImage(article)) ||
            article.image ||
            "";
          openLightbox(previewSrc);
        });
      }

      var media;
      if (article.coverText) {
        media = document.createElement("div");
        media.className = "text-cover";
        media.textContent = article.coverText;
      } else {
        var img = document.createElement("img");
        img.className = "card-media";
        if (typeof config.mediaClassName === "function") {
          var className = config.mediaClassName(article);
          if (className) {
            img.classList.add(className);
          }
        }
        img.alt = article.title || "";
        img.loading = "lazy";
        img.decoding = "async";
        img.fetchPriority = "low";
        // If article provides explicit image dimensions, set them to avoid CLS
        if (article.imageWidth) {
          img.width = article.imageWidth;
        }
        if (article.imageHeight) {
          img.height = article.imageHeight;
        }
        img.src = article.image || config.fallbackImage;
        media = img;
      }

      var body = document.createElement("div");
      body.className = "card-body";

      var content = document.createElement("div");
      content.className = "card-content";

      var title = document.createElement("h3");
      title.className = "card-title";
      title.textContent = article.title || "";
      content.appendChild(title);

      if (
        config.tagsPlacement === "under-title" &&
        Array.isArray(article.tag) &&
        article.tag.length
      ) {
        var tagsUnderTitle = createTagsInline(article.tag);
        content.appendChild(tagsUnderTitle);
      }

      if (article.journal) {
        var journal = document.createElement("div");
        journal.className = "card-journal";
        journal.textContent = normalizeJournalText(
          article.journal,
          config.journalNormalize,
        );
        content.appendChild(journal);
      }

      if (config.showCourse && article.course) {
        var course = document.createElement("div");
        course.className = "card-course";
        course.textContent = article.course;
        content.appendChild(course);
      }

      var metaBlock = document.createElement("div");
      metaBlock.className = "card-meta-block";

      if (article.date) {
        var dateEl = document.createElement("div");
        dateEl.className = "card-date";
        dateEl.textContent =
          typeof config.formatDate === "function"
            ? config.formatDate(article.date, article)
            : article.date;

        if (
          config.tagsPlacement === "date-row" &&
          Array.isArray(article.tag) &&
          article.tag.length
        ) {
          var metaRow = document.createElement("div");
          metaRow.className = "card-meta-row";
          metaRow.appendChild(dateEl);

          var tagsInline = createTagsInline(article.tag);
          metaRow.appendChild(tagsInline);
          metaBlock.appendChild(metaRow);
        } else {
          metaBlock.appendChild(dateEl);
        }
      }

      if (article.authors) {
        var authorsEl = document.createElement("div");
        authorsEl.className = "card-authors";
        var authorsText =
          typeof config.formatAuthors === "function"
            ? config.formatAuthors(article.authors, article)
            : article.authors;
        authorsEl.textContent = authorsText;
        // If the authors line indicates co-authors or collaborators, do not italicize
        if (
          /\b(co-author|co-authors|collaborator|collaborators)\b/i.test(
            authorsText,
          )
        ) {
          authorsEl.classList.add("no-italic");
        }
        metaBlock.appendChild(authorsEl);
      }

      body.appendChild(content);
      body.appendChild(metaBlock);

      link.appendChild(media);
      link.appendChild(body);
      card.appendChild(link);
      grid.appendChild(card);
    });

    container.appendChild(grid);
  }

  function getDefaultTime(value) {
    var time = new Date(value || 0).getTime();
    return Number.isNaN(time) ? 0 : time;
  }

  function getDefaultConfig(overrides) {
    return Object.assign(
      {
        containerId: "articleList",
        fallbackImage: "Images/Linkpopup.jpg",
        searchFields: ["title", "authors", "journal"],
        journalNormalize: "none",
        tagsPlacement: "none",
        getSortTime: getDefaultTime,
        showCourse: false,
        enableLightbox: false,
      },
      overrides || {},
    );
  }

  global.initStandardArticlesPage = function (opts) {
    var config = getDefaultConfig(opts);
    var chipButtons = [];

    function syncChipState(activeTag) {
      chipButtons.forEach(function (chipButton) {
        var isActive = chipButton.dataset.tag === activeTag;
        chipButton.classList.toggle("is-active", isActive);
        chipButton.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }

    function buildTagChips() {
      var tagEl = document.getElementById("tagFilter");
      var filtersRow = document.querySelector(".filters-row");
      var tagCol = tagEl && tagEl.closest(".filter-col");

      if (!tagEl || !filtersRow || document.querySelector(".filter-chip-row")) {
        return;
      }

      if (tagCol) {
        tagCol.classList.add("tag-filter-col");
      }
      filtersRow.classList.add("has-chip-ui");

      var chipRow = document.createElement("div");
      chipRow.className = "filter-chip-row";
      chipRow.setAttribute("aria-label", "Topic filters");

      Array.prototype.forEach.call(tagEl.options, function (option) {
        var chipButton = document.createElement("button");
        chipButton.type = "button";
        chipButton.className = "filter-chip";
        chipButton.dataset.tag = option.value;
        chipButton.textContent = option.textContent;
        chipButton.setAttribute("aria-pressed", "false");

        chipButton.addEventListener("click", function () {
          tagEl.value = option.value;
          syncChipState(option.value);
          filterAndSortArticles();
        });

        chipButtons.push(chipButton);
        chipRow.appendChild(chipButton);
      });

      filtersRow.insertAdjacentElement("afterend", chipRow);
      syncChipState(tagEl.value || "all");
    }

    function filterAndSortArticles() {
      var inputEl = document.getElementById("searchInput");
      var sortEl = document.getElementById("sortOrder");
      var tagEl = document.getElementById("tagFilter");

      var input = ((inputEl && inputEl.value) || "").toLowerCase();
      var sortOrder = (sortEl && sortEl.value) || "newest";
      var tag = (tagEl && tagEl.value) || "all";

      var source = Array.isArray(global.articlesData)
        ? global.articlesData
        : [];

      var filteredArticles = source.filter(function (article) {
        var matchesSearch = config.searchFields.some(function (field) {
          return (
            article[field] &&
            String(article[field]).toLowerCase().includes(input)
          );
        });
        if (!matchesSearch) return false;
        if (tag === "all") return true;
        return Array.isArray(article.tag) && article.tag.includes(tag);
      });

      filteredArticles.sort(function (a, b) {
        var at = config.getSortTime(a.date);
        var bt = config.getSortTime(b.date);
        return sortOrder === "newest" ? bt - at : at - bt;
      });

      renderArticles(filteredArticles, config);
    }

    function bindFilterControls() {
      var inputEl = document.getElementById("searchInput");
      var sortEl = document.getElementById("sortOrder");
      var tagEl = document.getElementById("tagFilter");

      function bindIfPresent(el, eventName) {
        if (el && !el.dataset.filterBound) {
          el.addEventListener(eventName, filterAndSortArticles);
          el.dataset.filterBound = "true";
        }
      }

      bindIfPresent(inputEl, "input");
      bindIfPresent(sortEl, "change");
      bindIfPresent(tagEl, "change");

      if (tagEl && !tagEl.dataset.chipSyncBound) {
        tagEl.addEventListener("change", function () {
          syncChipState(tagEl.value || "all");
        });
        tagEl.dataset.chipSyncBound = "true";
      }
    }

    global.filterAndSortArticles = filterAndSortArticles;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        buildTagChips();
        bindFilterControls();
        filterAndSortArticles();
      });
    } else {
      buildTagChips();
      bindFilterControls();
      filterAndSortArticles();
    }
  };
})(window);
