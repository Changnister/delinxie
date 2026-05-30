/**
 * writingJsonLd.js
 * Generates and injects a NewsArticle/Article JSON-LD @graph into <head>
 * from window.articlesData (populated by pageData/writingArticles.js).
 *
 * Google can index dynamically injected JSON-LD; this approach keeps
 * the schema in sync with the data file automatically.
 */
(function () {
  var BASE_URL = "https://peterczhang.com/";

  // Outlets that warrant NewsArticle (vs. generic Article)
  var NEWS_ORGS = [
    "Globe and Mail",
    "Toronto Star",
    "Ottawa Citizen",
    "Hamilton Spectator",
    "Windsor Star",
    "Hill Times",
    "National Post",
    "MedCity News",
    "Healthy Debate",
    "Hospital News",
    "CMAJ",
  ];

  // Credential abbreviations to strip from author strings
  var CRED_RE =
    /^(MD|PharmD|PhD|BScPharm|MSc|MEd|MED|JD|MA|FRCPC|BCOP|RPh|BSc|MBBCh|CCFP|MHSc|MBBS|MPharm|MPH|OT|PT|RN|DO|DDS|DC|ND)\b/i;

  function toIsoDate(dateStr) {
    var d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toISOString().split("T")[0];
  }

  function isNewsOrg(journal) {
    if (!journal) return false;
    return NEWS_ORGS.some(function (org) {
      return journal.indexOf(org) !== -1;
    });
  }

  function toAbsoluteUrl(src) {
    if (!src) return "";
    return src.indexOf("http") === 0 ? src : BASE_URL + src;
  }

  /**
   * Parse an authors string like:
   *   "Co-authors: Jason M. Lo Hog Tian, Aisha Shafaqat, and Safaa Yaseen"
   *   "Co-author: Vince Teo, PharmD & Houman Khosravani, MD, MSc, PhD"
   * Returns an array of schema.org Person objects, with Peter Zhang first.
   */
  function buildAuthorList(authorsStr) {
    var peter = {
      "@type": "Person",
      name: "Peter Chengming Zhang",
      "@id": "https://orcid.org/0000-0001-7981-4303",
    };
    if (!authorsStr || authorsStr.trim() === "") return [peter];

    // Strip "Co-author(s):" prefix
    var raw = authorsStr.replace(/^co-authors?:\s*/i, "");

    // Normalise separators: " & " and " and " → ", "
    raw = raw.replace(/\s+&\s+/g, ", ").replace(/\b\s+and\s+\b/g, ", ");

    // Split on ", " and filter out bare credential tokens
    var coAuthors = raw
      .split(/,\s+/)
      .map(function (p) { return p.trim(); })
      .filter(function (p) { return p.length > 0 && !CRED_RE.test(p); })
      .map(function (name) { return { "@type": "Person", name: name }; });

    return [peter].concat(coAuthors);
  }

  function buildGraph(articles) {
    return articles.map(function (a) {
      var type = isNewsOrg(a.journal) ? "NewsArticle" : "Article";
      var item = {
        "@type": type,
        headline: a.title,
        author: buildAuthorList(a.authors),
        datePublished: toIsoDate(a.date),
        url: a.url,
      };
      if (a.journal) {
        item.publisher = { "@type": "Organization", name: a.journal };
      }
      if (a.image) {
        item.image = toAbsoluteUrl(a.image);
      }
      return item;
    });
  }

  function inject(articles) {
    if (!articles || !articles.length) return;
    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": buildGraph(articles),
    });
    document.head.appendChild(script);
  }

  // writingArticles.js sets window.articlesData before this script runs
  // (both are defer — execution order matches document order).
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      inject(window.articlesData || []);
    });
  } else {
    inject(window.articlesData || []);
  }
})();
