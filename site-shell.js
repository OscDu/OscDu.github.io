(function () {
  var defaultConfig = {
    brandName: "Dashcam",
    primaryDomain: "",
    routes: {
      home: "/",
      product: "/#product",
      privacy: "/privacy",
      terms: "/terms",
      support: "/support",
      arbitration: "/arbitration",
      about: "/about/index.html",
    },
  };

  var runtimeConfig = window.__DASHCAM_SITE_CONFIG__ || {};
  var config = {
    brandName: runtimeConfig.brandName || defaultConfig.brandName,
    primaryDomain: runtimeConfig.primaryDomain || defaultConfig.primaryDomain,
    routes: Object.assign({}, defaultConfig.routes, runtimeConfig.routes || {}),
  };

  var routeSelectors = {
    home: "[data-site-home-link]",
    product: "[data-site-product-link]",
    privacy: "[data-site-privacy-link]",
    terms: "[data-site-terms-link]",
    support: "[data-site-support-link]",
    arbitration: "[data-site-arbitration-link]",
    about: "[data-site-about-link]",
  };

  function formatTemplate(template) {
    return template.replace(/\{brand\}/g, config.brandName);
  }

  Object.keys(routeSelectors).forEach(function (routeKey) {
    var href = config.routes[routeKey];
    if (!href) {
      return;
    }

    document.querySelectorAll(routeSelectors[routeKey]).forEach(function (link) {
      link.setAttribute("href", href);
    });
  });

  document.querySelectorAll("[data-site-brand]").forEach(function (node) {
    node.textContent = config.brandName;
  });

  var titleNode = document.querySelector("title[data-site-page-title]");
  if (titleNode) {
    titleNode.textContent = formatTemplate(titleNode.getAttribute("data-site-page-title") || "");
  }

  var descriptionNode = document.querySelector('meta[name="description"][data-site-page-description]');
  if (descriptionNode) {
    descriptionNode.setAttribute(
      "content",
      formatTemplate(descriptionNode.getAttribute("data-site-page-description") || ""),
    );
  }

  var canonicalNode = document.querySelector("link[rel='canonical'][data-site-pathname]");
  if (canonicalNode) {
    var pathname = canonicalNode.getAttribute("data-site-pathname") || "/";
    if (config.primaryDomain) {
      try {
        canonicalNode.setAttribute("href", new URL(pathname, config.primaryDomain).toString());
      } catch (_error) {
        canonicalNode.remove();
      }
    } else {
      canonicalNode.remove();
    }
  }
})();
