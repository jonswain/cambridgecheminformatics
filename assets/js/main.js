// Cambridge Cheminformatics Consulting — small progressive enhancements.
// The site works without JavaScript; this just adds polish.

(function () {
  // Header border once the page has scrolled
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Email links: the address is stored reversed and split so simple scrapers
  // don't harvest it. <a data-email-u="noj" data-email-d="moc.elpmaxe">
  document.querySelectorAll("[data-email-u]").forEach(function (el) {
    var rev = function (s) { return s.split("").reverse().join(""); };
    var addr = rev(el.getAttribute("data-email-u")) + "@" + rev(el.getAttribute("data-email-d"));
    el.setAttribute("href", "mailto:" + addr);
    if (el.hasAttribute("data-email-show")) {
      // Only allow a line break before the "@", never inside the domain.
      el.replaceChildren(addr.split("@")[0], document.createElement("wbr"), "@" + addr.split("@")[1]);
    }
  });

  // Latest blog posts from jonswain.github.io (Atom feed, CORS-enabled).
  // Falls back to the static list already in the HTML if anything fails.
  var list = document.querySelector("[data-feed]");
  if (list && window.fetch && window.DOMParser) {
    var url = list.getAttribute("data-feed");
    var max = parseInt(list.getAttribute("data-feed-count") || "3", 10);
    fetch(url, { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (xml) {
        var doc = new DOMParser().parseFromString(xml, "application/xml");
        var entries = Array.prototype.slice.call(doc.getElementsByTagName("entry"), 0, max);
        if (!entries.length) return;
        var fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
        var text = function (e, tag) { var n = e.getElementsByTagName(tag)[0]; return n ? n.textContent.trim() : ""; };
        var frag = document.createDocumentFragment();
        entries.forEach(function (e) {
          var link = "";
          var links = e.getElementsByTagName("link");
          for (var i = 0; i < links.length; i++) {
            if (!links[i].getAttribute("rel") || links[i].getAttribute("rel") === "alternate") { link = links[i].getAttribute("href"); break; }
          }
          if (!/^https:\/\//.test(link)) return;
          var published = text(e, "published") || text(e, "updated");
          var summary = text(e, "summary");
          if (summary.length > 180) summary = summary.slice(0, 177).replace(/\s+\S*$/, "") + "…";

          var li = document.createElement("li"); li.className = "post";
          var a = document.createElement("a"); a.href = link;
          var t = document.createElement("time");
          if (published) { t.dateTime = published.slice(0, 10); t.textContent = fmt.format(new Date(published)); }
          var h = document.createElement("h3"); h.textContent = text(e, "title");
          var p = document.createElement("p"); p.textContent = summary;
          var m = document.createElement("span"); m.className = "more"; m.textContent = "Read post →";
          a.append(t, h, p, m); li.appendChild(a); frag.appendChild(li);
        });
        if (frag.childNodes.length) { list.replaceChildren(frag); }
      })
      .catch(function () { /* keep static fallback */ });
  }
})();
