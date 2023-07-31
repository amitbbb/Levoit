// _src/scripts/base/global.js
function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}
document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute("role", "button");
  summary.setAttribute(
    "aria-expanded",
    summary.parentNode.hasAttribute("open")
  );
  if (summary.nextElementSibling.getAttribute("id")) {
    summary.setAttribute("aria-controls", summary.nextElementSibling.id);
  }
  summary.addEventListener("click", (event2) => {
    event2.currentTarget.setAttribute(
      "aria-expanded",
      !event2.currentTarget.closest("details").hasAttribute("open")
    );
  });
  if (summary.closest("header-drawer"))
    return;
  summary.parentElement.addEventListener("keyup", onKeyUpEscape2);
});
var trapFocusHandlers = {};
function trapFocus2(container, elementToFocus = container) {
  console.log("trapFocus() INIT", container);
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];
  removeTrapFocus2();
  trapFocusHandlers.focusin = (event2) => {
    if (event2.target !== container && event2.target !== last && event2.target !== first)
      return;
    document.addEventListener("keydown", trapFocusHandlers.keydown);
  };
  trapFocusHandlers.focusout = function() {
    document.removeEventListener("keydown", trapFocusHandlers.keydown);
  };
  trapFocusHandlers.keydown = function(event2) {
    if (event2.code.toUpperCase() !== "TAB")
      return;
    if (event2.target === last && !event2.shiftKey) {
      event2.preventDefault();
      first.focus();
    }
    if ((event2.target === container || event2.target === first) && event2.shiftKey) {
      event2.preventDefault();
      last.focus();
    }
  };
  document.addEventListener("focusout", trapFocusHandlers.focusout);
  document.addEventListener("focusin", trapFocusHandlers.focusin);
  elementToFocus.focus();
  if (elementToFocus.tagName === "INPUT" && ["search", "text", "email", "url"].includes(elementToFocus.type) && elementToFocus.value) {
    elementToFocus.setSelectionRange(0, elementToFocus.value.length);
  }
}
try {
  document.querySelector(":focus-visible");
} catch (e2) {
  focusVisiblePolyfill();
}
function focusVisiblePolyfill() {
  const navKeys = [
    "ARROWUP",
    "ARROWDOWN",
    "ARROWLEFT",
    "ARROWRIGHT",
    "TAB",
    "ENTER",
    "SPACE",
    "ESCAPE",
    "HOME",
    "END",
    "PAGEUP",
    "PAGEDOWN"
  ];
  let currentFocusedElement = null;
  let mouseClick = null;
  window.addEventListener("keydown", (event2) => {
    if (navKeys.includes(event2.code.toUpperCase())) {
      mouseClick = false;
    }
  });
  window.addEventListener("mousedown", (event2) => {
    mouseClick = true;
  });
  window.addEventListener(
    "focus",
    () => {
      if (currentFocusedElement)
        currentFocusedElement.classList.remove("focused");
      if (mouseClick)
        return;
      currentFocusedElement = document.activeElement;
      currentFocusedElement.classList.add("focused");
    },
    true
  );
}
function removeTrapFocus2(elementToFocus = null) {
  console.log("removeTrapFocus() INIT", elementToFocus);
  document.removeEventListener("focusin", trapFocusHandlers.focusin);
  document.removeEventListener("focusout", trapFocusHandlers.focusout);
  document.removeEventListener("keydown", trapFocusHandlers.keydown);
  if (elementToFocus)
    elementToFocus.focus();
}
function onKeyUpEscape2(event2) {
  if (event2.code.toUpperCase() !== "ESCAPE")
    return;
  const openDetailsElement = event2.target.closest("details[open]");
  if (!openDetailsElement)
    return;
  const summaryElement = openDetailsElement.querySelector("summary");
  openDetailsElement.removeAttribute("open");
  summaryElement.setAttribute("aria-expanded", false);
  summaryElement.focus();
}
function debounce(fn, wait) {
  let t2;
  return (...args) => {
    clearTimeout(t2);
    t2 = setTimeout(() => fn.apply(this, args), wait);
  };
}
function fetchConfig2(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`
    }
  };
}
if (typeof window.Shopify == "undefined") {
  window.Shopify = {};
}
Shopify.bind = function(fn, scope) {
  return function() {
    return fn.apply(scope, arguments);
  };
};
Shopify.setSelectorByValue = function(selector, value) {
  for (var i2 = 0, count = selector.options.length; i2 < count; i2++) {
    var option = selector.options[i2];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i2;
      return i2;
    }
  }
};
Shopify.addListener = function(target, eventName, callback) {
  target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent("on" + eventName, callback);
};
Shopify.postLink = function(path, options) {
  options = options || {};
  var method = options["method"] || "post";
  var params = options["parameters"] || {};
  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);
  for (var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};
Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(
    options["hideElement"] || province_domid
  );
  Shopify.addListener(
    this.countryEl,
    "change",
    Shopify.bind(this.countryHandler, this)
  );
  this.initCountry();
  this.initProvince();
};
Shopify.CountryProvinceSelector.prototype = {
  initCountry: function() {
    var value = this.countryEl.getAttribute("data-default");
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },
  initProvince: function() {
    var value = this.provinceEl.getAttribute("data-default");
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },
  countryHandler: function(e2) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute("data-provinces");
    var provinces = JSON.parse(raw);
    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = "none";
    } else {
      for (var i2 = 0; i2 < provinces.length; i2++) {
        var opt = document.createElement("option");
        opt.value = provinces[i2][0];
        opt.innerHTML = provinces[i2][1];
        this.provinceEl.appendChild(opt);
      }
      this.provinceContainer.style.display = "";
    }
  },
  clearOptions: function(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },
  setOptions: function(selector, values) {
    for (var i2 = 0, count = values.length; i2 < values.length; i2++) {
      var opt = document.createElement("option");
      opt.value = values[i2];
      opt.innerHTML = values[i2];
      selector.appendChild(opt);
    }
  }
};

// _src/scripts/global/store-header.js
var StoreHeader = class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.header = this;
    this.headerBounds = {};
    this.currentScrollTop = 0;
    this.preventReveal = false;
    this.onScrollHandler = this.onScroll.bind(this);
    window.addEventListener("scroll", this.onScrollHandler, false);
    this.createObserver();
  }
  disconnectedCallback() {
    window.removeEventListener("scroll", this.onScrollHandler);
  }
  createObserver() {
    let observer = new IntersectionObserver((entries, observer2) => {
      this.headerBounds = entries[0].intersectionRect;
      observer2.disconnect();
    });
    observer.observe(this.header);
  }
  onScroll() {
    const scrollTop = document.documentElement.scrollTop;
    const logoPrimary = this.querySelector("#LogoPrimary");
    const logoSecondary = this.querySelector("#LogoSecondary");
    if (scrollTop) {
      if (this.preventHide)
        return;
      requestAnimationFrame(this.fillColor.bind(this));
    } else {
      requestAnimationFrame(this.removeFillColor.bind(this));
    }
  }
  fillColor() {
    this.header.classList.add("is-filled");
    this.header.closest("header").classList.add("is-filled");
  }
  removeFillColor() {
    this.header.classList.remove("is-filled");
    this.header.closest("header").classList.remove("is-filled");
  }
};
window.customElements.define("store-header", StoreHeader);

// _src/scripts/global/mega-menu.js
var MegaMenu = class extends HTMLElement {
  constructor() {
    super();
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    const header = this.closest("#shopify-section-header");
    const detail = this.querySelector("details");
    var delay = 150;
    var timeoutId;
    this.querySelector("details").addEventListener("mouseenter", () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.open();
      }, delay);
    });
    this.querySelector("details").addEventListener("mouseleave", () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.close();
      }, delay);
    });
  }
  open() {
    const detail = this.querySelector("details");
    detail.setAttribute("open", "");
    setTimeout(() => {
      this.classList.add("is-open");
    });
    window.requestAnimationFrame(() => this.openAnimation());
  }
  close() {
    const detail = this.querySelector("details");
    detail.removeAttribute("open");
    setTimeout(() => {
      this.classList.remove("is-open");
      window.requestAnimationFrame(() => this.closeAnimation());
    });
  }
  openAnimation() {
  }
  closeAnimation() {
  }
  onAnimationFinish(open) {
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    if (!open) {
    }
  }
};
window.customElements.define("mega-menu", MegaMenu);

// _src/scripts/global/predictive-search.js
var PredictiveSearch = class extends HTMLElement {
  constructor() {
    super();
    this.cachedResults = {};
    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector("[data-predictive-search]");
    this.isOpen = false;
    this.setupEventListeners();
  }
  setupEventListeners() {
    const form = this.querySelector("form");
    form.addEventListener("submit", this.onFormSubmit.bind(this));
    this.input.addEventListener("input", debounce((event2) => {
      this.onChange(event2);
    }, 300).bind(this));
    this.input.addEventListener("focus", this.onFocus.bind(this));
    this.addEventListener("focusout", this.onFocusOut.bind(this));
    this.addEventListener("keyup", this.onKeyup.bind(this));
    this.addEventListener("keydown", this.onKeydown.bind(this));
  }
  getQuery() {
    return this.input.value.trim();
  }
  onChange() {
    const searchTerm = this.getQuery();
    if (!searchTerm.length) {
      this.close(true);
      return;
    }
    this.getSearchResults(searchTerm);
  }
  onFormSubmit(event2) {
    if (!this.getQuery().length || this.querySelector('[aria-selected="true"] a'))
      event2.preventDefault();
  }
  onFocus() {
    const searchTerm = this.getQuery();
    if (!searchTerm.length)
      return;
    if (this.getAttribute("results") === "true") {
      this.open();
    } else {
      this.getSearchResults(searchTerm);
    }
  }
  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement))
        this.close();
    });
  }
  onKeyup(event2) {
    if (!this.getQuery().length)
      this.close(true);
    event2.preventDefault();
    switch (event2.code) {
      case "ArrowUp":
        this.switchOption("up");
        break;
      case "ArrowDown":
        this.switchOption("down");
        break;
      case "Enter":
        this.selectOption();
        break;
    }
  }
  onKeydown(event2) {
    if (event2.code === "ArrowUp" || event2.code === "ArrowDown") {
      event2.preventDefault();
    }
  }
  switchOption(direction) {
    if (!this.getAttribute("open"))
      return;
    const moveUp = direction === "up";
    const selectedElement = this.querySelector('[aria-selected="true"]');
    const allElements = this.querySelectorAll("li");
    let activeElement = this.querySelector("li");
    if (moveUp && !selectedElement)
      return;
    this.statusElement.textContent = "";
    if (!moveUp && selectedElement) {
      activeElement = selectedElement.nextElementSibling || allElements[0];
    } else if (moveUp) {
      activeElement = selectedElement.previousElementSibling || allElements[allElements.length - 1];
    }
    if (activeElement === selectedElement)
      return;
    activeElement.setAttribute("aria-selected", true);
    if (selectedElement)
      selectedElement.setAttribute("aria-selected", false);
    this.setLiveRegionText(activeElement.textContent);
    this.input.setAttribute("aria-activedescendant", activeElement.id);
  }
  selectOption() {
    const selectedProduct = this.querySelector('[aria-selected="true"] a, [aria-selected="true"] button');
    if (selectedProduct)
      selectedProduct.click();
  }
  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(" ", "-").toLowerCase();
    this.setLiveRegionLoadingState();
    const limit = this.getAttribute("limit");
    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      return;
    }
    fetch(
      `${window.themeVariables.routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&${encodeURIComponent(
        "resources[type]"
      )}=product,article,page&${encodeURIComponent(
        "resources[limit]"
      )}=6&resources[options][fields]=title,product_type,variants.title,tag&section_id=predictive-search&resources[options][unavailable_products]=hide&resources[limit_scope]=each`
    ).then((response) => {
      if (!response.ok) {
        var error = new Error(response.status);
        this.close();
        throw error;
      }
      return response.text();
    }).then((text) => {
      const resultsMarkup = new DOMParser().parseFromString(text, "text/html").querySelector("#shopify-section-predictive-search").innerHTML;
      this.cachedResults[queryKey] = resultsMarkup;
      this.renderSearchResults(resultsMarkup);
    }).catch((error) => {
      this.close();
      throw error;
    });
  }
  setLiveRegionLoadingState() {
    this.statusElement = this.statusElement || this.querySelector(".predictive-search-status");
    this.loadingText = this.loadingText || this.getAttribute("data-loading-text");
    this.setLiveRegionText(this.loadingText);
    this.setAttribute("loading", true);
  }
  setLiveRegionText(statusText) {
    this.statusElement.setAttribute("aria-hidden", "false");
    this.statusElement.textContent = statusText;
    setTimeout(() => {
      this.statusElement.setAttribute("aria-hidden", "true");
    }, 1e3);
  }
  renderSearchResults(resultsMarkup) {
    this.predictiveSearchResults.innerHTML = resultsMarkup;
    this.setAttribute("results", true);
    this.setLiveRegionResults();
    this.open();
  }
  setLiveRegionResults() {
    this.removeAttribute("loading");
    this.setLiveRegionText(this.querySelector("[data-predictive-search-live-region-count-value]").textContent);
  }
  // getResultsMaxHeight() {
  //   this.resultsMaxHeight = window.innerHeight - document.getElementById('shopify-section-header').getBoundingClientRect().bottom;
  //   return this.resultsMaxHeight;
  // }
  open() {
    this.setAttribute("open", true);
    this.input.setAttribute("aria-expanded", true);
    this.isOpen = true;
  }
  close(clearSearchTerm = false) {
    if (clearSearchTerm) {
      this.input.value = "";
      this.removeAttribute("results");
    }
    const selected = this.querySelector('[aria-selected="true"]');
    if (selected)
      selected.setAttribute("aria-selected", false);
    this.input.setAttribute("aria-activedescendant", "");
    this.removeAttribute("open");
    this.input.setAttribute("aria-expanded", false);
    this.resultsMaxHeight = false;
    this.predictiveSearchResults.removeAttribute("style");
    this.isOpen = false;
  }
};
customElements.define("predictive-search", PredictiveSearch);

// _src/scripts/global/search-component.js
var SearchComponent = class extends HTMLElement {
  constructor() {
    super();
  }
  show() {
  }
  close() {
  }
  connectedCallback() {
  }
  disconnectedCallback() {
  }
  attributeChangedCallback(name, oldVal, newVal) {
  }
  adoptedCallback() {
  }
};
window.customElements.define("search-component", SearchComponent);

// _src/scripts/components/stagger-grid.js
var StaggerGrid = class extends HTMLElement {
  constructor() {
    super();
    const targets = [...this.querySelectorAll("[stagger-item]")];
    console.log("targets", targets);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reducedMotion ? 0.01 : 400;
    const stagger = reducedMotion ? 0 : 50;
    const observer = new IntersectionObserver((entries, observer2, index) => {
      entries.forEach((entry, index2) => {
        if (entry.isIntersecting) {
          console.log("entrytraget", entry.target);
          entry.target.animate(
            {
              transform: ["translateY(1rem)", "translateY(0)"],
              opacity: [0, 1],
              easing: "ease-out"
            },
            {
              duration: 500,
              fill: "both",
              delay: duration * 0.5 + index2 * stagger
            }
          );
          entry.target.classList.add("animated");
          observer2.unobserve(entry.target);
        }
      });
    }, { rootMargin: `0px 0px -100px 0px` });
    targets.forEach((target, index) => {
      console.log("target", target);
      observer.observe(target, index);
    });
  }
};
window.customElements.define("stagger-grid", StaggerGrid);

// _src/scripts/components/details-disclosure.js
var DetailsDisclosure = class extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector("details");
    this.content = this.mainDetailsToggle.querySelector("summary").nextElementSibling;
    this.mainDetailsToggle.addEventListener("focusout", this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener("toggle", this.onToggle.bind(this));
  }
  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement))
        this.close();
    });
  }
  onToggle() {
    if (!this.animations)
      this.animations = this.content.getAnimations();
    if (this.mainDetailsToggle.hasAttribute("open")) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }
  close() {
    this.mainDetailsToggle.removeAttribute("open");
    this.mainDetailsToggle.querySelector("summary").setAttribute("aria-expanded", false);
  }
};
customElements.define("details-disclosure", DetailsDisclosure);

// _src/scripts/components/lazy-image.js
var LazyImage = class extends HTMLElement {
  constructor() {
    super();
    const observer = new IntersectionObserver((entries, observer2) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          let img = lazyImage.querySelector("img");
          if (img.dataset.src)
            img.src = img.dataset.src;
          if (img.dataset.srcset)
            img.srcset = img.dataset.srcset;
          lazyImage.classList.add("fade-in");
          observer2.unobserve(lazyImage);
        }
      });
    }, { rootMargin: `0px 0px -100px 0px` });
    observer.observe(this);
  }
};
window.customElements.define("lazy-image", LazyImage);

// node_modules/keen-slider/keen-slider.es.js
var n = function() {
  return n = Object.assign || function(n2) {
    for (var t2, i2 = 1, e2 = arguments.length; i2 < e2; i2++)
      for (var r2 in t2 = arguments[i2])
        Object.prototype.hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
    return n2;
  }, n.apply(this, arguments);
};
function t(n2, t2, i2) {
  if (i2 || 2 === arguments.length)
    for (var e2, r2 = 0, a2 = t2.length; r2 < a2; r2++)
      !e2 && r2 in t2 || (e2 || (e2 = Array.prototype.slice.call(t2, 0, r2)), e2[r2] = t2[r2]);
  return n2.concat(e2 || Array.prototype.slice.call(t2));
}
function i(n2) {
  return Array.prototype.slice.call(n2);
}
function e(n2, t2) {
  var i2 = Math.floor(n2);
  return i2 === t2 || i2 + 1 === t2 ? n2 : t2;
}
function r() {
  return Date.now();
}
function a(n2, t2, i2) {
  if (t2 = "data-keen-slider-" + t2, null === i2)
    return n2.removeAttribute(t2);
  n2.setAttribute(t2, i2 || "");
}
function o(n2, t2) {
  return t2 = t2 || document, "function" == typeof n2 && (n2 = n2(t2)), Array.isArray(n2) ? n2 : "string" == typeof n2 ? i(t2.querySelectorAll(n2)) : n2 instanceof HTMLElement ? [n2] : n2 instanceof NodeList ? i(n2) : [];
}
function u(n2) {
  n2.raw && (n2 = n2.raw), n2.cancelable && !n2.defaultPrevented && n2.preventDefault();
}
function s(n2) {
  n2.raw && (n2 = n2.raw), n2.stopPropagation && n2.stopPropagation();
}
function c() {
  var n2 = [];
  return { add: function(t2, i2, e2, r2) {
    t2.addListener ? t2.addListener(e2) : t2.addEventListener(i2, e2, r2), n2.push([t2, i2, e2, r2]);
  }, input: function(n3, t2, i2, e2) {
    this.add(n3, t2, function(n4) {
      return function(t3) {
        t3.nativeEvent && (t3 = t3.nativeEvent);
        var i3 = t3.changedTouches || [], e3 = t3.targetTouches || [], r2 = t3.detail && t3.detail.x ? t3.detail : null;
        return n4({ id: r2 ? r2.identifier ? r2.identifier : "i" : e3[0] ? e3[0] ? e3[0].identifier : "e" : "d", idChanged: r2 ? r2.identifier ? r2.identifier : "i" : i3[0] ? i3[0] ? i3[0].identifier : "e" : "d", raw: t3, x: r2 && r2.x ? r2.x : e3[0] ? e3[0].screenX : r2 ? r2.x : t3.pageX, y: r2 && r2.y ? r2.y : e3[0] ? e3[0].screenY : r2 ? r2.y : t3.pageY });
      };
    }(i2), e2);
  }, purge: function() {
    n2.forEach(function(n3) {
      n3[0].removeListener ? n3[0].removeListener(n3[2]) : n3[0].removeEventListener(n3[1], n3[2], n3[3]);
    }), n2 = [];
  } };
}
function d(n2, t2, i2) {
  return Math.min(Math.max(n2, t2), i2);
}
function l(n2) {
  return (n2 > 0 ? 1 : 0) - (n2 < 0 ? 1 : 0) || +n2;
}
function f(n2) {
  var t2 = n2.getBoundingClientRect();
  return { height: e(t2.height, n2.offsetHeight), width: e(t2.width, n2.offsetWidth) };
}
function p(n2, t2, i2, e2) {
  var r2 = n2 && n2[t2];
  return null == r2 ? i2 : e2 && "function" == typeof r2 ? r2() : r2;
}
function v(n2) {
  return Math.round(1e6 * n2) / 1e6;
}
function h(n2) {
  var t2, i2, e2, r2, a2, o2;
  function u2(t3) {
    o2 || (o2 = t3), s2(true);
    var a3 = t3 - o2;
    a3 > e2 && (a3 = e2);
    var l3 = r2[i2];
    if (l3[3] < a3)
      return i2++, u2(t3);
    var f2 = l3[2], p2 = l3[4], v2 = l3[0], h2 = l3[1] * (0, l3[5])(0 === p2 ? 1 : (a3 - f2) / p2);
    if (h2 && n2.track.to(v2 + h2), a3 < e2)
      return d2();
    o2 = null, s2(false), c2(null), n2.emit("animationEnded");
  }
  function s2(n3) {
    t2.active = n3;
  }
  function c2(n3) {
    t2.targetIdx = n3;
  }
  function d2() {
    var n3;
    n3 = u2, a2 = window.requestAnimationFrame(n3);
  }
  function l2() {
    var t3;
    t3 = a2, window.cancelAnimationFrame(t3), s2(false), c2(null), o2 && n2.emit("animationStopped"), o2 = null;
  }
  return t2 = { active: false, start: function(t3) {
    if (l2(), n2.track.details) {
      var a3 = 0, o3 = n2.track.details.position;
      i2 = 0, e2 = 0, r2 = t3.map(function(n3) {
        var t4, i3 = Number(o3), r3 = null !== (t4 = n3.earlyExit) && void 0 !== t4 ? t4 : n3.duration, u3 = n3.easing, s3 = n3.distance * u3(r3 / n3.duration) || 0;
        o3 += s3;
        var c3 = e2;
        return e2 += r3, a3 += s3, [i3, n3.distance, c3, e2, n3.duration, u3];
      }), c2(n2.track.distToIdx(a3)), d2(), n2.emit("animationStarted");
    }
  }, stop: l2, targetIdx: null };
}
function m(n2) {
  var i2, e2, a2, o2, u2, s2, c2, f2, h2, m2, g2, b2, x2, k2, y2 = 1 / 0, w = [], M = null, T = 0;
  function C(n3) {
    _(T + n3);
  }
  function E(n3) {
    var t2 = z(T + n3).abs;
    return D(t2) ? t2 : null;
  }
  function z(n3) {
    var i3 = Math.floor(Math.abs(v(n3 / e2))), r2 = v((n3 % e2 + e2) % e2);
    r2 === e2 && (r2 = 0);
    var a3 = l(n3), o3 = c2.indexOf(t([], c2, true).reduce(function(n4, t2) {
      return Math.abs(t2 - r2) < Math.abs(n4 - r2) ? t2 : n4;
    })), u3 = o3;
    return a3 < 0 && i3++, o3 === s2 && (u3 = 0, i3 += a3 > 0 ? 1 : -1), { abs: u3 + i3 * s2 * a3, origin: o3, rel: u3 };
  }
  function I(n3, t2, i3) {
    var e3;
    if (t2 || !S())
      return A(n3, i3);
    if (!D(n3))
      return null;
    var r2 = z(null != i3 ? i3 : T), a3 = r2.abs, o3 = n3 - r2.rel, u3 = a3 + o3;
    e3 = A(u3);
    var c3 = A(u3 - s2 * l(o3));
    return (null !== c3 && Math.abs(c3) < Math.abs(e3) || null === e3) && (e3 = c3), v(e3);
  }
  function A(n3, t2) {
    if (null == t2 && (t2 = v(T)), !D(n3) || null === n3)
      return null;
    n3 = Math.round(n3);
    var i3 = z(t2), r2 = i3.abs, a3 = i3.rel, o3 = i3.origin, u3 = O(n3), d2 = (t2 % e2 + e2) % e2, l2 = c2[o3], f3 = Math.floor((n3 - (r2 - a3)) / s2) * e2;
    return v(l2 - d2 - l2 + c2[u3] + f3 + (o3 === s2 ? e2 : 0));
  }
  function D(n3) {
    return L(n3) === n3;
  }
  function L(n3) {
    return d(n3, h2, m2);
  }
  function S() {
    return o2.loop;
  }
  function O(n3) {
    return (n3 % s2 + s2) % s2;
  }
  function _(t2) {
    var i3;
    i3 = t2 - T, w.push({ distance: i3, timestamp: r() }), w.length > 6 && (w = w.slice(-6)), T = v(t2);
    var e3 = H().abs;
    if (e3 !== M) {
      var a3 = null !== M;
      M = e3, a3 && n2.emit("slideChanged");
    }
  }
  function H(t2) {
    var r2 = t2 ? null : function() {
      if (s2) {
        var n3 = S(), t3 = n3 ? (T % e2 + e2) % e2 : T, i3 = (n3 ? T % e2 : T) - u2[0][2], r3 = 0 - (i3 < 0 && n3 ? e2 - Math.abs(i3) : i3), c3 = 0, d2 = z(T), f3 = d2.abs, p2 = d2.rel, v2 = u2[p2][2], y3 = u2.map(function(t4, i4) {
          var a3 = r3 + c3;
          (a3 < 0 - t4[0] || a3 > 1) && (a3 += (Math.abs(a3) > e2 - 1 && n3 ? e2 : 0) * l(-a3));
          var u3 = i4 - p2, d3 = l(u3), h3 = u3 + f3;
          n3 && (-1 === d3 && a3 > v2 && (h3 += s2), 1 === d3 && a3 < v2 && (h3 -= s2), null !== g2 && h3 < g2 && (a3 += e2), null !== b2 && h3 > b2 && (a3 -= e2));
          var m3 = a3 + t4[0] + t4[1], x3 = Math.max(a3 >= 0 && m3 <= 1 ? 1 : m3 < 0 || a3 > 1 ? 0 : a3 < 0 ? Math.min(1, (t4[0] + a3) / t4[0]) : (1 - a3) / t4[0], 0);
          return c3 += t4[0] + t4[1], { abs: h3, distance: o2.rtl ? -1 * a3 + 1 - t4[0] : a3, portion: x3, size: t4[0] };
        });
        return f3 = L(f3), p2 = O(f3), { abs: L(f3), length: a2, max: k2, maxIdx: m2, min: x2, minIdx: h2, position: T, progress: n3 ? t3 / e2 : T / a2, rel: p2, slides: y3, slidesLength: e2 };
      }
    }();
    return i2.details = r2, n2.emit("detailsChanged"), r2;
  }
  return i2 = { absToRel: O, add: C, details: null, distToIdx: E, idxToDist: I, init: function(t2) {
    if (function() {
      if (o2 = n2.options, u2 = (o2.trackConfig || []).map(function(n3) {
        return [p(n3, "size", 1), p(n3, "spacing", 0), p(n3, "origin", 0)];
      }), s2 = u2.length) {
        e2 = v(u2.reduce(function(n3, t4) {
          return n3 + t4[0] + t4[1];
        }, 0));
        var t3, i4 = s2 - 1;
        a2 = v(e2 + u2[0][2] - u2[i4][0] - u2[i4][2] - u2[i4][1]), c2 = u2.reduce(function(n3, i5) {
          if (!n3)
            return [0];
          var e3 = u2[n3.length - 1], r2 = n3[n3.length - 1] + (e3[0] + e3[2]) + e3[1];
          return r2 -= i5[2], n3[n3.length - 1] > r2 && (r2 = n3[n3.length - 1]), r2 = v(r2), n3.push(r2), (!t3 || t3 < r2) && (f2 = n3.length - 1), t3 = r2, n3;
        }, null), 0 === a2 && (f2 = 0), c2.push(v(e2));
      }
    }(), !s2)
      return H(true);
    var i3;
    !function() {
      var t3 = n2.options.range, i4 = n2.options.loop;
      g2 = h2 = i4 ? p(i4, "min", -1 / 0) : 0, b2 = m2 = i4 ? p(i4, "max", y2) : f2;
      var e3 = p(t3, "min", null), r2 = p(t3, "max", null);
      e3 && (h2 = e3), r2 && (m2 = r2), x2 = h2 === -1 / 0 ? h2 : n2.track.idxToDist(h2 || 0, true, 0), k2 = m2 === y2 ? m2 : I(m2, true, 0), null === r2 && (b2 = m2), p(t3, "align", false) && m2 !== y2 && 0 === u2[O(m2)][2] && (k2 -= 1 - u2[O(m2)][0], m2 = E(k2 - T)), x2 = v(x2), k2 = v(k2);
    }(), i3 = t2, Number(i3) === i3 ? C(A(L(t2))) : H();
  }, to: _, velocity: function() {
    var n3 = r(), t2 = w.reduce(function(t3, i3) {
      var e3 = i3.distance, r2 = i3.timestamp;
      return n3 - r2 > 200 || (l(e3) !== l(t3.distance) && t3.distance && (t3 = { distance: 0, lastTimestamp: 0, time: 0 }), t3.time && (t3.distance += e3), t3.lastTimestamp && (t3.time += r2 - t3.lastTimestamp), t3.lastTimestamp = r2), t3;
    }, { distance: 0, lastTimestamp: 0, time: 0 });
    return t2.distance / t2.time || 0;
  } };
}
function g(n2) {
  var t2, i2, e2, r2, a2, o2, u2, s2;
  function c2(n3) {
    return 2 * n3;
  }
  function f2(n3) {
    return d(n3, u2, s2);
  }
  function p2(n3) {
    return 1 - Math.pow(1 - n3, 3);
  }
  function v2() {
    return e2 ? n2.track.velocity() : 0;
  }
  function h2() {
    b2();
    var t3 = "free-snap" === n2.options.mode, i3 = n2.track, e3 = v2();
    r2 = l(e3);
    var u3 = n2.track.details, s3 = [];
    if (e3 || !t3) {
      var d2 = m2(e3), h3 = d2.dist, g3 = d2.dur;
      if (g3 = c2(g3), h3 *= r2, t3) {
        var x2 = i3.idxToDist(i3.distToIdx(h3), true);
        x2 && (h3 = x2);
      }
      s3.push({ distance: h3, duration: g3, easing: p2 });
      var k2 = u3.position, y2 = k2 + h3;
      if (y2 < a2 || y2 > o2) {
        var w = y2 < a2 ? a2 - k2 : o2 - k2, M = 0, T = e3;
        if (l(w) === r2) {
          var C = Math.min(Math.abs(w) / Math.abs(h3), 1), E = function(n3) {
            return 1 - Math.pow(1 - n3, 1 / 3);
          }(C) * g3;
          s3[0].earlyExit = E, T = e3 * (1 - C);
        } else
          s3[0].earlyExit = 0, M += w;
        var z = m2(T, 100), I = z.dist * r2;
        n2.options.rubberband && (s3.push({ distance: I, duration: c2(z.dur), easing: p2 }), s3.push({ distance: -I + M, duration: 500, easing: p2 }));
      }
      n2.animator.start(s3);
    } else
      n2.moveToIdx(f2(u3.abs), true, { duration: 500, easing: function(n3) {
        return 1 + --n3 * n3 * n3 * n3 * n3;
      } });
  }
  function m2(n3, t3) {
    void 0 === t3 && (t3 = 1e3);
    var i3 = 147e-9 + (n3 = Math.abs(n3)) / t3;
    return { dist: Math.pow(n3, 2) / i3, dur: n3 / i3 };
  }
  function g2() {
    var t3 = n2.track.details;
    t3 && (a2 = t3.min, o2 = t3.max, u2 = t3.minIdx, s2 = t3.maxIdx);
  }
  function b2() {
    n2.animator.stop();
  }
  n2.on("updated", g2), n2.on("optionsChanged", g2), n2.on("created", g2), n2.on("dragStarted", function() {
    e2 = false, b2(), t2 = i2 = n2.track.details.abs;
  }), n2.on("dragChecked", function() {
    e2 = true;
  }), n2.on("dragEnded", function() {
    var e3 = n2.options.mode;
    "snap" === e3 && function() {
      var e4 = n2.track, r3 = n2.track.details, u3 = r3.position, s3 = l(v2());
      (u3 > o2 || u3 < a2) && (s3 = 0);
      var c3 = t2 + s3;
      0 === r3.slides[e4.absToRel(c3)].portion && (c3 -= s3), t2 !== i2 && (c3 = i2), l(e4.idxToDist(c3, true)) !== s3 && (c3 += s3), c3 = f2(c3);
      var d2 = e4.idxToDist(c3, true);
      n2.animator.start([{ distance: d2, duration: 500, easing: function(n3) {
        return 1 + --n3 * n3 * n3 * n3 * n3;
      } }]);
    }(), "free" !== e3 && "free-snap" !== e3 || h2();
  }), n2.on("dragged", function() {
    i2 = n2.track.details.abs;
  });
}
function b(n2) {
  var t2, i2, e2, r2, a2, f2, p2, v2, h2, m2, g2, b2, x2, k2, y2, w, M, T, C = c();
  function E(t3) {
    if (f2 && v2 === t3.id) {
      var o2 = D(t3);
      if (h2) {
        if (!A(t3))
          return I(t3);
        m2 = o2, h2 = false, n2.emit("dragChecked");
      }
      if (w)
        return m2 = o2;
      u(t3);
      var c2 = function(t4) {
        if (M === -1 / 0 && T === 1 / 0)
          return t4;
        var e3 = n2.track.details, o3 = e3.length, u2 = e3.position, s2 = d(t4, M - u2, T - u2);
        if (0 === o3)
          return 0;
        if (!n2.options.rubberband)
          return s2;
        if (u2 <= T && u2 >= M)
          return t4;
        if (u2 < M && i2 > 0 || u2 > T && i2 < 0)
          return t4;
        var c3 = (u2 < M ? u2 - M : u2 - T) / o3, l2 = r2 * o3, f3 = Math.abs(c3 * l2), p3 = Math.max(0, 1 - f3 / a2 * 2);
        return p3 * p3 * t4;
      }(p2(m2 - o2) / r2 * e2);
      i2 = l(c2);
      var x3 = n2.track.details.position;
      (x3 > M && x3 < T || x3 === M && i2 > 0 || x3 === T && i2 < 0) && s(t3), g2 += c2, !b2 && Math.abs(g2 * r2) > 5 && (b2 = true), n2.track.add(c2), m2 = o2, n2.emit("dragged");
    }
  }
  function z(t3) {
    !f2 && n2.track.details && n2.track.details.length && (g2 = 0, f2 = true, b2 = false, h2 = true, v2 = t3.id, A(t3), m2 = D(t3), n2.emit("dragStarted"));
  }
  function I(t3) {
    f2 && v2 === t3.idChanged && (f2 = false, n2.emit("dragEnded"));
  }
  function A(n3) {
    var t3 = L(), i3 = t3 ? n3.y : n3.x, e3 = t3 ? n3.x : n3.y, r3 = void 0 !== x2 && void 0 !== k2 && Math.abs(k2 - e3) <= Math.abs(x2 - i3);
    return x2 = i3, k2 = e3, r3;
  }
  function D(n3) {
    return L() ? n3.y : n3.x;
  }
  function L() {
    return n2.options.vertical;
  }
  function S() {
    r2 = n2.size, a2 = L() ? window.innerHeight : window.innerWidth;
    var t3 = n2.track.details;
    t3 && (M = t3.min, T = t3.max);
  }
  function O(n3) {
    b2 && (s(n3), u(n3));
  }
  function _() {
    if (C.purge(), n2.options.drag && !n2.options.disabled) {
      var i3;
      i3 = n2.options.dragSpeed || 1, p2 = "function" == typeof i3 ? i3 : function(n3) {
        return n3 * i3;
      }, e2 = n2.options.rtl ? -1 : 1, S(), t2 = n2.container, function() {
        var n3 = "data-keen-slider-clickable";
        o("[".concat(n3, "]:not([").concat(n3, "=false])"), t2).map(function(n4) {
          C.add(n4, "dragstart", s), C.add(n4, "mousedown", s), C.add(n4, "touchstart", s);
        });
      }(), C.add(t2, "dragstart", function(n3) {
        u(n3);
      }), C.add(t2, "click", O, { capture: true }), C.input(t2, "ksDragStart", z), C.input(t2, "ksDrag", E), C.input(t2, "ksDragEnd", I), C.input(t2, "mousedown", z), C.input(t2, "mousemove", E), C.input(t2, "mouseleave", I), C.input(t2, "mouseup", I), C.input(t2, "touchstart", z, { passive: true }), C.input(t2, "touchmove", E, { passive: false }), C.input(t2, "touchend", I), C.input(t2, "touchcancel", I), C.add(window, "wheel", function(n3) {
        f2 && u(n3);
      });
      var r3 = "data-keen-slider-scrollable";
      o("[".concat(r3, "]:not([").concat(r3, "=false])"), n2.container).map(function(n3) {
        return function(n4) {
          var t3;
          C.input(n4, "touchstart", function(n5) {
            t3 = D(n5), w = true, y2 = true;
          }, { passive: true }), C.input(n4, "touchmove", function(i4) {
            var e3 = L(), r4 = e3 ? n4.scrollHeight - n4.clientHeight : n4.scrollWidth - n4.clientWidth, a3 = t3 - D(i4), o2 = e3 ? n4.scrollTop : n4.scrollLeft, s2 = e3 && "scroll" === n4.style.overflowY || !e3 && "scroll" === n4.style.overflowX;
            if (t3 = D(i4), (a3 < 0 && o2 > 0 || a3 > 0 && o2 < r4) && y2 && s2)
              return w = true;
            y2 = false, u(i4), w = false;
          }), C.input(n4, "touchend", function() {
            w = false;
          });
        }(n3);
      });
    }
  }
  n2.on("updated", S), n2.on("optionsChanged", _), n2.on("created", _), n2.on("destroyed", C.purge);
}
function x(n2) {
  var t2, i2, e2 = null;
  function r2(t3, i3, e3) {
    n2.animator.active ? o2(t3, i3, e3) : requestAnimationFrame(function() {
      return o2(t3, i3, e3);
    });
  }
  function a2() {
    r2(false, false, i2);
  }
  function o2(i3, r3, a3) {
    var o3 = 0, u3 = n2.size, d3 = n2.track.details;
    if (d3 && t2) {
      var l3 = d3.slides;
      t2.forEach(function(n3, t3) {
        if (i3)
          !e2 && r3 && s2(n3, null, a3), c2(n3, null, a3);
        else {
          if (!l3[t3])
            return;
          var d4 = l3[t3].size * u3;
          !e2 && r3 && s2(n3, d4, a3), c2(n3, l3[t3].distance * u3 - o3, a3), o3 += d4;
        }
      });
    }
  }
  function u2(t3) {
    return "performance" === n2.options.renderMode ? Math.round(t3) : t3;
  }
  function s2(n3, t3, i3) {
    var e3 = i3 ? "height" : "width";
    null !== t3 && (t3 = u2(t3) + "px"), n3.style["min-" + e3] = t3, n3.style["max-" + e3] = t3;
  }
  function c2(n3, t3, i3) {
    if (null !== t3) {
      t3 = u2(t3);
      var e3 = i3 ? t3 : 0;
      t3 = "translate3d(".concat(i3 ? 0 : t3, "px, ").concat(e3, "px, 0)");
    }
    n3.style.transform = t3, n3.style["-webkit-transform"] = t3;
  }
  function d2() {
    t2 && (o2(true, true, i2), t2 = null), n2.on("detailsChanged", a2, true);
  }
  function l2() {
    r2(false, true, i2);
  }
  function f2() {
    d2(), i2 = n2.options.vertical, n2.options.disabled || "custom" === n2.options.renderMode || (e2 = "auto" === p(n2.options.slides, "perView", null), n2.on("detailsChanged", a2), (t2 = n2.slides).length && l2());
  }
  n2.on("created", f2), n2.on("optionsChanged", f2), n2.on("beforeOptionsChanged", function() {
    d2();
  }), n2.on("updated", l2), n2.on("destroyed", d2);
}
function k(t2, i2) {
  return function(e2) {
    var r2, u2, s2, d2, l2, v2, h2 = c();
    function m2(n2) {
      var t3;
      a(e2.container, "reverse", "rtl" !== (t3 = e2.container, window.getComputedStyle(t3, null).getPropertyValue("direction")) || n2 ? null : ""), a(e2.container, "v", e2.options.vertical && !n2 ? "" : null), a(e2.container, "disabled", e2.options.disabled && !n2 ? "" : null);
    }
    function g2() {
      b2() && M();
    }
    function b2() {
      var t3 = null;
      if (d2.forEach(function(n2) {
        n2.matches && (t3 = n2.__media);
      }), t3 === r2)
        return false;
      r2 || e2.emit("beforeOptionsChanged"), r2 = t3;
      var i3 = t3 ? s2.breakpoints[t3] : s2;
      return e2.options = n(n({}, s2), i3), m2(), I(), A(), C(), true;
    }
    function x2(n2) {
      var t3 = f(n2);
      return (e2.options.vertical ? t3.height : t3.width) / e2.size || 1;
    }
    function k2() {
      return e2.options.trackConfig.length;
    }
    function y2(t3) {
      for (var a2 in r2 = false, s2 = n(n({}, i2), t3), h2.purge(), u2 = e2.size, d2 = [], s2.breakpoints || []) {
        var o2 = window.matchMedia(a2);
        o2.__media = a2, d2.push(o2), h2.add(o2, "change", g2);
      }
      h2.add(window, "orientationchange", z), h2.add(window, "resize", E), b2();
    }
    function w(n2) {
      e2.animator.stop();
      var t3 = e2.track.details;
      e2.track.init(null != n2 ? n2 : t3 ? t3.abs : 0);
    }
    function M(n2) {
      w(n2), e2.emit("optionsChanged");
    }
    function T(n2, t3) {
      if (n2)
        return y2(n2), void M(t3);
      I(), A();
      var i3 = k2();
      C(), k2() !== i3 ? M(t3) : w(t3), e2.emit("updated");
    }
    function C() {
      var n2 = e2.options.slides;
      if ("function" == typeof n2)
        return e2.options.trackConfig = n2(e2.size, e2.slides);
      for (var t3 = e2.slides, i3 = t3.length, r3 = "number" == typeof n2 ? n2 : p(n2, "number", i3, true), a2 = [], o2 = p(n2, "perView", 1, true), u3 = p(n2, "spacing", 0, true) / e2.size || 0, s3 = "auto" === o2 ? u3 : u3 / o2, c2 = p(n2, "origin", "auto"), d3 = 0, l3 = 0; l3 < r3; l3++) {
        var f2 = "auto" === o2 ? x2(t3[l3]) : 1 / o2 - u3 + s3, v3 = "center" === c2 ? 0.5 - f2 / 2 : "auto" === c2 ? 0 : c2;
        a2.push({ origin: v3, size: f2, spacing: u3 }), d3 += f2;
      }
      if (d3 += u3 * (r3 - 1), "auto" === c2 && !e2.options.loop && 1 !== o2) {
        var h3 = 0;
        a2.map(function(n3) {
          var t4 = d3 - h3;
          return h3 += n3.size + u3, t4 >= 1 || (n3.origin = 1 - t4 - (d3 > 1 ? 0 : 1 - d3)), n3;
        });
      }
      e2.options.trackConfig = a2;
    }
    function E() {
      I();
      var n2 = e2.size;
      e2.options.disabled || n2 === u2 || (u2 = n2, T());
    }
    function z() {
      E(), setTimeout(E, 500), setTimeout(E, 2e3);
    }
    function I() {
      var n2 = f(e2.container);
      e2.size = (e2.options.vertical ? n2.height : n2.width) || 1;
    }
    function A() {
      e2.slides = o(e2.options.selector, e2.container);
    }
    e2.container = (v2 = o(t2, l2 || document)).length ? v2[0] : null, e2.destroy = function() {
      h2.purge(), e2.emit("destroyed"), m2(true);
    }, e2.prev = function() {
      e2.moveToIdx(e2.track.details.abs - 1, true);
    }, e2.next = function() {
      e2.moveToIdx(e2.track.details.abs + 1, true);
    }, e2.update = T, y2(e2.options);
  };
}
var y = function(n2, i2, e2) {
  try {
    return function(n3, t2) {
      var i3, e3 = {};
      return i3 = { emit: function(n4) {
        e3[n4] && e3[n4].forEach(function(n5) {
          n5(i3);
        });
        var t3 = i3.options && i3.options[n4];
        t3 && t3(i3);
      }, moveToIdx: function(n4, t3, e4) {
        var r2 = i3.track.idxToDist(n4, t3);
        if (r2) {
          var a2 = i3.options.defaultAnimation;
          i3.animator.start([{ distance: r2, duration: p(e4 || a2, "duration", 500), easing: p(e4 || a2, "easing", function(n5) {
            return 1 + --n5 * n5 * n5 * n5 * n5;
          }) }]);
        }
      }, on: function(n4, t3, i4) {
        void 0 === i4 && (i4 = false), e3[n4] || (e3[n4] = []);
        var r2 = e3[n4].indexOf(t3);
        r2 > -1 ? i4 && delete e3[n4][r2] : i4 || e3[n4].push(t3);
      }, options: n3 }, function() {
        if (i3.track = m(i3), i3.animator = h(i3), t2)
          for (var n4 = 0, e4 = t2; n4 < e4.length; n4++)
            (0, e4[n4])(i3);
        i3.track.init(i3.options.initial || 0), i3.emit("created");
      }(), i3;
    }(i2, t([k(n2, { drag: true, mode: "snap", renderMode: "precision", rubberband: true, selector: ".keen-slider__slide" }), x, b, g], e2 || [], true));
  } catch (n3) {
    console.error(n3);
  }
};

// _src/scripts/components/keen-slider.js
var SliderComponent = class extends HTMLElement {
  constructor() {
    super();
    const config = JSON.parse(this.getAttribute("slider-config"));
    console.log("config", config);
    this.useNavigation = this.getAttribute("navigation");
    this.useAutoPlay = this.getAttribute("autoplay");
    this.lazyload = this.getAttribute("lazyload");
    if (Shopify.designMode) {
      console.log("DEISNG MODE");
      document.addEventListener("shopify:section:load", () => {
        var slider2 = new y(this, config, plugins);
      });
    }
    const plugins = [
      this.navigation,
      this.resizePlugin,
      this.autoPlay,
      this.setActiveSlide
    ];
    if (this.lazyload === false || this.lazyload === "false") {
      console.log("LAZYLOAD FALSE");
      var slider = new y(this, config, plugins);
    } else {
      const handleIntersection = (entries, observer) => {
        if (!entries[0].isIntersecting)
          return;
        observer.unobserve(this);
        var slider2 = new y(this, config, plugins);
      };
      new IntersectionObserver(handleIntersection.bind(this), {
        rootMargin: "0px 0px 100px 0px"
      }).observe(this);
    }
  }
  connectedCallback() {
  }
  setActiveSlide(slider) {
    slider.on("created", (slide2) => {
      slide2.slides[0].setAttribute("is-active", "");
    });
    slider.on("slideChanged", (slide2) => {
      const currentSlide = slide2.track.details.rel;
      slide2.slides.forEach((s2) => {
        s2.removeAttribute("is-active");
        if (s2.querySelector("lazy-slide-video")) {
          s2.querySelector("lazy-slide-video").removeAttribute("is-active");
        }
      });
      slide2.slides[currentSlide].setAttribute("is-active", "");
      if (slide2.slides[currentSlide].querySelector("lazy-slide-video")) {
        slide2.slides[currentSlide].querySelector("lazy-slide-video").setAttribute("is-active", "");
      }
    });
  }
  resizePlugin(slider) {
    const observer = new ResizeObserver(function() {
      slider.update();
    });
    slider.on("created", () => {
      observer.observe(slider.container);
    });
    slider.on("destroyed", () => {
      observer.unobserve(slider.container);
    });
  }
  navigation(slider) {
    console.log("slider", slider);
    if (!slider.container.getAttribute("navigation"))
      return;
    const navigationConfig = slider.container.getAttribute("navigation");
    const arrowLeft = slider.container.querySelector("[arrow-left]");
    const arrowRight = slider.container.querySelector("[arrow-right]");
    const dotsWrapper = slider.container.querySelector(".dots");
    slider.on("created", () => {
      if (navigationConfig === "arrows" || navigationConfig == "full") {
        console.log("arrowLeft", arrowLeft);
        arrowLeft.addEventListener("click", () => {
          slider.prev();
        });
        arrowRight.addEventListener("click", () => {
          slider.next();
        });
      }
      if (navigationConfig == "dots" || navigationConfig == "full") {
        const slides = slider.track.details.slides.length - Math.round(slider.options.slides.perView);
        console.log(
          "DOTS (slider.track.details.slides",
          slider.track.details.slides
        );
        slider.track.details.slides.forEach((_e, idx) => {
          console.log("_e", _e);
          if (Math.round(slider.options.slides.perView) > 1) {
            if (idx !== slider.track.details.slides.length - 1) {
              var dot = document.createElement("button");
              dot.classList.add("dot");
              dot.setAttribute("aria-label", "Slide " + (idx + 1));
              dotsWrapper.appendChild(dot);
              dot.addEventListener("click", () => slider.moveToIdx(idx));
            }
          } else {
            var dot = document.createElement("button");
            dot.classList.add("dot");
            dot.setAttribute("aria-label", "Slide " + (idx + 1));
            dotsWrapper.appendChild(dot);
            dot.addEventListener("click", () => slider.moveToIdx(idx));
          }
        });
      }
      updateClasses(slider);
    });
    slider.on("optionsChanged", () => {
      updateClasses();
    });
    slider.on("slideChanged", () => {
      updateClasses();
    });
    function updateClasses() {
      var slide2 = slider.track.details.rel;
      console.log("slide", slide2);
      if (navigationConfig === "arrows" || navigationConfig == "full") {
        slide2 === 0 ? arrowLeft.classList.add("arrow--disabled") : arrowLeft.classList.remove("arrow--disabled");
        slide2 === slider.track.details.slides.length - Math.round(slider.options.slides.perView) ? arrowRight.classList.add("arrow--disabled") : arrowRight.classList.remove("arrow--disabled");
      }
      console.log("dots.children");
      if (navigationConfig == "dots" || navigationConfig == "full") {
        const dots = slider.container.querySelector(".dots");
        console.log("dotschildren", dots.children);
        Array.from(dots.children).forEach((dot, idx) => {
          idx === slide2 ? dot.classList.add("dot--active") : dot.classList.remove("dot--active");
        });
      }
    }
  }
  autoPlay(slider) {
    if (!slider.container.getAttribute("autoplay"))
      return;
    let timeout;
    let mouseOver = false;
    console.log("slider", slider);
    const autoplayInterval = slider.container.getAttribute("autoplay") * 1e3;
    console.log("autoplayInterval", autoplayInterval);
    function clearNextTimeout() {
      clearTimeout(timeout);
    }
    function nextTimeout() {
      clearTimeout(timeout);
      if (mouseOver)
        return;
      timeout = setTimeout(() => {
        slider.next();
      }, autoplayInterval);
    }
    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => {
        mouseOver = true;
        clearNextTimeout();
      });
      slider.container.addEventListener("mouseout", () => {
        mouseOver = false;
        nextTimeout();
      });
      nextTimeout();
    });
    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  }
};
window.customElements.define("keen-slider", SliderComponent);

// node_modules/swiper/shared/ssr-window.esm.mjs
function isObject(obj) {
  return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
}
function extend(target, src) {
  if (target === void 0) {
    target = {};
  }
  if (src === void 0) {
    src = {};
  }
  Object.keys(src).forEach((key) => {
    if (typeof target[key] === "undefined")
      target[key] = src[key];
    else if (isObject(src[key]) && isObject(target[key]) && Object.keys(src[key]).length > 0) {
      extend(target[key], src[key]);
    }
  });
}
var ssrDocument = {
  body: {},
  addEventListener() {
  },
  removeEventListener() {
  },
  activeElement: {
    blur() {
    },
    nodeName: ""
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
  getElementById() {
    return null;
  },
  createEvent() {
    return {
      initEvent() {
      }
    };
  },
  createElement() {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {
      },
      getElementsByTagName() {
        return [];
      }
    };
  },
  createElementNS() {
    return {};
  },
  importNode() {
    return null;
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  }
};
function getDocument() {
  const doc = typeof document !== "undefined" ? document : {};
  extend(doc, ssrDocument);
  return doc;
}
var ssrWindow = {
  document: ssrDocument,
  navigator: {
    userAgent: ""
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  },
  history: {
    replaceState() {
    },
    pushState() {
    },
    go() {
    },
    back() {
    }
  },
  CustomEvent: function CustomEvent2() {
    return this;
  },
  addEventListener() {
  },
  removeEventListener() {
  },
  getComputedStyle() {
    return {
      getPropertyValue() {
        return "";
      }
    };
  },
  Image() {
  },
  Date() {
  },
  screen: {},
  setTimeout() {
  },
  clearTimeout() {
  },
  matchMedia() {
    return {};
  },
  requestAnimationFrame(callback) {
    if (typeof setTimeout === "undefined") {
      callback();
      return null;
    }
    return setTimeout(callback, 0);
  },
  cancelAnimationFrame(id) {
    if (typeof setTimeout === "undefined") {
      return;
    }
    clearTimeout(id);
  }
};
function getWindow() {
  const win = typeof window !== "undefined" ? window : {};
  extend(win, ssrWindow);
  return win;
}

// node_modules/swiper/shared/utils.mjs
function deleteProps(obj) {
  const object = obj;
  Object.keys(object).forEach((key) => {
    try {
      object[key] = null;
    } catch (e2) {
    }
    try {
      delete object[key];
    } catch (e2) {
    }
  });
}
function nextTick(callback, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  return setTimeout(callback, delay);
}
function now() {
  return Date.now();
}
function getComputedStyle2(el) {
  const window2 = getWindow();
  let style;
  if (window2.getComputedStyle) {
    style = window2.getComputedStyle(el, null);
  }
  if (!style && el.currentStyle) {
    style = el.currentStyle;
  }
  if (!style) {
    style = el.style;
  }
  return style;
}
function getTranslate(el, axis) {
  if (axis === void 0) {
    axis = "x";
  }
  const window2 = getWindow();
  let matrix;
  let curTransform;
  let transformMatrix;
  const curStyle = getComputedStyle2(el);
  if (window2.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;
    if (curTransform.split(",").length > 6) {
      curTransform = curTransform.split(", ").map((a2) => a2.replace(",", ".")).join(", ");
    }
    transformMatrix = new window2.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
    matrix = transformMatrix.toString().split(",");
  }
  if (axis === "x") {
    if (window2.WebKitCSSMatrix)
      curTransform = transformMatrix.m41;
    else if (matrix.length === 16)
      curTransform = parseFloat(matrix[12]);
    else
      curTransform = parseFloat(matrix[4]);
  }
  if (axis === "y") {
    if (window2.WebKitCSSMatrix)
      curTransform = transformMatrix.m42;
    else if (matrix.length === 16)
      curTransform = parseFloat(matrix[13]);
    else
      curTransform = parseFloat(matrix[5]);
  }
  return curTransform || 0;
}
function isObject2(o2) {
  return typeof o2 === "object" && o2 !== null && o2.constructor && Object.prototype.toString.call(o2).slice(8, -1) === "Object";
}
function isNode(node) {
  if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") {
    return node instanceof HTMLElement;
  }
  return node && (node.nodeType === 1 || node.nodeType === 11);
}
function extend2() {
  const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
  const noExtend = ["__proto__", "constructor", "prototype"];
  for (let i2 = 1; i2 < arguments.length; i2 += 1) {
    const nextSource = i2 < 0 || arguments.length <= i2 ? void 0 : arguments[i2];
    if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
      const keysArray = Object.keys(Object(nextSource)).filter((key) => noExtend.indexOf(key) < 0);
      for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
        const nextKey = keysArray[nextIndex];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== void 0 && desc.enumerable) {
          if (isObject2(to[nextKey]) && isObject2(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend2(to[nextKey], nextSource[nextKey]);
            }
          } else if (!isObject2(to[nextKey]) && isObject2(nextSource[nextKey])) {
            to[nextKey] = {};
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend2(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }
  return to;
}
function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue);
}
function animateCSSModeScroll(_ref) {
  let {
    swiper,
    targetPosition,
    side
  } = _ref;
  const window2 = getWindow();
  const startPosition = -swiper.translate;
  let startTime = null;
  let time;
  const duration = swiper.params.speed;
  swiper.wrapperEl.style.scrollSnapType = "none";
  window2.cancelAnimationFrame(swiper.cssModeFrameID);
  const dir = targetPosition > startPosition ? "next" : "prev";
  const isOutOfBound = (current, target) => {
    return dir === "next" && current >= target || dir === "prev" && current <= target;
  };
  const animate = () => {
    time = (/* @__PURE__ */ new Date()).getTime();
    if (startTime === null) {
      startTime = time;
    }
    const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
    if (isOutOfBound(currentPosition, targetPosition)) {
      currentPosition = targetPosition;
    }
    swiper.wrapperEl.scrollTo({
      [side]: currentPosition
    });
    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper.wrapperEl.style.overflow = "hidden";
      swiper.wrapperEl.style.scrollSnapType = "";
      setTimeout(() => {
        swiper.wrapperEl.style.overflow = "";
        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });
      });
      window2.cancelAnimationFrame(swiper.cssModeFrameID);
      return;
    }
    swiper.cssModeFrameID = window2.requestAnimationFrame(animate);
  };
  animate();
}
function elementChildren(element, selector) {
  if (selector === void 0) {
    selector = "";
  }
  return [...element.children].filter((el) => el.matches(selector));
}
function createElement(tag, classes2) {
  if (classes2 === void 0) {
    classes2 = [];
  }
  const el = document.createElement(tag);
  el.classList.add(...Array.isArray(classes2) ? classes2 : [classes2]);
  return el;
}
function elementOffset(el) {
  const window2 = getWindow();
  const document2 = getDocument();
  const box = el.getBoundingClientRect();
  const body = document2.body;
  const clientTop = el.clientTop || body.clientTop || 0;
  const clientLeft = el.clientLeft || body.clientLeft || 0;
  const scrollTop = el === window2 ? window2.scrollY : el.scrollTop;
  const scrollLeft = el === window2 ? window2.scrollX : el.scrollLeft;
  return {
    top: box.top + scrollTop - clientTop,
    left: box.left + scrollLeft - clientLeft
  };
}
function elementPrevAll(el, selector) {
  const prevEls = [];
  while (el.previousElementSibling) {
    const prev = el.previousElementSibling;
    if (selector) {
      if (prev.matches(selector))
        prevEls.push(prev);
    } else
      prevEls.push(prev);
    el = prev;
  }
  return prevEls;
}
function elementNextAll(el, selector) {
  const nextEls = [];
  while (el.nextElementSibling) {
    const next = el.nextElementSibling;
    if (selector) {
      if (next.matches(selector))
        nextEls.push(next);
    } else
      nextEls.push(next);
    el = next;
  }
  return nextEls;
}
function elementStyle(el, prop) {
  const window2 = getWindow();
  return window2.getComputedStyle(el, null).getPropertyValue(prop);
}
function elementIndex(el) {
  let child = el;
  let i2;
  if (child) {
    i2 = 0;
    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1)
        i2 += 1;
    }
    return i2;
  }
  return void 0;
}
function elementParents(el, selector) {
  const parents = [];
  let parent = el.parentElement;
  while (parent) {
    if (selector) {
      if (parent.matches(selector))
        parents.push(parent);
    } else {
      parents.push(parent);
    }
    parent = parent.parentElement;
  }
  return parents;
}
function elementOuterSize(el, size, includeMargins) {
  const window2 = getWindow();
  if (includeMargins) {
    return el[size === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-right" : "margin-top")) + parseFloat(window2.getComputedStyle(el, null).getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"));
  }
  return el.offsetWidth;
}

// node_modules/swiper/shared/swiper-core.mjs
var support;
function calcSupport() {
  const window2 = getWindow();
  const document2 = getDocument();
  return {
    smoothScroll: document2.documentElement && document2.documentElement.style && "scrollBehavior" in document2.documentElement.style,
    touch: !!("ontouchstart" in window2 || window2.DocumentTouch && document2 instanceof window2.DocumentTouch)
  };
}
function getSupport() {
  if (!support) {
    support = calcSupport();
  }
  return support;
}
var deviceCached;
function calcDevice(_temp) {
  let {
    userAgent
  } = _temp === void 0 ? {} : _temp;
  const support2 = getSupport();
  const window2 = getWindow();
  const platform = window2.navigator.platform;
  const ua = userAgent || window2.navigator.userAgent;
  const device = {
    ios: false,
    android: false
  };
  const screenWidth = window2.screen.width;
  const screenHeight = window2.screen.height;
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const windows = platform === "Win32";
  let macos = platform === "MacIntel";
  const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
  if (!ipad && macos && support2.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad)
      ipad = [0, 1, "13_0_0"];
    macos = false;
  }
  if (android && !windows) {
    device.os = "android";
    device.android = true;
  }
  if (ipad || iphone || ipod) {
    device.os = "ios";
    device.ios = true;
  }
  return device;
}
function getDevice(overrides) {
  if (overrides === void 0) {
    overrides = {};
  }
  if (!deviceCached) {
    deviceCached = calcDevice(overrides);
  }
  return deviceCached;
}
var browser;
function calcBrowser() {
  const window2 = getWindow();
  let needPerspectiveFix = false;
  function isSafari() {
    const ua = window2.navigator.userAgent.toLowerCase();
    return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
  }
  if (isSafari()) {
    const ua = String(window2.navigator.userAgent);
    if (ua.includes("Version/")) {
      const [major, minor] = ua.split("Version/")[1].split(" ")[0].split(".").map((num) => Number(num));
      needPerspectiveFix = major < 16 || major === 16 && minor < 2;
    }
  }
  return {
    isSafari: needPerspectiveFix || isSafari(),
    needPerspectiveFix,
    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window2.navigator.userAgent)
  };
}
function getBrowser() {
  if (!browser) {
    browser = calcBrowser();
  }
  return browser;
}
function Resize(_ref) {
  let {
    swiper,
    on,
    emit
  } = _ref;
  const window2 = getWindow();
  let observer = null;
  let animationFrame = null;
  const resizeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized)
      return;
    emit("beforeResize");
    emit("resize");
  };
  const createObserver = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized)
      return;
    observer = new ResizeObserver((entries) => {
      animationFrame = window2.requestAnimationFrame(() => {
        const {
          width,
          height
        } = swiper;
        let newWidth = width;
        let newHeight = height;
        entries.forEach((_ref2) => {
          let {
            contentBoxSize,
            contentRect,
            target
          } = _ref2;
          if (target && target !== swiper.el)
            return;
          newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
        });
        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
    });
    observer.observe(swiper.el);
  };
  const removeObserver = () => {
    if (animationFrame) {
      window2.cancelAnimationFrame(animationFrame);
    }
    if (observer && observer.unobserve && swiper.el) {
      observer.unobserve(swiper.el);
      observer = null;
    }
  };
  const orientationChangeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized)
      return;
    emit("orientationchange");
  };
  on("init", () => {
    if (swiper.params.resizeObserver && typeof window2.ResizeObserver !== "undefined") {
      createObserver();
      return;
    }
    window2.addEventListener("resize", resizeHandler);
    window2.addEventListener("orientationchange", orientationChangeHandler);
  });
  on("destroy", () => {
    removeObserver();
    window2.removeEventListener("resize", resizeHandler);
    window2.removeEventListener("orientationchange", orientationChangeHandler);
  });
}
function Observer(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const observers = [];
  const window2 = getWindow();
  const attach = function(target, options) {
    if (options === void 0) {
      options = {};
    }
    const ObserverFunc = window2.MutationObserver || window2.WebkitMutationObserver;
    const observer = new ObserverFunc((mutations) => {
      if (swiper.__preventObserver__)
        return;
      if (mutations.length === 1) {
        emit("observerUpdate", mutations[0]);
        return;
      }
      const observerUpdate = function observerUpdate2() {
        emit("observerUpdate", mutations[0]);
      };
      if (window2.requestAnimationFrame) {
        window2.requestAnimationFrame(observerUpdate);
      } else {
        window2.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes: typeof options.attributes === "undefined" ? true : options.attributes,
      childList: typeof options.childList === "undefined" ? true : options.childList,
      characterData: typeof options.characterData === "undefined" ? true : options.characterData
    });
    observers.push(observer);
  };
  const init = () => {
    if (!swiper.params.observer)
      return;
    if (swiper.params.observeParents) {
      const containerParents = elementParents(swiper.el);
      for (let i2 = 0; i2 < containerParents.length; i2 += 1) {
        attach(containerParents[i2]);
      }
    }
    attach(swiper.el, {
      childList: swiper.params.observeSlideChildren
    });
    attach(swiper.wrapperEl, {
      attributes: false
    });
  };
  const destroy = () => {
    observers.forEach((observer) => {
      observer.disconnect();
    });
    observers.splice(0, observers.length);
  };
  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  });
  on("init", init);
  on("destroy", destroy);
}
var eventsEmitter = {
  on(events2, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed)
      return self;
    if (typeof handler !== "function")
      return self;
    const method = priority ? "unshift" : "push";
    events2.split(" ").forEach((event2) => {
      if (!self.eventsListeners[event2])
        self.eventsListeners[event2] = [];
      self.eventsListeners[event2][method](handler);
    });
    return self;
  },
  once(events2, handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed)
      return self;
    if (typeof handler !== "function")
      return self;
    function onceHandler() {
      self.off(events2, onceHandler);
      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      handler.apply(self, args);
    }
    onceHandler.__emitterProxy = handler;
    return self.on(events2, onceHandler, priority);
  },
  onAny(handler, priority) {
    const self = this;
    if (!self.eventsListeners || self.destroyed)
      return self;
    if (typeof handler !== "function")
      return self;
    const method = priority ? "unshift" : "push";
    if (self.eventsAnyListeners.indexOf(handler) < 0) {
      self.eventsAnyListeners[method](handler);
    }
    return self;
  },
  offAny(handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed)
      return self;
    if (!self.eventsAnyListeners)
      return self;
    const index = self.eventsAnyListeners.indexOf(handler);
    if (index >= 0) {
      self.eventsAnyListeners.splice(index, 1);
    }
    return self;
  },
  off(events2, handler) {
    const self = this;
    if (!self.eventsListeners || self.destroyed)
      return self;
    if (!self.eventsListeners)
      return self;
    events2.split(" ").forEach((event2) => {
      if (typeof handler === "undefined") {
        self.eventsListeners[event2] = [];
      } else if (self.eventsListeners[event2]) {
        self.eventsListeners[event2].forEach((eventHandler, index) => {
          if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
            self.eventsListeners[event2].splice(index, 1);
          }
        });
      }
    });
    return self;
  },
  emit() {
    const self = this;
    if (!self.eventsListeners || self.destroyed)
      return self;
    if (!self.eventsListeners)
      return self;
    let events2;
    let data;
    let context;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    if (typeof args[0] === "string" || Array.isArray(args[0])) {
      events2 = args[0];
      data = args.slice(1, args.length);
      context = self;
    } else {
      events2 = args[0].events;
      data = args[0].data;
      context = args[0].context || self;
    }
    data.unshift(context);
    const eventsArray = Array.isArray(events2) ? events2 : events2.split(" ");
    eventsArray.forEach((event2) => {
      if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
        self.eventsAnyListeners.forEach((eventHandler) => {
          eventHandler.apply(context, [event2, ...data]);
        });
      }
      if (self.eventsListeners && self.eventsListeners[event2]) {
        self.eventsListeners[event2].forEach((eventHandler) => {
          eventHandler.apply(context, data);
        });
      }
    });
    return self;
  }
};
function updateSize() {
  const swiper = this;
  let width;
  let height;
  const el = swiper.el;
  if (typeof swiper.params.width !== "undefined" && swiper.params.width !== null) {
    width = swiper.params.width;
  } else {
    width = el.clientWidth;
  }
  if (typeof swiper.params.height !== "undefined" && swiper.params.height !== null) {
    height = swiper.params.height;
  } else {
    height = el.clientHeight;
  }
  if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
    return;
  }
  width = width - parseInt(elementStyle(el, "padding-left") || 0, 10) - parseInt(elementStyle(el, "padding-right") || 0, 10);
  height = height - parseInt(elementStyle(el, "padding-top") || 0, 10) - parseInt(elementStyle(el, "padding-bottom") || 0, 10);
  if (Number.isNaN(width))
    width = 0;
  if (Number.isNaN(height))
    height = 0;
  Object.assign(swiper, {
    width,
    height,
    size: swiper.isHorizontal() ? width : height
  });
}
function updateSlides() {
  const swiper = this;
  function getDirectionLabel(property) {
    if (swiper.isHorizontal()) {
      return property;
    }
    return {
      "width": "height",
      "margin-top": "margin-left",
      "margin-bottom ": "margin-right",
      "margin-left": "margin-top",
      "margin-right": "margin-bottom",
      "padding-left": "padding-top",
      "padding-right": "padding-bottom",
      "marginRight": "marginBottom"
    }[property];
  }
  function getDirectionPropertyValue(node, label) {
    return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
  }
  const params = swiper.params;
  const {
    wrapperEl,
    slidesEl,
    size: swiperSize,
    rtlTranslate: rtl,
    wrongRTL
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
  const slides = elementChildren(slidesEl, `.${swiper.params.slideClass}, swiper-slide`);
  const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
  let snapGrid = [];
  const slidesGrid = [];
  const slidesSizesGrid = [];
  let offsetBefore = params.slidesOffsetBefore;
  if (typeof offsetBefore === "function") {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }
  let offsetAfter = params.slidesOffsetAfter;
  if (typeof offsetAfter === "function") {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }
  const previousSnapGridLength = swiper.snapGrid.length;
  const previousSlidesGridLength = swiper.slidesGrid.length;
  let spaceBetween = params.spaceBetween;
  let slidePosition = -offsetBefore;
  let prevSlideSize = 0;
  let index = 0;
  if (typeof swiperSize === "undefined") {
    return;
  }
  if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
  } else if (typeof spaceBetween === "string") {
    spaceBetween = parseFloat(spaceBetween);
  }
  swiper.virtualSize = -spaceBetween;
  slides.forEach((slideEl) => {
    if (rtl) {
      slideEl.style.marginLeft = "";
    } else {
      slideEl.style.marginRight = "";
    }
    slideEl.style.marginBottom = "";
    slideEl.style.marginTop = "";
  });
  if (params.centeredSlides && params.cssMode) {
    setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
    setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
  }
  const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
  if (gridEnabled) {
    swiper.grid.initSlides(slidesLength);
  }
  let slideSize;
  const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
    return typeof params.breakpoints[key].slidesPerView !== "undefined";
  }).length > 0;
  for (let i2 = 0; i2 < slidesLength; i2 += 1) {
    slideSize = 0;
    let slide2;
    if (slides[i2])
      slide2 = slides[i2];
    if (gridEnabled) {
      swiper.grid.updateSlide(i2, slide2, slidesLength, getDirectionLabel);
    }
    if (slides[i2] && elementStyle(slide2, "display") === "none")
      continue;
    if (params.slidesPerView === "auto") {
      if (shouldResetSlideSize) {
        slides[i2].style[getDirectionLabel("width")] = ``;
      }
      const slideStyles = getComputedStyle(slide2);
      const currentTransform = slide2.style.transform;
      const currentWebKitTransform = slide2.style.webkitTransform;
      if (currentTransform) {
        slide2.style.transform = "none";
      }
      if (currentWebKitTransform) {
        slide2.style.webkitTransform = "none";
      }
      if (params.roundLengths) {
        slideSize = swiper.isHorizontal() ? elementOuterSize(slide2, "width", true) : elementOuterSize(slide2, "height", true);
      } else {
        const width = getDirectionPropertyValue(slideStyles, "width");
        const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
        const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
        const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
        const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
        const boxSizing = slideStyles.getPropertyValue("box-sizing");
        if (boxSizing && boxSizing === "border-box") {
          slideSize = width + marginLeft + marginRight;
        } else {
          const {
            clientWidth,
            offsetWidth
          } = slide2;
          slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
        }
      }
      if (currentTransform) {
        slide2.style.transform = currentTransform;
      }
      if (currentWebKitTransform) {
        slide2.style.webkitTransform = currentWebKitTransform;
      }
      if (params.roundLengths)
        slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths)
        slideSize = Math.floor(slideSize);
      if (slides[i2]) {
        slides[i2].style[getDirectionLabel("width")] = `${slideSize}px`;
      }
    }
    if (slides[i2]) {
      slides[i2].swiperSlideSize = slideSize;
    }
    slidesSizesGrid.push(slideSize);
    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i2 !== 0)
        slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i2 === 0)
        slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1e3)
        slidePosition = 0;
      if (params.roundLengths)
        slidePosition = Math.floor(slidePosition);
      if (index % params.slidesPerGroup === 0)
        snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths)
        slidePosition = Math.floor(slidePosition);
      if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0)
        snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }
    swiper.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index += 1;
  }
  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
  if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) {
    wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
  }
  if (params.setWrapperSize) {
    wrapperEl.style[getDirectionLabel("width")] = `${swiper.virtualSize + spaceBetween}px`;
  }
  if (gridEnabled) {
    swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
  }
  if (!params.centeredSlides) {
    const newSlidesGrid = [];
    for (let i2 = 0; i2 < snapGrid.length; i2 += 1) {
      let slidesGridItem = snapGrid[i2];
      if (params.roundLengths)
        slidesGridItem = Math.floor(slidesGridItem);
      if (snapGrid[i2] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(slidesGridItem);
      }
    }
    snapGrid = newSlidesGrid;
    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }
  if (isVirtual && params.loop) {
    const size = slidesSizesGrid[0] + spaceBetween;
    if (params.slidesPerGroup > 1) {
      const groups = Math.ceil((swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) / params.slidesPerGroup);
      const groupSize = size * params.slidesPerGroup;
      for (let i2 = 0; i2 < groups; i2 += 1) {
        snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
      }
    }
    for (let i2 = 0; i2 < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter; i2 += 1) {
      if (params.slidesPerGroup === 1) {
        snapGrid.push(snapGrid[snapGrid.length - 1] + size);
      }
      slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
      swiper.virtualSize += size;
    }
  }
  if (snapGrid.length === 0)
    snapGrid = [0];
  if (spaceBetween !== 0) {
    const key = swiper.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
    slides.filter((_, slideIndex) => {
      if (!params.cssMode || params.loop)
        return true;
      if (slideIndex === slides.length - 1) {
        return false;
      }
      return true;
    }).forEach((slideEl) => {
      slideEl.style[key] = `${spaceBetween}px`;
    });
  }
  if (params.centeredSlides && params.centeredSlidesBounds) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (spaceBetween || 0);
    });
    allSlidesSize -= spaceBetween;
    const maxSnap = allSlidesSize - swiperSize;
    snapGrid = snapGrid.map((snap) => {
      if (snap <= 0)
        return -offsetBefore;
      if (snap > maxSnap)
        return maxSnap + offsetAfter;
      return snap;
    });
  }
  if (params.centerInsufficientSlides) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (spaceBetween || 0);
    });
    allSlidesSize -= spaceBetween;
    if (allSlidesSize < swiperSize) {
      const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
      snapGrid.forEach((snap, snapIndex) => {
        snapGrid[snapIndex] = snap - allSlidesOffset;
      });
      slidesGrid.forEach((snap, snapIndex) => {
        slidesGrid[snapIndex] = snap + allSlidesOffset;
      });
    }
  }
  Object.assign(swiper, {
    slides,
    snapGrid,
    slidesGrid,
    slidesSizesGrid
  });
  if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
    setCSSProperty(wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
    setCSSProperty(wrapperEl, "--swiper-centered-offset-after", `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
    const addToSnapGrid = -swiper.snapGrid[0];
    const addToSlidesGrid = -swiper.slidesGrid[0];
    swiper.snapGrid = swiper.snapGrid.map((v2) => v2 + addToSnapGrid);
    swiper.slidesGrid = swiper.slidesGrid.map((v2) => v2 + addToSlidesGrid);
  }
  if (slidesLength !== previousSlidesLength) {
    swiper.emit("slidesLengthChange");
  }
  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow)
      swiper.checkOverflow();
    swiper.emit("snapGridLengthChange");
  }
  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit("slidesGridLengthChange");
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
    const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
    const hasClassBackfaceClassAdded = swiper.el.classList.contains(backFaceHiddenClass);
    if (slidesLength <= params.maxBackfaceHiddenSlides) {
      if (!hasClassBackfaceClassAdded)
        swiper.el.classList.add(backFaceHiddenClass);
    } else if (hasClassBackfaceClassAdded) {
      swiper.el.classList.remove(backFaceHiddenClass);
    }
  }
}
function updateAutoHeight(speed) {
  const swiper = this;
  const activeSlides = [];
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  let newHeight = 0;
  let i2;
  if (typeof speed === "number") {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  }
  const getSlideByIndex = (index) => {
    if (isVirtual) {
      return swiper.slides[swiper.getSlideIndexByData(index)];
    }
    return swiper.slides[index];
  };
  if (swiper.params.slidesPerView !== "auto" && swiper.params.slidesPerView > 1) {
    if (swiper.params.centeredSlides) {
      (swiper.visibleSlides || []).forEach((slide2) => {
        activeSlides.push(slide2);
      });
    } else {
      for (i2 = 0; i2 < Math.ceil(swiper.params.slidesPerView); i2 += 1) {
        const index = swiper.activeIndex + i2;
        if (index > swiper.slides.length && !isVirtual)
          break;
        activeSlides.push(getSlideByIndex(index));
      }
    }
  } else {
    activeSlides.push(getSlideByIndex(swiper.activeIndex));
  }
  for (i2 = 0; i2 < activeSlides.length; i2 += 1) {
    if (typeof activeSlides[i2] !== "undefined") {
      const height = activeSlides[i2].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  }
  if (newHeight || newHeight === 0)
    swiper.wrapperEl.style.height = `${newHeight}px`;
}
function updateSlidesOffset() {
  const swiper = this;
  const slides = swiper.slides;
  const minusOffset = swiper.isElement ? swiper.isHorizontal() ? swiper.wrapperEl.offsetLeft : swiper.wrapperEl.offsetTop : 0;
  for (let i2 = 0; i2 < slides.length; i2 += 1) {
    slides[i2].swiperSlideOffset = (swiper.isHorizontal() ? slides[i2].offsetLeft : slides[i2].offsetTop) - minusOffset - swiper.cssOverflowAdjustment();
  }
}
function updateSlidesProgress(translate2) {
  if (translate2 === void 0) {
    translate2 = this && this.translate || 0;
  }
  const swiper = this;
  const params = swiper.params;
  const {
    slides,
    rtlTranslate: rtl,
    snapGrid
  } = swiper;
  if (slides.length === 0)
    return;
  if (typeof slides[0].swiperSlideOffset === "undefined")
    swiper.updateSlidesOffset();
  let offsetCenter = -translate2;
  if (rtl)
    offsetCenter = translate2;
  slides.forEach((slideEl) => {
    slideEl.classList.remove(params.slideVisibleClass);
  });
  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];
  let spaceBetween = params.spaceBetween;
  if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiper.size;
  } else if (typeof spaceBetween === "string") {
    spaceBetween = parseFloat(spaceBetween);
  }
  for (let i2 = 0; i2 < slides.length; i2 += 1) {
    const slide2 = slides[i2];
    let slideOffset = slide2.swiperSlideOffset;
    if (params.cssMode && params.centeredSlides) {
      slideOffset -= slides[0].swiperSlideOffset;
    }
    const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + spaceBetween);
    const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + spaceBetween);
    const slideBefore = -(offsetCenter - slideOffset);
    const slideAfter = slideBefore + swiper.slidesSizesGrid[i2];
    const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;
    if (isVisible) {
      swiper.visibleSlides.push(slide2);
      swiper.visibleSlidesIndexes.push(i2);
      slides[i2].classList.add(params.slideVisibleClass);
    }
    slide2.progress = rtl ? -slideProgress : slideProgress;
    slide2.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
  }
}
function updateProgress(translate2) {
  const swiper = this;
  if (typeof translate2 === "undefined") {
    const multiplier = swiper.rtlTranslate ? -1 : 1;
    translate2 = swiper && swiper.translate && swiper.translate * multiplier || 0;
  }
  const params = swiper.params;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  let {
    progress,
    isBeginning,
    isEnd,
    progressLoop
  } = swiper;
  const wasBeginning = isBeginning;
  const wasEnd = isEnd;
  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate2 - swiper.minTranslate()) / translatesDiff;
    const isBeginningRounded = Math.abs(translate2 - swiper.minTranslate()) < 1;
    const isEndRounded = Math.abs(translate2 - swiper.maxTranslate()) < 1;
    isBeginning = isBeginningRounded || progress <= 0;
    isEnd = isEndRounded || progress >= 1;
    if (isBeginningRounded)
      progress = 0;
    if (isEndRounded)
      progress = 1;
  }
  if (params.loop) {
    const firstSlideIndex = swiper.getSlideIndexByData(0);
    const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
    const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
    const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
    const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
    const translateAbs = Math.abs(translate2);
    if (translateAbs >= firstSlideTranslate) {
      progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
    } else {
      progressLoop = (translateAbs + translateMax - lastSlideTranslate) / translateMax;
    }
    if (progressLoop > 1)
      progressLoop -= 1;
  }
  Object.assign(swiper, {
    progress,
    progressLoop,
    isBeginning,
    isEnd
  });
  if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight)
    swiper.updateSlidesProgress(translate2);
  if (isBeginning && !wasBeginning) {
    swiper.emit("reachBeginning toEdge");
  }
  if (isEnd && !wasEnd) {
    swiper.emit("reachEnd toEdge");
  }
  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper.emit("fromEdge");
  }
  swiper.emit("progress", progress);
}
function updateSlidesClasses() {
  const swiper = this;
  const {
    slides,
    params,
    slidesEl,
    activeIndex
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const getFilteredSlide = (selector) => {
    return elementChildren(slidesEl, `.${params.slideClass}${selector}, swiper-slide${selector}`)[0];
  };
  slides.forEach((slideEl) => {
    slideEl.classList.remove(params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
  });
  let activeSlide;
  if (isVirtual) {
    if (params.loop) {
      let slideIndex = activeIndex - swiper.virtual.slidesBefore;
      if (slideIndex < 0)
        slideIndex = swiper.virtual.slides.length + slideIndex;
      if (slideIndex >= swiper.virtual.slides.length)
        slideIndex -= swiper.virtual.slides.length;
      activeSlide = getFilteredSlide(`[data-swiper-slide-index="${slideIndex}"]`);
    } else {
      activeSlide = getFilteredSlide(`[data-swiper-slide-index="${activeIndex}"]`);
    }
  } else {
    activeSlide = slides[activeIndex];
  }
  if (activeSlide) {
    activeSlide.classList.add(params.slideActiveClass);
    let nextSlide = elementNextAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
    if (params.loop && !nextSlide) {
      nextSlide = slides[0];
    }
    if (nextSlide) {
      nextSlide.classList.add(params.slideNextClass);
    }
    let prevSlide = elementPrevAll(activeSlide, `.${params.slideClass}, swiper-slide`)[0];
    if (params.loop && !prevSlide === 0) {
      prevSlide = slides[slides.length - 1];
    }
    if (prevSlide) {
      prevSlide.classList.add(params.slidePrevClass);
    }
  }
  swiper.emitSlidesClasses();
}
var processLazyPreloader = (swiper, imageEl) => {
  if (!swiper || swiper.destroyed || !swiper.params)
    return;
  const slideSelector = () => swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
  const slideEl = imageEl.closest(slideSelector());
  if (slideEl) {
    const lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
    if (lazyEl)
      lazyEl.remove();
  }
};
var unlazy = (swiper, index) => {
  if (!swiper.slides[index])
    return;
  const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
  if (imageEl)
    imageEl.removeAttribute("loading");
};
var preload = (swiper) => {
  if (!swiper || swiper.destroyed || !swiper.params)
    return;
  let amount = swiper.params.lazyPreloadPrevNext;
  const len = swiper.slides.length;
  if (!len || !amount || amount < 0)
    return;
  amount = Math.min(amount, len);
  const slidesPerView = swiper.params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(swiper.params.slidesPerView);
  const activeIndex = swiper.activeIndex;
  if (swiper.params.grid && swiper.params.grid.rows > 1) {
    const activeColumn = activeIndex;
    const preloadColumns = [activeColumn - amount];
    preloadColumns.push(...Array.from({
      length: amount
    }).map((_, i2) => {
      return activeColumn + slidesPerView + i2;
    }));
    swiper.slides.forEach((slideEl, i2) => {
      if (preloadColumns.includes(slideEl.column))
        unlazy(swiper, i2);
    });
    return;
  }
  const slideIndexLastInView = activeIndex + slidesPerView - 1;
  if (swiper.params.rewind || swiper.params.loop) {
    for (let i2 = activeIndex - amount; i2 <= slideIndexLastInView + amount; i2 += 1) {
      const realIndex = (i2 % len + len) % len;
      if (realIndex < activeIndex || realIndex > slideIndexLastInView)
        unlazy(swiper, realIndex);
    }
  } else {
    for (let i2 = Math.max(activeIndex - amount, 0); i2 <= Math.min(slideIndexLastInView + amount, len - 1); i2 += 1) {
      if (i2 !== activeIndex && (i2 > slideIndexLastInView || i2 < activeIndex)) {
        unlazy(swiper, i2);
      }
    }
  }
};
function getActiveIndexByTranslate(swiper) {
  const {
    slidesGrid,
    params
  } = swiper;
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  let activeIndex;
  for (let i2 = 0; i2 < slidesGrid.length; i2 += 1) {
    if (typeof slidesGrid[i2 + 1] !== "undefined") {
      if (translate2 >= slidesGrid[i2] && translate2 < slidesGrid[i2 + 1] - (slidesGrid[i2 + 1] - slidesGrid[i2]) / 2) {
        activeIndex = i2;
      } else if (translate2 >= slidesGrid[i2] && translate2 < slidesGrid[i2 + 1]) {
        activeIndex = i2 + 1;
      }
    } else if (translate2 >= slidesGrid[i2]) {
      activeIndex = i2;
    }
  }
  if (params.normalizeSlideIndex) {
    if (activeIndex < 0 || typeof activeIndex === "undefined")
      activeIndex = 0;
  }
  return activeIndex;
}
function updateActiveIndex(newActiveIndex) {
  const swiper = this;
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  const {
    snapGrid,
    params,
    activeIndex: previousIndex,
    realIndex: previousRealIndex,
    snapIndex: previousSnapIndex
  } = swiper;
  let activeIndex = newActiveIndex;
  let snapIndex;
  const getVirtualRealIndex = (aIndex) => {
    let realIndex2 = aIndex - swiper.virtual.slidesBefore;
    if (realIndex2 < 0) {
      realIndex2 = swiper.virtual.slides.length + realIndex2;
    }
    if (realIndex2 >= swiper.virtual.slides.length) {
      realIndex2 -= swiper.virtual.slides.length;
    }
    return realIndex2;
  };
  if (typeof activeIndex === "undefined") {
    activeIndex = getActiveIndexByTranslate(swiper);
  }
  if (snapGrid.indexOf(translate2) >= 0) {
    snapIndex = snapGrid.indexOf(translate2);
  } else {
    const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }
  if (snapIndex >= snapGrid.length)
    snapIndex = snapGrid.length - 1;
  if (activeIndex === previousIndex) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit("snapIndexChange");
    }
    if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
      swiper.realIndex = getVirtualRealIndex(activeIndex);
    }
    return;
  }
  let realIndex;
  if (swiper.virtual && params.virtual.enabled && params.loop) {
    realIndex = getVirtualRealIndex(activeIndex);
  } else if (swiper.slides[activeIndex]) {
    realIndex = parseInt(swiper.slides[activeIndex].getAttribute("data-swiper-slide-index") || activeIndex, 10);
  } else {
    realIndex = activeIndex;
  }
  Object.assign(swiper, {
    previousSnapIndex,
    snapIndex,
    previousRealIndex,
    realIndex,
    previousIndex,
    activeIndex
  });
  if (swiper.initialized) {
    preload(swiper);
  }
  swiper.emit("activeIndexChange");
  swiper.emit("snapIndexChange");
  if (previousRealIndex !== realIndex) {
    swiper.emit("realIndexChange");
  }
  if (swiper.initialized || swiper.params.runCallbacksOnInit) {
    swiper.emit("slideChange");
  }
}
function updateClickedSlide(e2) {
  const swiper = this;
  const params = swiper.params;
  const slide2 = e2.closest(`.${params.slideClass}, swiper-slide`);
  let slideFound = false;
  let slideIndex;
  if (slide2) {
    for (let i2 = 0; i2 < swiper.slides.length; i2 += 1) {
      if (swiper.slides[i2] === slide2) {
        slideFound = true;
        slideIndex = i2;
        break;
      }
    }
  }
  if (slide2 && slideFound) {
    swiper.clickedSlide = slide2;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt(slide2.getAttribute("data-swiper-slide-index"), 10);
    } else {
      swiper.clickedIndex = slideIndex;
    }
  } else {
    swiper.clickedSlide = void 0;
    swiper.clickedIndex = void 0;
    return;
  }
  if (params.slideToClickedSlide && swiper.clickedIndex !== void 0 && swiper.clickedIndex !== swiper.activeIndex) {
    swiper.slideToClickedSlide();
  }
}
var update = {
  updateSize,
  updateSlides,
  updateAutoHeight,
  updateSlidesOffset,
  updateSlidesProgress,
  updateProgress,
  updateSlidesClasses,
  updateActiveIndex,
  updateClickedSlide
};
function getSwiperTranslate(axis) {
  if (axis === void 0) {
    axis = this.isHorizontal() ? "x" : "y";
  }
  const swiper = this;
  const {
    params,
    rtlTranslate: rtl,
    translate: translate2,
    wrapperEl
  } = swiper;
  if (params.virtualTranslate) {
    return rtl ? -translate2 : translate2;
  }
  if (params.cssMode) {
    return translate2;
  }
  let currentTranslate = getTranslate(wrapperEl, axis);
  currentTranslate += swiper.cssOverflowAdjustment();
  if (rtl)
    currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}
function setTranslate(translate2, byController) {
  const swiper = this;
  const {
    rtlTranslate: rtl,
    params,
    wrapperEl,
    progress
  } = swiper;
  let x2 = 0;
  let y2 = 0;
  const z = 0;
  if (swiper.isHorizontal()) {
    x2 = rtl ? -translate2 : translate2;
  } else {
    y2 = translate2;
  }
  if (params.roundLengths) {
    x2 = Math.floor(x2);
    y2 = Math.floor(y2);
  }
  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x2 : y2;
  if (params.cssMode) {
    wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper.isHorizontal() ? -x2 : -y2;
  } else if (!params.virtualTranslate) {
    if (swiper.isHorizontal()) {
      x2 -= swiper.cssOverflowAdjustment();
    } else {
      y2 -= swiper.cssOverflowAdjustment();
    }
    wrapperEl.style.transform = `translate3d(${x2}px, ${y2}px, ${z}px)`;
  }
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate2 - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== progress) {
    swiper.updateProgress(translate2);
  }
  swiper.emit("setTranslate", swiper.translate, byController);
}
function minTranslate() {
  return -this.snapGrid[0];
}
function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}
function translateTo(translate2, speed, runCallbacks, translateBounds, internal) {
  if (translate2 === void 0) {
    translate2 = 0;
  }
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (translateBounds === void 0) {
    translateBounds = true;
  }
  const swiper = this;
  const {
    params,
    wrapperEl
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }
  const minTranslate2 = swiper.minTranslate();
  const maxTranslate2 = swiper.maxTranslate();
  let newTranslate;
  if (translateBounds && translate2 > minTranslate2)
    newTranslate = minTranslate2;
  else if (translateBounds && translate2 < maxTranslate2)
    newTranslate = maxTranslate2;
  else
    newTranslate = translate2;
  swiper.updateProgress(newTranslate);
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    if (speed === 0) {
      wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: -newTranslate,
          side: isH ? "left" : "top"
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: -newTranslate,
        behavior: "smooth"
      });
    }
    return true;
  }
  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit("beforeTransitionStart", speed, internal);
      swiper.emit("transitionEnd");
    }
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit("beforeTransitionStart", speed, internal);
      swiper.emit("transitionStart");
    }
    if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onTranslateToWrapperTransitionEnd) {
        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd2(e2) {
          if (!swiper || swiper.destroyed)
            return;
          if (e2.target !== this)
            return;
          swiper.wrapperEl.removeEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
          swiper.onTranslateToWrapperTransitionEnd = null;
          delete swiper.onTranslateToWrapperTransitionEnd;
          if (runCallbacks) {
            swiper.emit("transitionEnd");
          }
        };
      }
      swiper.wrapperEl.addEventListener("transitionend", swiper.onTranslateToWrapperTransitionEnd);
    }
  }
  return true;
}
var translate = {
  getTranslate: getSwiperTranslate,
  setTranslate,
  minTranslate,
  maxTranslate,
  translateTo
};
function setTransition(duration, byController) {
  const swiper = this;
  if (!swiper.params.cssMode) {
    swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
  }
  swiper.emit("setTransition", duration, byController);
}
function transitionEmit(_ref) {
  let {
    swiper,
    runCallbacks,
    direction,
    step
  } = _ref;
  const {
    activeIndex,
    previousIndex
  } = swiper;
  let dir = direction;
  if (!dir) {
    if (activeIndex > previousIndex)
      dir = "next";
    else if (activeIndex < previousIndex)
      dir = "prev";
    else
      dir = "reset";
  }
  swiper.emit(`transition${step}`);
  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === "reset") {
      swiper.emit(`slideResetTransition${step}`);
      return;
    }
    swiper.emit(`slideChangeTransition${step}`);
    if (dir === "next") {
      swiper.emit(`slideNextTransition${step}`);
    } else {
      swiper.emit(`slidePrevTransition${step}`);
    }
  }
}
function transitionStart(runCallbacks, direction) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    params
  } = swiper;
  if (params.cssMode)
    return;
  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: "Start"
  });
}
function transitionEnd(runCallbacks, direction) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.animating = false;
  if (params.cssMode)
    return;
  swiper.setTransition(0);
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: "End"
  });
}
var transition = {
  setTransition,
  transitionStart,
  transitionEnd
};
function slideTo(index, speed, runCallbacks, internal, initial) {
  if (index === void 0) {
    index = 0;
  }
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (typeof index === "string") {
    index = parseInt(index, 10);
  }
  const swiper = this;
  let slideIndex = index;
  if (slideIndex < 0)
    slideIndex = 0;
  const {
    params,
    snapGrid,
    slidesGrid,
    previousIndex,
    activeIndex,
    rtlTranslate: rtl,
    wrapperEl,
    enabled
  } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
    return false;
  }
  const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
  let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length)
    snapIndex = snapGrid.length - 1;
  const translate2 = -snapGrid[snapIndex];
  if (params.normalizeSlideIndex) {
    for (let i2 = 0; i2 < slidesGrid.length; i2 += 1) {
      const normalizedTranslate = -Math.floor(translate2 * 100);
      const normalizedGrid = Math.floor(slidesGrid[i2] * 100);
      const normalizedGridNext = Math.floor(slidesGrid[i2 + 1] * 100);
      if (typeof slidesGrid[i2 + 1] !== "undefined") {
        if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
          slideIndex = i2;
        } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
          slideIndex = i2 + 1;
        }
      } else if (normalizedTranslate >= normalizedGrid) {
        slideIndex = i2;
      }
    }
  }
  if (swiper.initialized && slideIndex !== activeIndex) {
    if (!swiper.allowSlideNext && (rtl ? translate2 > swiper.translate && translate2 > swiper.minTranslate() : translate2 < swiper.translate && translate2 < swiper.minTranslate())) {
      return false;
    }
    if (!swiper.allowSlidePrev && translate2 > swiper.translate && translate2 > swiper.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex) {
        return false;
      }
    }
  }
  if (slideIndex !== (previousIndex || 0) && runCallbacks) {
    swiper.emit("beforeSlideChangeStart");
  }
  swiper.updateProgress(translate2);
  let direction;
  if (slideIndex > activeIndex)
    direction = "next";
  else if (slideIndex < activeIndex)
    direction = "prev";
  else
    direction = "reset";
  if (rtl && -translate2 === swiper.translate || !rtl && translate2 === swiper.translate) {
    swiper.updateActiveIndex(slideIndex);
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    swiper.updateSlidesClasses();
    if (params.effect !== "slide") {
      swiper.setTranslate(translate2);
    }
    if (direction !== "reset") {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }
    return false;
  }
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    const t2 = rtl ? translate2 : -translate2;
    if (speed === 0) {
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
      if (isVirtual) {
        swiper.wrapperEl.style.scrollSnapType = "none";
        swiper._immediateVirtual = true;
      }
      if (isVirtual && !swiper._cssModeVirtualInitialSet && swiper.params.initialSlide > 0) {
        swiper._cssModeVirtualInitialSet = true;
        requestAnimationFrame(() => {
          wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t2;
        });
      } else {
        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t2;
      }
      if (isVirtual) {
        requestAnimationFrame(() => {
          swiper.wrapperEl.style.scrollSnapType = "";
          swiper._immediateVirtual = false;
        });
      }
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: t2,
          side: isH ? "left" : "top"
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: t2,
        behavior: "smooth"
      });
    }
    return true;
  }
  swiper.setTransition(speed);
  swiper.setTranslate(translate2);
  swiper.updateActiveIndex(slideIndex);
  swiper.updateSlidesClasses();
  swiper.emit("beforeTransitionStart", speed, internal);
  swiper.transitionStart(runCallbacks, direction);
  if (speed === 0) {
    swiper.transitionEnd(runCallbacks, direction);
  } else if (!swiper.animating) {
    swiper.animating = true;
    if (!swiper.onSlideToWrapperTransitionEnd) {
      swiper.onSlideToWrapperTransitionEnd = function transitionEnd2(e2) {
        if (!swiper || swiper.destroyed)
          return;
        if (e2.target !== this)
          return;
        swiper.wrapperEl.removeEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
        swiper.onSlideToWrapperTransitionEnd = null;
        delete swiper.onSlideToWrapperTransitionEnd;
        swiper.transitionEnd(runCallbacks, direction);
      };
    }
    swiper.wrapperEl.addEventListener("transitionend", swiper.onSlideToWrapperTransitionEnd);
  }
  return true;
}
function slideToLoop(index, speed, runCallbacks, internal) {
  if (index === void 0) {
    index = 0;
  }
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (typeof index === "string") {
    const indexAsNumber = parseInt(index, 10);
    index = indexAsNumber;
  }
  const swiper = this;
  let newIndex = index;
  if (swiper.params.loop) {
    if (swiper.virtual && swiper.params.virtual.enabled) {
      newIndex = newIndex + swiper.virtual.slidesBefore;
    } else {
      newIndex = swiper.getSlideIndexByData(newIndex);
    }
  }
  return swiper.slideTo(newIndex, speed, runCallbacks, internal);
}
function slideNext(speed, runCallbacks, internal) {
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    enabled,
    params,
    animating
  } = swiper;
  if (!enabled)
    return swiper;
  let perGroup = params.slidesPerGroup;
  if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
    perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
  }
  const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  if (params.loop) {
    if (animating && !isVirtual && params.loopPreventsSliding)
      return false;
    swiper.loopFix({
      direction: "next"
    });
    swiper._clientLeft = swiper.wrapperEl.clientLeft;
  }
  if (params.rewind && swiper.isEnd) {
    return swiper.slideTo(0, speed, runCallbacks, internal);
  }
  return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}
function slidePrev(speed, runCallbacks, internal) {
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const {
    params,
    snapGrid,
    slidesGrid,
    rtlTranslate,
    enabled,
    animating
  } = swiper;
  if (!enabled)
    return swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  if (params.loop) {
    if (animating && !isVirtual && params.loopPreventsSliding)
      return false;
    swiper.loopFix({
      direction: "prev"
    });
    swiper._clientLeft = swiper.wrapperEl.clientLeft;
  }
  const translate2 = rtlTranslate ? swiper.translate : -swiper.translate;
  function normalize(val) {
    if (val < 0)
      return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }
  const normalizedTranslate = normalize(translate2);
  const normalizedSnapGrid = snapGrid.map((val) => normalize(val));
  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
  if (typeof prevSnap === "undefined" && params.cssMode) {
    let prevSnapIndex;
    snapGrid.forEach((snap, snapIndex) => {
      if (normalizedTranslate >= snap) {
        prevSnapIndex = snapIndex;
      }
    });
    if (typeof prevSnapIndex !== "undefined") {
      prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
    }
  }
  let prevIndex = 0;
  if (typeof prevSnap !== "undefined") {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0)
      prevIndex = swiper.activeIndex - 1;
    if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
      prevIndex = Math.max(prevIndex, 0);
    }
  }
  if (params.rewind && swiper.isBeginning) {
    const lastIndex = swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
  }
  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}
function slideReset(speed, runCallbacks, internal) {
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}
function slideToClosest(speed, runCallbacks, internal, threshold) {
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (threshold === void 0) {
    threshold = 0.5;
  }
  const swiper = this;
  let index = swiper.activeIndex;
  const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
  const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  if (translate2 >= swiper.snapGrid[snapIndex]) {
    const currentSnap = swiper.snapGrid[snapIndex];
    const nextSnap = swiper.snapGrid[snapIndex + 1];
    if (translate2 - currentSnap > (nextSnap - currentSnap) * threshold) {
      index += swiper.params.slidesPerGroup;
    }
  } else {
    const prevSnap = swiper.snapGrid[snapIndex - 1];
    const currentSnap = swiper.snapGrid[snapIndex];
    if (translate2 - prevSnap <= (currentSnap - prevSnap) * threshold) {
      index -= swiper.params.slidesPerGroup;
    }
  }
  index = Math.max(index, 0);
  index = Math.min(index, swiper.slidesGrid.length - 1);
  return swiper.slideTo(index, speed, runCallbacks, internal);
}
function slideToClickedSlide() {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : params.slidesPerView;
  let slideToIndex = swiper.clickedIndex;
  let realIndex;
  const slideSelector = swiper.isElement ? `swiper-slide` : `.${params.slideClass}`;
  if (params.loop) {
    if (swiper.animating)
      return;
    realIndex = parseInt(swiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
    if (params.centeredSlides) {
      if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
        swiper.loopFix();
        slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else if (slideToIndex > swiper.slides.length - slidesPerView) {
      swiper.loopFix();
      slideToIndex = swiper.getSlideIndex(elementChildren(slidesEl, `${slideSelector}[data-swiper-slide-index="${realIndex}"]`)[0]);
      nextTick(() => {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}
var slide = {
  slideTo,
  slideToLoop,
  slideNext,
  slidePrev,
  slideReset,
  slideToClosest,
  slideToClickedSlide
};
function loopCreate(slideRealIndex) {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  if (!params.loop || swiper.virtual && swiper.params.virtual.enabled)
    return;
  const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
  slides.forEach((el, index) => {
    el.setAttribute("data-swiper-slide-index", index);
  });
  swiper.loopFix({
    slideRealIndex,
    direction: params.centeredSlides ? void 0 : "next"
  });
}
function loopFix(_temp) {
  let {
    slideRealIndex,
    slideTo: slideTo2 = true,
    direction,
    setTranslate: setTranslate2,
    activeSlideIndex,
    byController,
    byMousewheel
  } = _temp === void 0 ? {} : _temp;
  const swiper = this;
  if (!swiper.params.loop)
    return;
  swiper.emit("beforeLoopFix");
  const {
    slides,
    allowSlidePrev,
    allowSlideNext,
    slidesEl,
    params
  } = swiper;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;
  if (swiper.virtual && params.virtual.enabled) {
    if (slideTo2) {
      if (!params.centeredSlides && swiper.snapIndex === 0) {
        swiper.slideTo(swiper.virtual.slides.length, 0, false, true);
      } else if (params.centeredSlides && swiper.snapIndex < params.slidesPerView) {
        swiper.slideTo(swiper.virtual.slides.length + swiper.snapIndex, 0, false, true);
      } else if (swiper.snapIndex === swiper.snapGrid.length - 1) {
        swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    swiper.emit("loopFix");
    return;
  }
  const slidesPerView = params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10));
  let loopedSlides = params.loopedSlides || slidesPerView;
  if (loopedSlides % params.slidesPerGroup !== 0) {
    loopedSlides += params.slidesPerGroup - loopedSlides % params.slidesPerGroup;
  }
  swiper.loopedSlides = loopedSlides;
  const prependSlidesIndexes = [];
  const appendSlidesIndexes = [];
  let activeIndex = swiper.activeIndex;
  if (typeof activeSlideIndex === "undefined") {
    activeSlideIndex = swiper.getSlideIndex(swiper.slides.filter((el) => el.classList.contains(params.slideActiveClass))[0]);
  } else {
    activeIndex = activeSlideIndex;
  }
  const isNext = direction === "next" || !direction;
  const isPrev = direction === "prev" || !direction;
  let slidesPrepended = 0;
  let slidesAppended = 0;
  if (activeSlideIndex < loopedSlides) {
    slidesPrepended = Math.max(loopedSlides - activeSlideIndex, params.slidesPerGroup);
    for (let i2 = 0; i2 < loopedSlides - activeSlideIndex; i2 += 1) {
      const index = i2 - Math.floor(i2 / slides.length) * slides.length;
      prependSlidesIndexes.push(slides.length - index - 1);
    }
  } else if (activeSlideIndex > swiper.slides.length - loopedSlides * 2) {
    slidesAppended = Math.max(activeSlideIndex - (swiper.slides.length - loopedSlides * 2), params.slidesPerGroup);
    for (let i2 = 0; i2 < slidesAppended; i2 += 1) {
      const index = i2 - Math.floor(i2 / slides.length) * slides.length;
      appendSlidesIndexes.push(index);
    }
  }
  if (isPrev) {
    prependSlidesIndexes.forEach((index) => {
      swiper.slides[index].swiperLoopMoveDOM = true;
      slidesEl.prepend(swiper.slides[index]);
      swiper.slides[index].swiperLoopMoveDOM = false;
    });
  }
  if (isNext) {
    appendSlidesIndexes.forEach((index) => {
      swiper.slides[index].swiperLoopMoveDOM = true;
      slidesEl.append(swiper.slides[index]);
      swiper.slides[index].swiperLoopMoveDOM = false;
    });
  }
  swiper.recalcSlides();
  if (params.slidesPerView === "auto") {
    swiper.updateSlides();
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  if (slideTo2) {
    if (prependSlidesIndexes.length > 0 && isPrev) {
      if (typeof slideRealIndex === "undefined") {
        const currentSlideTranslate = swiper.slidesGrid[activeIndex];
        const newSlideTranslate = swiper.slidesGrid[activeIndex + slidesPrepended];
        const diff = newSlideTranslate - currentSlideTranslate;
        if (byMousewheel) {
          swiper.setTranslate(swiper.translate - diff);
        } else {
          swiper.slideTo(activeIndex + slidesPrepended, 0, false, true);
          if (setTranslate2) {
            swiper.touches[swiper.isHorizontal() ? "startX" : "startY"] += diff;
          }
        }
      } else {
        if (setTranslate2) {
          swiper.slideToLoop(slideRealIndex, 0, false, true);
        }
      }
    } else if (appendSlidesIndexes.length > 0 && isNext) {
      if (typeof slideRealIndex === "undefined") {
        const currentSlideTranslate = swiper.slidesGrid[activeIndex];
        const newSlideTranslate = swiper.slidesGrid[activeIndex - slidesAppended];
        const diff = newSlideTranslate - currentSlideTranslate;
        if (byMousewheel) {
          swiper.setTranslate(swiper.translate - diff);
        } else {
          swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
          if (setTranslate2) {
            swiper.touches[swiper.isHorizontal() ? "startX" : "startY"] += diff;
          }
        }
      } else {
        swiper.slideToLoop(slideRealIndex, 0, false, true);
      }
    }
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.controller && swiper.controller.control && !byController) {
    const loopParams = {
      slideRealIndex,
      slideTo: false,
      direction,
      setTranslate: setTranslate2,
      activeSlideIndex,
      byController: true
    };
    if (Array.isArray(swiper.controller.control)) {
      swiper.controller.control.forEach((c2) => {
        if (!c2.destroyed && c2.params.loop)
          c2.loopFix(loopParams);
      });
    } else if (swiper.controller.control instanceof swiper.constructor && swiper.controller.control.params.loop) {
      swiper.controller.control.loopFix(loopParams);
    }
  }
  swiper.emit("loopFix");
}
function loopDestroy() {
  const swiper = this;
  const {
    params,
    slidesEl
  } = swiper;
  if (!params.loop || swiper.virtual && swiper.params.virtual.enabled)
    return;
  swiper.recalcSlides();
  const newSlidesOrder = [];
  swiper.slides.forEach((slideEl) => {
    const index = typeof slideEl.swiperSlideIndex === "undefined" ? slideEl.getAttribute("data-swiper-slide-index") * 1 : slideEl.swiperSlideIndex;
    newSlidesOrder[index] = slideEl;
  });
  swiper.slides.forEach((slideEl) => {
    slideEl.removeAttribute("data-swiper-slide-index");
  });
  newSlidesOrder.forEach((slideEl) => {
    slidesEl.append(slideEl);
  });
  swiper.recalcSlides();
  swiper.slideTo(swiper.realIndex, 0);
}
var loop = {
  loopCreate,
  loopFix,
  loopDestroy
};
function setGrabCursor(moving) {
  const swiper = this;
  if (!swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode)
    return;
  const el = swiper.params.touchEventsTarget === "container" ? swiper.el : swiper.wrapperEl;
  if (swiper.isElement) {
    swiper.__preventObserver__ = true;
  }
  el.style.cursor = "move";
  el.style.cursor = moving ? "grabbing" : "grab";
  if (swiper.isElement) {
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
  }
}
function unsetGrabCursor() {
  const swiper = this;
  if (swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
    return;
  }
  if (swiper.isElement) {
    swiper.__preventObserver__ = true;
  }
  swiper[swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
  if (swiper.isElement) {
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
  }
}
var grabCursor = {
  setGrabCursor,
  unsetGrabCursor
};
function closestElement(selector, base) {
  if (base === void 0) {
    base = this;
  }
  function __closestFrom(el) {
    if (!el || el === getDocument() || el === getWindow())
      return null;
    if (el.assignedSlot)
      el = el.assignedSlot;
    const found = el.closest(selector);
    if (!found && !el.getRootNode) {
      return null;
    }
    return found || __closestFrom(el.getRootNode().host);
  }
  return __closestFrom(base);
}
function onTouchStart(event2) {
  const swiper = this;
  const document2 = getDocument();
  const window2 = getWindow();
  const data = swiper.touchEventsData;
  data.evCache.push(event2);
  const {
    params,
    touches,
    enabled
  } = swiper;
  if (!enabled)
    return;
  if (!params.simulateTouch && event2.pointerType === "mouse")
    return;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }
  if (!swiper.animating && params.cssMode && params.loop) {
    swiper.loopFix();
  }
  let e2 = event2;
  if (e2.originalEvent)
    e2 = e2.originalEvent;
  let targetEl = e2.target;
  if (params.touchEventsTarget === "wrapper") {
    if (!swiper.wrapperEl.contains(targetEl))
      return;
  }
  if ("which" in e2 && e2.which === 3)
    return;
  if ("button" in e2 && e2.button > 0)
    return;
  if (data.isTouched && data.isMoved)
    return;
  const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
  const eventPath = event2.composedPath ? event2.composedPath() : event2.path;
  if (swipingClassHasValue && e2.target && e2.target.shadowRoot && eventPath) {
    targetEl = eventPath[0];
  }
  const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
  const isTargetShadow = !!(e2.target && e2.target.shadowRoot);
  if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, targetEl) : targetEl.closest(noSwipingSelector))) {
    swiper.allowClick = true;
    return;
  }
  if (params.swipeHandler) {
    if (!targetEl.closest(params.swipeHandler))
      return;
  }
  touches.currentX = e2.pageX;
  touches.currentY = e2.pageY;
  const startX = touches.currentX;
  const startY = touches.currentY;
  const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
  const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window2.innerWidth - edgeSwipeThreshold)) {
    if (edgeSwipeDetection === "prevent") {
      event2.preventDefault();
    } else {
      return;
    }
  }
  Object.assign(data, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: void 0,
    startMoving: void 0
  });
  touches.startX = startX;
  touches.startY = startY;
  data.touchStartTime = now();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = void 0;
  if (params.threshold > 0)
    data.allowThresholdMove = false;
  let preventDefault = true;
  if (targetEl.matches(data.focusableElements)) {
    preventDefault = false;
    if (targetEl.nodeName === "SELECT") {
      data.isTouched = false;
    }
  }
  if (document2.activeElement && document2.activeElement.matches(data.focusableElements) && document2.activeElement !== targetEl) {
    document2.activeElement.blur();
  }
  const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
  if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !targetEl.isContentEditable) {
    e2.preventDefault();
  }
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode && swiper.animating && !params.cssMode) {
    swiper.freeMode.onTouchStart();
  }
  swiper.emit("touchStart", e2);
}
function onTouchMove(event2) {
  const document2 = getDocument();
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    enabled
  } = swiper;
  if (!enabled)
    return;
  if (!params.simulateTouch && event2.pointerType === "mouse")
    return;
  let e2 = event2;
  if (e2.originalEvent)
    e2 = e2.originalEvent;
  if (!data.isTouched) {
    if (data.startMoving && data.isScrolling) {
      swiper.emit("touchMoveOpposite", e2);
    }
    return;
  }
  const pointerIndex = data.evCache.findIndex((cachedEv) => cachedEv.pointerId === e2.pointerId);
  if (pointerIndex >= 0)
    data.evCache[pointerIndex] = e2;
  const targetTouch = data.evCache.length > 1 ? data.evCache[0] : e2;
  const pageX = targetTouch.pageX;
  const pageY = targetTouch.pageY;
  if (e2.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }
  if (!swiper.allowTouchMove) {
    if (!e2.target.matches(data.focusableElements)) {
      swiper.allowClick = false;
    }
    if (data.isTouched) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        prevX: swiper.touches.currentX,
        prevY: swiper.touches.currentY,
        currentX: pageX,
        currentY: pageY
      });
      data.touchStartTime = now();
    }
    return;
  }
  if (params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
        data.isTouched = false;
        data.isMoved = false;
        return;
      }
    } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
      return;
    }
  }
  if (document2.activeElement) {
    if (e2.target === document2.activeElement && e2.target.matches(data.focusableElements)) {
      data.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }
  if (data.allowTouchCallbacks) {
    swiper.emit("touchMove", e2);
  }
  if (e2.targetTouches && e2.targetTouches.length > 1)
    return;
  touches.currentX = pageX;
  touches.currentY = pageY;
  const diffX = touches.currentX - touches.startX;
  const diffY = touches.currentY - touches.startY;
  if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold)
    return;
  if (typeof data.isScrolling === "undefined") {
    let touchAngle;
    if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
      data.isScrolling = false;
    } else {
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }
  if (data.isScrolling) {
    swiper.emit("touchMoveOpposite", e2);
  }
  if (typeof data.startMoving === "undefined") {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data.startMoving = true;
    }
  }
  if (data.isScrolling || swiper.zoom && swiper.params.zoom && swiper.params.zoom.enabled && data.evCache.length > 1) {
    data.isTouched = false;
    return;
  }
  if (!data.startMoving) {
    return;
  }
  swiper.allowClick = false;
  if (!params.cssMode && e2.cancelable) {
    e2.preventDefault();
  }
  if (params.touchMoveStopPropagation && !params.nested) {
    e2.stopPropagation();
  }
  let diff = swiper.isHorizontal() ? diffX : diffY;
  let touchesDiff = swiper.isHorizontal() ? touches.currentX - touches.previousX : touches.currentY - touches.previousY;
  if (params.oneWayMovement) {
    diff = Math.abs(diff) * (rtl ? 1 : -1);
    touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
  }
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl) {
    diff = -diff;
    touchesDiff = -touchesDiff;
  }
  const prevTouchesDirection = swiper.touchesDirection;
  swiper.swipeDirection = diff > 0 ? "prev" : "next";
  swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
  const isLoop = swiper.params.loop && !params.cssMode;
  if (!data.isMoved) {
    if (isLoop) {
      swiper.loopFix({
        direction: swiper.swipeDirection
      });
    }
    data.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);
    if (swiper.animating) {
      const evt = new window.CustomEvent("transitionend", {
        bubbles: true,
        cancelable: true
      });
      swiper.wrapperEl.dispatchEvent(evt);
    }
    data.allowMomentumBounce = false;
    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(true);
    }
    swiper.emit("sliderFirstMove", e2);
  }
  let loopFixed;
  if (data.isMoved && prevTouchesDirection !== swiper.touchesDirection && isLoop && Math.abs(diff) >= 1) {
    swiper.loopFix({
      direction: swiper.swipeDirection,
      setTranslate: true
    });
    loopFixed = true;
  }
  swiper.emit("sliderMove", e2);
  data.isMoved = true;
  data.currentTranslate = diff + data.startTranslate;
  let disableParentSwiper = true;
  let resistanceRatio = params.resistanceRatio;
  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }
  if (diff > 0) {
    if (isLoop && !loopFixed && data.currentTranslate > (params.centeredSlides ? swiper.minTranslate() - swiper.size / 2 : swiper.minTranslate())) {
      swiper.loopFix({
        direction: "prev",
        setTranslate: true,
        activeSlideIndex: 0
      });
    }
    if (data.currentTranslate > swiper.minTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) {
        data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
      }
    }
  } else if (diff < 0) {
    if (isLoop && !loopFixed && data.currentTranslate < (params.centeredSlides ? swiper.maxTranslate() + swiper.size / 2 : swiper.maxTranslate())) {
      swiper.loopFix({
        direction: "next",
        setTranslate: true,
        activeSlideIndex: swiper.slides.length - (params.slidesPerView === "auto" ? swiper.slidesPerViewDynamic() : Math.ceil(parseFloat(params.slidesPerView, 10)))
      });
    }
    if (data.currentTranslate < swiper.maxTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) {
        data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
      }
    }
  }
  if (disableParentSwiper) {
    e2.preventedByNestedSwiper = true;
  }
  if (!swiper.allowSlideNext && swiper.swipeDirection === "next" && data.currentTranslate < data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && swiper.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
    data.currentTranslate = data.startTranslate;
  }
  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
      if (!data.allowThresholdMove) {
        data.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data.currentTranslate = data.startTranslate;
        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data.currentTranslate = data.startTranslate;
      return;
    }
  }
  if (!params.followFinger || params.cssMode)
    return;
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode) {
    swiper.freeMode.onTouchMove();
  }
  swiper.updateProgress(data.currentTranslate);
  swiper.setTranslate(data.currentTranslate);
}
function onTouchEnd(event2) {
  const swiper = this;
  const data = swiper.touchEventsData;
  const pointerIndex = data.evCache.findIndex((cachedEv) => cachedEv.pointerId === event2.pointerId);
  if (pointerIndex >= 0) {
    data.evCache.splice(pointerIndex, 1);
  }
  if (["pointercancel", "pointerout", "pointerleave"].includes(event2.type)) {
    const proceed = event2.type === "pointercancel" && (swiper.browser.isSafari || swiper.browser.isWebView);
    if (!proceed) {
      return;
    }
  }
  const {
    params,
    touches,
    rtlTranslate: rtl,
    slidesGrid,
    enabled
  } = swiper;
  if (!enabled)
    return;
  if (!params.simulateTouch && event2.pointerType === "mouse")
    return;
  let e2 = event2;
  if (e2.originalEvent)
    e2 = e2.originalEvent;
  if (data.allowTouchCallbacks) {
    swiper.emit("touchEnd", e2);
  }
  data.allowTouchCallbacks = false;
  if (!data.isTouched) {
    if (data.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
    swiper.setGrabCursor(false);
  }
  const touchEndTime = now();
  const timeDiff = touchEndTime - data.touchStartTime;
  if (swiper.allowClick) {
    const pathTree = e2.path || e2.composedPath && e2.composedPath();
    swiper.updateClickedSlide(pathTree && pathTree[0] || e2.target);
    swiper.emit("tap click", e2);
    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      swiper.emit("doubleTap doubleClick", e2);
    }
  }
  data.lastClickTime = now();
  nextTick(() => {
    if (!swiper.destroyed)
      swiper.allowClick = true;
  });
  if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  data.isTouched = false;
  data.isMoved = false;
  data.startMoving = false;
  let currentPos;
  if (params.followFinger) {
    currentPos = rtl ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data.currentTranslate;
  }
  if (params.cssMode) {
    return;
  }
  if (params.freeMode && params.freeMode.enabled) {
    swiper.freeMode.onTouchEnd({
      currentPos
    });
    return;
  }
  let stopIndex = 0;
  let groupSize = swiper.slidesSizesGrid[0];
  for (let i2 = 0; i2 < slidesGrid.length; i2 += i2 < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
    const increment2 = i2 < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (typeof slidesGrid[i2 + increment2] !== "undefined") {
      if (currentPos >= slidesGrid[i2] && currentPos < slidesGrid[i2 + increment2]) {
        stopIndex = i2;
        groupSize = slidesGrid[i2 + increment2] - slidesGrid[i2];
      }
    } else if (currentPos >= slidesGrid[i2]) {
      stopIndex = i2;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  }
  let rewindFirstIndex = null;
  let rewindLastIndex = null;
  if (params.rewind) {
    if (swiper.isBeginning) {
      rewindLastIndex = params.virtual && params.virtual.enabled && swiper.virtual ? swiper.virtual.slides.length - 1 : swiper.slides.length - 1;
    } else if (swiper.isEnd) {
      rewindFirstIndex = 0;
    }
  }
  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
  if (timeDiff > params.longSwipesMs) {
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (swiper.swipeDirection === "next") {
      if (ratio >= params.longSwipesRatio)
        swiper.slideTo(params.rewind && swiper.isEnd ? rewindFirstIndex : stopIndex + increment);
      else
        swiper.slideTo(stopIndex);
    }
    if (swiper.swipeDirection === "prev") {
      if (ratio > 1 - params.longSwipesRatio) {
        swiper.slideTo(stopIndex + increment);
      } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
        swiper.slideTo(rewindLastIndex);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  } else {
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    const isNavButtonTarget = swiper.navigation && (e2.target === swiper.navigation.nextEl || e2.target === swiper.navigation.prevEl);
    if (!isNavButtonTarget) {
      if (swiper.swipeDirection === "next") {
        swiper.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
      }
      if (swiper.swipeDirection === "prev") {
        swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
      }
    } else if (e2.target === swiper.navigation.nextEl) {
      swiper.slideTo(stopIndex + increment);
    } else {
      swiper.slideTo(stopIndex);
    }
  }
}
function onResize() {
  const swiper = this;
  const {
    params,
    el
  } = swiper;
  if (el && el.offsetWidth === 0)
    return;
  if (params.breakpoints) {
    swiper.setBreakpoint();
  }
  const {
    allowSlideNext,
    allowSlidePrev,
    snapGrid
  } = swiper;
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateSlidesClasses();
  const isVirtualLoop = isVirtual && params.loop;
  if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides && !isVirtualLoop) {
    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
  } else {
    if (swiper.params.loop && !isVirtual) {
      swiper.slideToLoop(swiper.realIndex, 0, false, true);
    } else {
      swiper.slideTo(swiper.activeIndex, 0, false, true);
    }
  }
  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
    clearTimeout(swiper.autoplay.resizeTimeout);
    swiper.autoplay.resizeTimeout = setTimeout(() => {
      if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
        swiper.autoplay.resume();
      }
    }, 500);
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}
function onClick(e2) {
  const swiper = this;
  if (!swiper.enabled)
    return;
  if (!swiper.allowClick) {
    if (swiper.params.preventClicks)
      e2.preventDefault();
    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e2.stopPropagation();
      e2.stopImmediatePropagation();
    }
  }
}
function onScroll() {
  const swiper = this;
  const {
    wrapperEl,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled)
    return;
  swiper.previousTranslate = swiper.translate;
  if (swiper.isHorizontal()) {
    swiper.translate = -wrapperEl.scrollLeft;
  } else {
    swiper.translate = -wrapperEl.scrollTop;
  }
  if (swiper.translate === 0)
    swiper.translate = 0;
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== swiper.progress) {
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
  }
  swiper.emit("setTranslate", swiper.translate, false);
}
function onLoad(e2) {
  const swiper = this;
  processLazyPreloader(swiper, e2.target);
  if (swiper.params.cssMode || swiper.params.slidesPerView !== "auto" && !swiper.params.autoHeight) {
    return;
  }
  swiper.update();
}
var dummyEventAttached = false;
function dummyEventListener() {
}
var events = (swiper, method) => {
  const document2 = getDocument();
  const {
    params,
    el,
    wrapperEl,
    device
  } = swiper;
  const capture = !!params.nested;
  const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
  const swiperMethod = method;
  el[domMethod]("pointerdown", swiper.onTouchStart, {
    passive: false
  });
  document2[domMethod]("pointermove", swiper.onTouchMove, {
    passive: false,
    capture
  });
  document2[domMethod]("pointerup", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("pointercancel", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("pointerout", swiper.onTouchEnd, {
    passive: true
  });
  document2[domMethod]("pointerleave", swiper.onTouchEnd, {
    passive: true
  });
  if (params.preventClicks || params.preventClicksPropagation) {
    el[domMethod]("click", swiper.onClick, true);
  }
  if (params.cssMode) {
    wrapperEl[domMethod]("scroll", swiper.onScroll);
  }
  if (params.updateOnWindowResize) {
    swiper[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true);
  } else {
    swiper[swiperMethod]("observerUpdate", onResize, true);
  }
  el[domMethod]("load", swiper.onLoad, {
    capture: true
  });
};
function attachEvents() {
  const swiper = this;
  const document2 = getDocument();
  const {
    params
  } = swiper;
  swiper.onTouchStart = onTouchStart.bind(swiper);
  swiper.onTouchMove = onTouchMove.bind(swiper);
  swiper.onTouchEnd = onTouchEnd.bind(swiper);
  if (params.cssMode) {
    swiper.onScroll = onScroll.bind(swiper);
  }
  swiper.onClick = onClick.bind(swiper);
  swiper.onLoad = onLoad.bind(swiper);
  if (!dummyEventAttached) {
    document2.addEventListener("touchstart", dummyEventListener);
    dummyEventAttached = true;
  }
  events(swiper, "on");
}
function detachEvents() {
  const swiper = this;
  events(swiper, "off");
}
var events$1 = {
  attachEvents,
  detachEvents
};
var isGridEnabled = (swiper, params) => {
  return swiper.grid && params.grid && params.grid.rows > 1;
};
function setBreakpoint() {
  const swiper = this;
  const {
    realIndex,
    initialized,
    params,
    el
  } = swiper;
  const breakpoints2 = params.breakpoints;
  if (!breakpoints2 || breakpoints2 && Object.keys(breakpoints2).length === 0)
    return;
  const breakpoint = swiper.getBreakpoint(breakpoints2, swiper.params.breakpointsBase, swiper.el);
  if (!breakpoint || swiper.currentBreakpoint === breakpoint)
    return;
  const breakpointOnlyParams = breakpoint in breakpoints2 ? breakpoints2[breakpoint] : void 0;
  const breakpointParams = breakpointOnlyParams || swiper.originalParams;
  const wasMultiRow = isGridEnabled(swiper, params);
  const isMultiRow = isGridEnabled(swiper, breakpointParams);
  const wasEnabled = params.enabled;
  if (wasMultiRow && !isMultiRow) {
    el.classList.remove(`${params.containerModifierClass}grid`, `${params.containerModifierClass}grid-column`);
    swiper.emitContainerClasses();
  } else if (!wasMultiRow && isMultiRow) {
    el.classList.add(`${params.containerModifierClass}grid`);
    if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") {
      el.classList.add(`${params.containerModifierClass}grid-column`);
    }
    swiper.emitContainerClasses();
  }
  ["navigation", "pagination", "scrollbar"].forEach((prop) => {
    if (typeof breakpointParams[prop] === "undefined")
      return;
    const wasModuleEnabled = params[prop] && params[prop].enabled;
    const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
    if (wasModuleEnabled && !isModuleEnabled) {
      swiper[prop].disable();
    }
    if (!wasModuleEnabled && isModuleEnabled) {
      swiper[prop].enable();
    }
  });
  const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
  const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
  if (directionChanged && initialized) {
    swiper.changeDirection();
  }
  extend2(swiper.params, breakpointParams);
  const isEnabled = swiper.params.enabled;
  Object.assign(swiper, {
    allowTouchMove: swiper.params.allowTouchMove,
    allowSlideNext: swiper.params.allowSlideNext,
    allowSlidePrev: swiper.params.allowSlidePrev
  });
  if (wasEnabled && !isEnabled) {
    swiper.disable();
  } else if (!wasEnabled && isEnabled) {
    swiper.enable();
  }
  swiper.currentBreakpoint = breakpoint;
  swiper.emit("_beforeBreakpoint", breakpointParams);
  if (needsReLoop && initialized) {
    swiper.loopDestroy();
    swiper.loopCreate(realIndex);
    swiper.updateSlides();
  }
  swiper.emit("breakpoint", breakpointParams);
}
function getBreakpoint(breakpoints2, base, containerEl) {
  if (base === void 0) {
    base = "window";
  }
  if (!breakpoints2 || base === "container" && !containerEl)
    return void 0;
  let breakpoint = false;
  const window2 = getWindow();
  const currentHeight = base === "window" ? window2.innerHeight : containerEl.clientHeight;
  const points = Object.keys(breakpoints2).map((point) => {
    if (typeof point === "string" && point.indexOf("@") === 0) {
      const minRatio = parseFloat(point.substr(1));
      const value = currentHeight * minRatio;
      return {
        value,
        point
      };
    }
    return {
      value: point,
      point
    };
  });
  points.sort((a2, b2) => parseInt(a2.value, 10) - parseInt(b2.value, 10));
  for (let i2 = 0; i2 < points.length; i2 += 1) {
    const {
      point,
      value
    } = points[i2];
    if (base === "window") {
      if (window2.matchMedia(`(min-width: ${value}px)`).matches) {
        breakpoint = point;
      }
    } else if (value <= containerEl.clientWidth) {
      breakpoint = point;
    }
  }
  return breakpoint || "max";
}
var breakpoints = {
  setBreakpoint,
  getBreakpoint
};
function prepareClasses(entries, prefix) {
  const resultClasses = [];
  entries.forEach((item) => {
    if (typeof item === "object") {
      Object.keys(item).forEach((classNames) => {
        if (item[classNames]) {
          resultClasses.push(prefix + classNames);
        }
      });
    } else if (typeof item === "string") {
      resultClasses.push(prefix + item);
    }
  });
  return resultClasses;
}
function addClasses() {
  const swiper = this;
  const {
    classNames,
    params,
    rtl,
    el,
    device
  } = swiper;
  const suffixes = prepareClasses(["initialized", params.direction, {
    "free-mode": swiper.params.freeMode && params.freeMode.enabled
  }, {
    "autoheight": params.autoHeight
  }, {
    "rtl": rtl
  }, {
    "grid": params.grid && params.grid.rows > 1
  }, {
    "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
  }, {
    "android": device.android
  }, {
    "ios": device.ios
  }, {
    "css-mode": params.cssMode
  }, {
    "centered": params.cssMode && params.centeredSlides
  }, {
    "watch-progress": params.watchSlidesProgress
  }], params.containerModifierClass);
  classNames.push(...suffixes);
  el.classList.add(...classNames);
  swiper.emitContainerClasses();
}
function removeClasses() {
  const swiper = this;
  const {
    el,
    classNames
  } = swiper;
  el.classList.remove(...classNames);
  swiper.emitContainerClasses();
}
var classes = {
  addClasses,
  removeClasses
};
function checkOverflow() {
  const swiper = this;
  const {
    isLocked: wasLocked,
    params
  } = swiper;
  const {
    slidesOffsetBefore
  } = params;
  if (slidesOffsetBefore) {
    const lastSlideIndex = swiper.slides.length - 1;
    const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
    swiper.isLocked = swiper.size > lastSlideRightEdge;
  } else {
    swiper.isLocked = swiper.snapGrid.length === 1;
  }
  if (params.allowSlideNext === true) {
    swiper.allowSlideNext = !swiper.isLocked;
  }
  if (params.allowSlidePrev === true) {
    swiper.allowSlidePrev = !swiper.isLocked;
  }
  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
  }
  if (wasLocked !== swiper.isLocked) {
    swiper.emit(swiper.isLocked ? "lock" : "unlock");
  }
}
var checkOverflow$1 = {
  checkOverflow
};
var defaults = {
  init: true,
  direction: "horizontal",
  oneWayMovement: false,
  touchEventsTarget: "wrapper",
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: true,
  nested: false,
  createElements: false,
  enabled: true,
  focusableElements: "input, select, option, textarea, button, video, label",
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: false,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: false,
  // Set wrapper width
  setWrapperSize: false,
  // Virtual Translate
  virtualTranslate: false,
  // Effects
  effect: "slide",
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
  // Breakpoints
  breakpoints: void 0,
  breakpointsBase: "window",
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: false,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: true,
  // Round length
  roundLengths: false,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 5,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  // Unique Navigation Elements
  uniqueNavElements: true,
  // Resistance
  resistance: true,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: false,
  // Cursor
  grabCursor: false,
  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  // loop
  loop: false,
  loopedSlides: null,
  loopPreventsSliding: true,
  // rewind
  rewind: false,
  // Swiping/no swiping
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: "swiper-no-swiping",
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: true,
  maxBackfaceHiddenSlides: 10,
  // NS
  containerModifierClass: "swiper-",
  // NEW
  slideClass: "swiper-slide",
  slideActiveClass: "swiper-slide-active",
  slideVisibleClass: "swiper-slide-visible",
  slideNextClass: "swiper-slide-next",
  slidePrevClass: "swiper-slide-prev",
  wrapperClass: "swiper-wrapper",
  lazyPreloaderClass: "swiper-lazy-preloader",
  lazyPreloadPrevNext: 0,
  // Callbacks
  runCallbacksOnInit: true,
  // Internals
  _emitClasses: false
};
function moduleExtendParams(params, allModulesParams) {
  return function extendParams(obj) {
    if (obj === void 0) {
      obj = {};
    }
    const moduleParamName = Object.keys(obj)[0];
    const moduleParams = obj[moduleParamName];
    if (typeof moduleParams !== "object" || moduleParams === null) {
      extend2(allModulesParams, obj);
      return;
    }
    if (["navigation", "pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
      params[moduleParamName] = {
        auto: true
      };
    }
    if (!(moduleParamName in params && "enabled" in moduleParams)) {
      extend2(allModulesParams, obj);
      return;
    }
    if (params[moduleParamName] === true) {
      params[moduleParamName] = {
        enabled: true
      };
    }
    if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) {
      params[moduleParamName].enabled = true;
    }
    if (!params[moduleParamName])
      params[moduleParamName] = {
        enabled: false
      };
    extend2(allModulesParams, obj);
  };
}
var prototypes = {
  eventsEmitter,
  update,
  translate,
  transition,
  slide,
  loop,
  grabCursor,
  events: events$1,
  breakpoints,
  checkOverflow: checkOverflow$1,
  classes
};
var extendedDefaults = {};
var Swiper = class _Swiper {
  constructor() {
    let el;
    let params;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") {
      params = args[0];
    } else {
      [el, params] = args;
    }
    if (!params)
      params = {};
    params = extend2({}, params);
    if (el && !params.el)
      params.el = el;
    const document2 = getDocument();
    if (params.el && typeof params.el === "string" && document2.querySelectorAll(params.el).length > 1) {
      const swipers = [];
      document2.querySelectorAll(params.el).forEach((containerEl) => {
        const newParams = extend2({}, params, {
          el: containerEl
        });
        swipers.push(new _Swiper(newParams));
      });
      return swipers;
    }
    const swiper = this;
    swiper.__swiper__ = true;
    swiper.support = getSupport();
    swiper.device = getDevice({
      userAgent: params.userAgent
    });
    swiper.browser = getBrowser();
    swiper.eventsListeners = {};
    swiper.eventsAnyListeners = [];
    swiper.modules = [...swiper.__modules__];
    if (params.modules && Array.isArray(params.modules)) {
      swiper.modules.push(...params.modules);
    }
    const allModulesParams = {};
    swiper.modules.forEach((mod) => {
      mod({
        params,
        swiper,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: swiper.on.bind(swiper),
        once: swiper.once.bind(swiper),
        off: swiper.off.bind(swiper),
        emit: swiper.emit.bind(swiper)
      });
    });
    const swiperParams = extend2({}, defaults, allModulesParams);
    swiper.params = extend2({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = extend2({}, swiper.params);
    swiper.passedParams = extend2({}, params);
    if (swiper.params && swiper.params.on) {
      Object.keys(swiper.params.on).forEach((eventName) => {
        swiper.on(eventName, swiper.params.on[eventName]);
      });
    }
    if (swiper.params && swiper.params.onAny) {
      swiper.onAny(swiper.params.onAny);
    }
    Object.assign(swiper, {
      enabled: swiper.params.enabled,
      el,
      // Classes
      classNames: [],
      // Slides
      slides: [],
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],
      // isDirection
      isHorizontal() {
        return swiper.params.direction === "horizontal";
      },
      isVertical() {
        return swiper.params.direction === "vertical";
      },
      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: true,
      isEnd: false,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      cssOverflowAdjustment() {
        return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
      },
      // Locks
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
      // Touch Events
      touchEventsData: {
        isTouched: void 0,
        isMoved: void 0,
        allowTouchCallbacks: void 0,
        touchStartTime: void 0,
        isScrolling: void 0,
        currentTranslate: void 0,
        startTranslate: void 0,
        allowThresholdMove: void 0,
        // Form elements to match
        focusableElements: swiper.params.focusableElements,
        // Last click time
        lastClickTime: 0,
        clickTimeout: void 0,
        // Velocities
        velocities: [],
        allowMomentumBounce: void 0,
        startMoving: void 0,
        evCache: []
      },
      // Clicks
      allowClick: true,
      // Touches
      allowTouchMove: swiper.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0
    });
    swiper.emit("_swiper");
    if (swiper.params.init) {
      swiper.init();
    }
    return swiper;
  }
  getSlideIndex(slideEl) {
    const {
      slidesEl,
      params
    } = this;
    const slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
    const firstSlideIndex = elementIndex(slides[0]);
    return elementIndex(slideEl) - firstSlideIndex;
  }
  getSlideIndexByData(index) {
    return this.getSlideIndex(this.slides.filter((slideEl) => slideEl.getAttribute("data-swiper-slide-index") * 1 === index)[0]);
  }
  recalcSlides() {
    const swiper = this;
    const {
      slidesEl,
      params
    } = swiper;
    swiper.slides = elementChildren(slidesEl, `.${params.slideClass}, swiper-slide`);
  }
  enable() {
    const swiper = this;
    if (swiper.enabled)
      return;
    swiper.enabled = true;
    if (swiper.params.grabCursor) {
      swiper.setGrabCursor();
    }
    swiper.emit("enable");
  }
  disable() {
    const swiper = this;
    if (!swiper.enabled)
      return;
    swiper.enabled = false;
    if (swiper.params.grabCursor) {
      swiper.unsetGrabCursor();
    }
    swiper.emit("disable");
  }
  setProgress(progress, speed) {
    const swiper = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;
    swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  emitContainerClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el)
      return;
    const cls = swiper.el.className.split(" ").filter((className) => {
      return className.indexOf("swiper") === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
    });
    swiper.emit("_containerClasses", cls.join(" "));
  }
  getSlideClasses(slideEl) {
    const swiper = this;
    if (swiper.destroyed)
      return "";
    return slideEl.className.split(" ").filter((className) => {
      return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper.params.slideClass) === 0;
    }).join(" ");
  }
  emitSlidesClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el)
      return;
    const updates = [];
    swiper.slides.forEach((slideEl) => {
      const classNames = swiper.getSlideClasses(slideEl);
      updates.push({
        slideEl,
        classNames
      });
      swiper.emit("_slideClass", slideEl, classNames);
    });
    swiper.emit("_slideClasses", updates);
  }
  slidesPerViewDynamic(view, exact) {
    if (view === void 0) {
      view = "current";
    }
    if (exact === void 0) {
      exact = false;
    }
    const swiper = this;
    const {
      params,
      slides,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex
    } = swiper;
    let spv = 1;
    if (params.centeredSlides) {
      let slideSize = slides[activeIndex] ? slides[activeIndex].swiperSlideSize : 0;
      let breakLoop;
      for (let i2 = activeIndex + 1; i2 < slides.length; i2 += 1) {
        if (slides[i2] && !breakLoop) {
          slideSize += slides[i2].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize)
            breakLoop = true;
        }
      }
      for (let i2 = activeIndex - 1; i2 >= 0; i2 -= 1) {
        if (slides[i2] && !breakLoop) {
          slideSize += slides[i2].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize)
            breakLoop = true;
        }
      }
    } else {
      if (view === "current") {
        for (let i2 = activeIndex + 1; i2 < slides.length; i2 += 1) {
          const slideInView = exact ? slidesGrid[i2] + slidesSizesGrid[i2] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i2] - slidesGrid[activeIndex] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        for (let i2 = activeIndex - 1; i2 >= 0; i2 -= 1) {
          const slideInView = slidesGrid[activeIndex] - slidesGrid[i2] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      }
    }
    return spv;
  }
  update() {
    const swiper = this;
    if (!swiper || swiper.destroyed)
      return;
    const {
      snapGrid,
      params
    } = swiper;
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach((imageEl) => {
      if (imageEl.complete) {
        processLazyPreloader(swiper, imageEl);
      }
    });
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateSlidesClasses();
    function setTranslate2() {
      const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
      const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
      swiper.setTranslate(newTranslate);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    let translated;
    if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
      setTranslate2();
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
    } else {
      if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper.isEnd && !params.centeredSlides) {
        const slides = swiper.virtual && params.virtual.enabled ? swiper.virtual.slides : swiper.slides;
        translated = swiper.slideTo(slides.length - 1, 0, false, true);
      } else {
        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
      if (!translated) {
        setTranslate2();
      }
    }
    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
    swiper.emit("update");
  }
  changeDirection(newDirection, needUpdate) {
    if (needUpdate === void 0) {
      needUpdate = true;
    }
    const swiper = this;
    const currentDirection = swiper.params.direction;
    if (!newDirection) {
      newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
    }
    if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") {
      return swiper;
    }
    swiper.el.classList.remove(`${swiper.params.containerModifierClass}${currentDirection}`);
    swiper.el.classList.add(`${swiper.params.containerModifierClass}${newDirection}`);
    swiper.emitContainerClasses();
    swiper.params.direction = newDirection;
    swiper.slides.forEach((slideEl) => {
      if (newDirection === "vertical") {
        slideEl.style.width = "";
      } else {
        slideEl.style.height = "";
      }
    });
    swiper.emit("changeDirection");
    if (needUpdate)
      swiper.update();
    return swiper;
  }
  changeLanguageDirection(direction) {
    const swiper = this;
    if (swiper.rtl && direction === "rtl" || !swiper.rtl && direction === "ltr")
      return;
    swiper.rtl = direction === "rtl";
    swiper.rtlTranslate = swiper.params.direction === "horizontal" && swiper.rtl;
    if (swiper.rtl) {
      swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = "rtl";
    } else {
      swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = "ltr";
    }
    swiper.update();
  }
  mount(element) {
    const swiper = this;
    if (swiper.mounted)
      return true;
    let el = element || swiper.params.el;
    if (typeof el === "string") {
      el = document.querySelector(el);
    }
    if (!el) {
      return false;
    }
    el.swiper = swiper;
    if (el.parentNode && el.parentNode.host) {
      swiper.isElement = true;
    }
    const getWrapperSelector = () => {
      return `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
    };
    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = el.shadowRoot.querySelector(getWrapperSelector());
        return res;
      }
      return elementChildren(el, getWrapperSelector())[0];
    };
    let wrapperEl = getWrapper();
    if (!wrapperEl && swiper.params.createElements) {
      wrapperEl = createElement("div", swiper.params.wrapperClass);
      el.append(wrapperEl);
      elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl) => {
        wrapperEl.append(slideEl);
      });
    }
    Object.assign(swiper, {
      el,
      wrapperEl,
      slidesEl: swiper.isElement ? el.parentNode.host : wrapperEl,
      hostEl: swiper.isElement ? el.parentNode.host : el,
      mounted: true,
      // RTL
      rtl: el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl",
      rtlTranslate: swiper.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || elementStyle(el, "direction") === "rtl"),
      wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box"
    });
    return true;
  }
  init(el) {
    const swiper = this;
    if (swiper.initialized)
      return swiper;
    const mounted = swiper.mount(el);
    if (mounted === false)
      return swiper;
    swiper.emit("beforeInit");
    if (swiper.params.breakpoints) {
      swiper.setBreakpoint();
    }
    swiper.addClasses();
    swiper.updateSize();
    swiper.updateSlides();
    if (swiper.params.watchOverflow) {
      swiper.checkOverflow();
    }
    if (swiper.params.grabCursor && swiper.enabled) {
      swiper.setGrabCursor();
    }
    if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
      swiper.slideTo(swiper.params.initialSlide + swiper.virtual.slidesBefore, 0, swiper.params.runCallbacksOnInit, false, true);
    } else {
      swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
    }
    if (swiper.params.loop) {
      swiper.loopCreate();
    }
    swiper.attachEvents();
    [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach((imageEl) => {
      if (imageEl.complete) {
        processLazyPreloader(swiper, imageEl);
      } else {
        imageEl.addEventListener("load", (e2) => {
          processLazyPreloader(swiper, e2.target);
        });
      }
    });
    preload(swiper);
    swiper.initialized = true;
    preload(swiper);
    swiper.emit("init");
    swiper.emit("afterInit");
    return swiper;
  }
  destroy(deleteInstance, cleanStyles) {
    if (deleteInstance === void 0) {
      deleteInstance = true;
    }
    if (cleanStyles === void 0) {
      cleanStyles = true;
    }
    const swiper = this;
    const {
      params,
      el,
      wrapperEl,
      slides
    } = swiper;
    if (typeof swiper.params === "undefined" || swiper.destroyed) {
      return null;
    }
    swiper.emit("beforeDestroy");
    swiper.initialized = false;
    swiper.detachEvents();
    if (params.loop) {
      swiper.loopDestroy();
    }
    if (cleanStyles) {
      swiper.removeClasses();
      el.removeAttribute("style");
      wrapperEl.removeAttribute("style");
      if (slides && slides.length) {
        slides.forEach((slideEl) => {
          slideEl.classList.remove(params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass);
          slideEl.removeAttribute("style");
          slideEl.removeAttribute("data-swiper-slide-index");
        });
      }
    }
    swiper.emit("destroy");
    Object.keys(swiper.eventsListeners).forEach((eventName) => {
      swiper.off(eventName);
    });
    if (deleteInstance !== false) {
      swiper.el.swiper = null;
      deleteProps(swiper);
    }
    swiper.destroyed = true;
    return null;
  }
  static extendDefaults(newDefaults) {
    extend2(extendedDefaults, newDefaults);
  }
  static get extendedDefaults() {
    return extendedDefaults;
  }
  static get defaults() {
    return defaults;
  }
  static installModule(mod) {
    if (!_Swiper.prototype.__modules__)
      _Swiper.prototype.__modules__ = [];
    const modules = _Swiper.prototype.__modules__;
    if (typeof mod === "function" && modules.indexOf(mod) < 0) {
      modules.push(mod);
    }
  }
  static use(module) {
    if (Array.isArray(module)) {
      module.forEach((m2) => _Swiper.installModule(m2));
      return _Swiper;
    }
    _Swiper.installModule(module);
    return _Swiper;
  }
};
Object.keys(prototypes).forEach((prototypeGroup) => {
  Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
    Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper.use([Resize, Observer]);

// node_modules/swiper/modules/keyboard.mjs
function Keyboard(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const document2 = getDocument();
  const window2 = getWindow();
  swiper.keyboard = {
    enabled: false
  };
  extendParams({
    keyboard: {
      enabled: false,
      onlyInViewport: true,
      pageUpDown: true
    }
  });
  function handle(event2) {
    if (!swiper.enabled)
      return;
    const {
      rtlTranslate: rtl
    } = swiper;
    let e2 = event2;
    if (e2.originalEvent)
      e2 = e2.originalEvent;
    const kc = e2.keyCode || e2.charCode;
    const pageUpDown = swiper.params.keyboard.pageUpDown;
    const isPageUp = pageUpDown && kc === 33;
    const isPageDown = pageUpDown && kc === 34;
    const isArrowLeft = kc === 37;
    const isArrowRight = kc === 39;
    const isArrowUp = kc === 38;
    const isArrowDown = kc === 40;
    if (!swiper.allowSlideNext && (swiper.isHorizontal() && isArrowRight || swiper.isVertical() && isArrowDown || isPageDown)) {
      return false;
    }
    if (!swiper.allowSlidePrev && (swiper.isHorizontal() && isArrowLeft || swiper.isVertical() && isArrowUp || isPageUp)) {
      return false;
    }
    if (e2.shiftKey || e2.altKey || e2.ctrlKey || e2.metaKey) {
      return void 0;
    }
    if (document2.activeElement && document2.activeElement.nodeName && (document2.activeElement.nodeName.toLowerCase() === "input" || document2.activeElement.nodeName.toLowerCase() === "textarea")) {
      return void 0;
    }
    if (swiper.params.keyboard.onlyInViewport && (isPageUp || isPageDown || isArrowLeft || isArrowRight || isArrowUp || isArrowDown)) {
      let inView = false;
      if (elementParents(swiper.el, `.${swiper.params.slideClass}, swiper-slide`).length > 0 && elementParents(swiper.el, `.${swiper.params.slideActiveClass}`).length === 0) {
        return void 0;
      }
      const el = swiper.el;
      const swiperWidth = el.clientWidth;
      const swiperHeight = el.clientHeight;
      const windowWidth = window2.innerWidth;
      const windowHeight = window2.innerHeight;
      const swiperOffset = elementOffset(el);
      if (rtl)
        swiperOffset.left -= el.scrollLeft;
      const swiperCoord = [[swiperOffset.left, swiperOffset.top], [swiperOffset.left + swiperWidth, swiperOffset.top], [swiperOffset.left, swiperOffset.top + swiperHeight], [swiperOffset.left + swiperWidth, swiperOffset.top + swiperHeight]];
      for (let i2 = 0; i2 < swiperCoord.length; i2 += 1) {
        const point = swiperCoord[i2];
        if (point[0] >= 0 && point[0] <= windowWidth && point[1] >= 0 && point[1] <= windowHeight) {
          if (point[0] === 0 && point[1] === 0)
            continue;
          inView = true;
        }
      }
      if (!inView)
        return void 0;
    }
    if (swiper.isHorizontal()) {
      if (isPageUp || isPageDown || isArrowLeft || isArrowRight) {
        if (e2.preventDefault)
          e2.preventDefault();
        else
          e2.returnValue = false;
      }
      if ((isPageDown || isArrowRight) && !rtl || (isPageUp || isArrowLeft) && rtl)
        swiper.slideNext();
      if ((isPageUp || isArrowLeft) && !rtl || (isPageDown || isArrowRight) && rtl)
        swiper.slidePrev();
    } else {
      if (isPageUp || isPageDown || isArrowUp || isArrowDown) {
        if (e2.preventDefault)
          e2.preventDefault();
        else
          e2.returnValue = false;
      }
      if (isPageDown || isArrowDown)
        swiper.slideNext();
      if (isPageUp || isArrowUp)
        swiper.slidePrev();
    }
    emit("keyPress", kc);
    return void 0;
  }
  function enable() {
    if (swiper.keyboard.enabled)
      return;
    document2.addEventListener("keydown", handle);
    swiper.keyboard.enabled = true;
  }
  function disable() {
    if (!swiper.keyboard.enabled)
      return;
    document2.removeEventListener("keydown", handle);
    swiper.keyboard.enabled = false;
  }
  on("init", () => {
    if (swiper.params.keyboard.enabled) {
      enable();
    }
  });
  on("destroy", () => {
    if (swiper.keyboard.enabled) {
      disable();
    }
  });
  Object.assign(swiper.keyboard, {
    enable,
    disable
  });
}

// node_modules/swiper/shared/create-element-if-not-defined.mjs
function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  if (swiper.params.createElements) {
    Object.keys(checkProps).forEach((key) => {
      if (!params[key] && params.auto === true) {
        let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0];
        if (!element) {
          element = createElement("div", checkProps[key]);
          element.className = checkProps[key];
          swiper.el.append(element);
        }
        params[key] = element;
        originalParams[key] = element;
      }
    });
  }
  return params;
}

// node_modules/swiper/modules/navigation.mjs
function Navigation(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      disabledClass: "swiper-button-disabled",
      hiddenClass: "swiper-button-hidden",
      lockClass: "swiper-button-lock",
      navigationDisabledClass: "swiper-navigation-disabled"
    }
  });
  swiper.navigation = {
    nextEl: null,
    prevEl: null
  };
  const makeElementsArray = (el) => {
    if (!Array.isArray(el))
      el = [el].filter((e2) => !!e2);
    return el;
  };
  function getEl(el) {
    let res;
    if (el && typeof el === "string" && swiper.isElement) {
      res = swiper.el.querySelector(el);
      if (res)
        return res;
    }
    if (el) {
      if (typeof el === "string")
        res = [...document.querySelectorAll(el)];
      if (swiper.params.uniqueNavElements && typeof el === "string" && res.length > 1 && swiper.el.querySelectorAll(el).length === 1) {
        res = swiper.el.querySelector(el);
      }
    }
    if (el && !res)
      return el;
    return res;
  }
  function toggleEl(el, disabled) {
    const params = swiper.params.navigation;
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      if (subEl) {
        subEl.classList[disabled ? "add" : "remove"](...params.disabledClass.split(" "));
        if (subEl.tagName === "BUTTON")
          subEl.disabled = disabled;
        if (swiper.params.watchOverflow && swiper.enabled) {
          subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
        }
      }
    });
  }
  function update2() {
    const {
      nextEl,
      prevEl
    } = swiper.navigation;
    if (swiper.params.loop) {
      toggleEl(prevEl, false);
      toggleEl(nextEl, false);
      return;
    }
    toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
    toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
  }
  function onPrevClick(e2) {
    e2.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind)
      return;
    swiper.slidePrev();
    emit("navigationPrev");
  }
  function onNextClick(e2) {
    e2.preventDefault();
    if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind)
      return;
    swiper.slideNext();
    emit("navigationNext");
  }
  function init() {
    const params = swiper.params.navigation;
    swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
      nextEl: "swiper-button-next",
      prevEl: "swiper-button-prev"
    });
    if (!(params.nextEl || params.prevEl))
      return;
    let nextEl = getEl(params.nextEl);
    let prevEl = getEl(params.prevEl);
    Object.assign(swiper.navigation, {
      nextEl,
      prevEl
    });
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const initButton = (el, dir) => {
      if (el) {
        el.addEventListener("click", dir === "next" ? onNextClick : onPrevClick);
      }
      if (!swiper.enabled && el) {
        el.classList.add(...params.lockClass.split(" "));
      }
    };
    nextEl.forEach((el) => initButton(el, "next"));
    prevEl.forEach((el) => initButton(el, "prev"));
  }
  function destroy() {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const destroyButton = (el, dir) => {
      el.removeEventListener("click", dir === "next" ? onNextClick : onPrevClick);
      el.classList.remove(...swiper.params.navigation.disabledClass.split(" "));
    };
    nextEl.forEach((el) => destroyButton(el, "next"));
    prevEl.forEach((el) => destroyButton(el, "prev"));
  }
  on("init", () => {
    if (swiper.params.navigation.enabled === false) {
      disable();
    } else {
      init();
      update2();
    }
  });
  on("toEdge fromEdge lock unlock", () => {
    update2();
  });
  on("destroy", () => {
    destroy();
  });
  on("enable disable", () => {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    [...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList[swiper.enabled ? "remove" : "add"](swiper.params.navigation.lockClass));
  });
  on("click", (_s, e2) => {
    let {
      nextEl,
      prevEl
    } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const targetEl = e2.target;
    if (swiper.params.navigation.hideOnClick && !prevEl.includes(targetEl) && !nextEl.includes(targetEl)) {
      if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl)))
        return;
      let isHidden;
      if (nextEl.length) {
        isHidden = nextEl[0].classList.contains(swiper.params.navigation.hiddenClass);
      } else if (prevEl.length) {
        isHidden = prevEl[0].classList.contains(swiper.params.navigation.hiddenClass);
      }
      if (isHidden === true) {
        emit("navigationShow");
      } else {
        emit("navigationHide");
      }
      [...nextEl, ...prevEl].filter((el) => !!el).forEach((el) => el.classList.toggle(swiper.params.navigation.hiddenClass));
    }
  });
  const enable = () => {
    swiper.el.classList.remove(...swiper.params.navigation.navigationDisabledClass.split(" "));
    init();
    update2();
  };
  const disable = () => {
    swiper.el.classList.add(...swiper.params.navigation.navigationDisabledClass.split(" "));
    destroy();
  };
  Object.assign(swiper.navigation, {
    enable,
    disable,
    update: update2,
    init,
    destroy
  });
}

// node_modules/swiper/shared/classes-to-selector.mjs
function classesToSelector(classes2) {
  if (classes2 === void 0) {
    classes2 = "";
  }
  return `.${classes2.trim().replace(/([\.:!+\/])/g, "\\$1").replace(/ /g, ".")}`;
}

// node_modules/swiper/modules/pagination.mjs
function Pagination(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const pfx = "swiper-pagination";
  extendParams({
    pagination: {
      el: null,
      bulletElement: "span",
      clickable: false,
      hideOnClick: false,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: false,
      type: "bullets",
      // 'bullets' or 'progressbar' or 'fraction' or 'custom'
      dynamicBullets: false,
      dynamicMainBullets: 1,
      formatFractionCurrent: (number) => number,
      formatFractionTotal: (number) => number,
      bulletClass: `${pfx}-bullet`,
      bulletActiveClass: `${pfx}-bullet-active`,
      modifierClass: `${pfx}-`,
      currentClass: `${pfx}-current`,
      totalClass: `${pfx}-total`,
      hiddenClass: `${pfx}-hidden`,
      progressbarFillClass: `${pfx}-progressbar-fill`,
      progressbarOppositeClass: `${pfx}-progressbar-opposite`,
      clickableClass: `${pfx}-clickable`,
      lockClass: `${pfx}-lock`,
      horizontalClass: `${pfx}-horizontal`,
      verticalClass: `${pfx}-vertical`,
      paginationDisabledClass: `${pfx}-disabled`
    }
  });
  swiper.pagination = {
    el: null,
    bullets: []
  };
  let bulletSize;
  let dynamicBulletIndex = 0;
  const makeElementsArray = (el) => {
    if (!Array.isArray(el))
      el = [el].filter((e2) => !!e2);
    return el;
  };
  function isPaginationDisabled() {
    return !swiper.params.pagination.el || !swiper.pagination.el || Array.isArray(swiper.pagination.el) && swiper.pagination.el.length === 0;
  }
  function setSideBullets(bulletEl, position) {
    const {
      bulletActiveClass
    } = swiper.params.pagination;
    if (!bulletEl)
      return;
    bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
    if (bulletEl) {
      bulletEl.classList.add(`${bulletActiveClass}-${position}`);
      bulletEl = bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
      if (bulletEl) {
        bulletEl.classList.add(`${bulletActiveClass}-${position}-${position}`);
      }
    }
  }
  function onBulletClick(e2) {
    const bulletEl = e2.target.closest(classesToSelector(swiper.params.pagination.bulletClass));
    if (!bulletEl) {
      return;
    }
    e2.preventDefault();
    const index = elementIndex(bulletEl) * swiper.params.slidesPerGroup;
    if (swiper.params.loop) {
      if (swiper.realIndex === index)
        return;
      const newSlideIndex = swiper.getSlideIndexByData(index);
      const currentSlideIndex = swiper.getSlideIndexByData(swiper.realIndex);
      if (newSlideIndex > swiper.slides.length - swiper.loopedSlides) {
        swiper.loopFix({
          direction: newSlideIndex > currentSlideIndex ? "next" : "prev",
          activeSlideIndex: newSlideIndex,
          slideTo: false
        });
      }
      swiper.slideToLoop(index);
    } else {
      swiper.slideTo(index);
    }
  }
  function update2() {
    const rtl = swiper.rtl;
    const params = swiper.params.pagination;
    if (isPaginationDisabled())
      return;
    let el = swiper.pagination.el;
    el = makeElementsArray(el);
    let current;
    let previousIndex;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    const total = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
    if (swiper.params.loop) {
      previousIndex = swiper.previousRealIndex || 0;
      current = swiper.params.slidesPerGroup > 1 ? Math.floor(swiper.realIndex / swiper.params.slidesPerGroup) : swiper.realIndex;
    } else if (typeof swiper.snapIndex !== "undefined") {
      current = swiper.snapIndex;
      previousIndex = swiper.previousSnapIndex;
    } else {
      previousIndex = swiper.previousIndex || 0;
      current = swiper.activeIndex || 0;
    }
    if (params.type === "bullets" && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
      const bullets = swiper.pagination.bullets;
      let firstIndex;
      let lastIndex;
      let midIndex;
      if (params.dynamicBullets) {
        bulletSize = elementOuterSize(bullets[0], swiper.isHorizontal() ? "width" : "height", true);
        el.forEach((subEl) => {
          subEl.style[swiper.isHorizontal() ? "width" : "height"] = `${bulletSize * (params.dynamicMainBullets + 4)}px`;
        });
        if (params.dynamicMainBullets > 1 && previousIndex !== void 0) {
          dynamicBulletIndex += current - (previousIndex || 0);
          if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
            dynamicBulletIndex = params.dynamicMainBullets - 1;
          } else if (dynamicBulletIndex < 0) {
            dynamicBulletIndex = 0;
          }
        }
        firstIndex = Math.max(current - dynamicBulletIndex, 0);
        lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
        midIndex = (lastIndex + firstIndex) / 2;
      }
      bullets.forEach((bulletEl) => {
        const classesToRemove = [...["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((suffix) => `${params.bulletActiveClass}${suffix}`)].map((s2) => typeof s2 === "string" && s2.includes(" ") ? s2.split(" ") : s2).flat();
        bulletEl.classList.remove(...classesToRemove);
      });
      if (el.length > 1) {
        bullets.forEach((bullet) => {
          const bulletIndex = elementIndex(bullet);
          if (bulletIndex === current) {
            bullet.classList.add(...params.bulletActiveClass.split(" "));
          } else if (swiper.isElement) {
            bullet.setAttribute("part", "bullet");
          }
          if (params.dynamicBullets) {
            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
              bullet.classList.add(...`${params.bulletActiveClass}-main`.split(" "));
            }
            if (bulletIndex === firstIndex) {
              setSideBullets(bullet, "prev");
            }
            if (bulletIndex === lastIndex) {
              setSideBullets(bullet, "next");
            }
          }
        });
      } else {
        const bullet = bullets[current];
        if (bullet) {
          bullet.classList.add(...params.bulletActiveClass.split(" "));
        }
        if (swiper.isElement) {
          bullets.forEach((bulletEl, bulletIndex) => {
            bulletEl.setAttribute("part", bulletIndex === current ? "bullet-active" : "bullet");
          });
        }
        if (params.dynamicBullets) {
          const firstDisplayedBullet = bullets[firstIndex];
          const lastDisplayedBullet = bullets[lastIndex];
          for (let i2 = firstIndex; i2 <= lastIndex; i2 += 1) {
            if (bullets[i2]) {
              bullets[i2].classList.add(...`${params.bulletActiveClass}-main`.split(" "));
            }
          }
          setSideBullets(firstDisplayedBullet, "prev");
          setSideBullets(lastDisplayedBullet, "next");
        }
      }
      if (params.dynamicBullets) {
        const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
        const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
        const offsetProp = rtl ? "right" : "left";
        bullets.forEach((bullet) => {
          bullet.style[swiper.isHorizontal() ? offsetProp : "top"] = `${bulletsOffset}px`;
        });
      }
    }
    el.forEach((subEl, subElIndex) => {
      if (params.type === "fraction") {
        subEl.querySelectorAll(classesToSelector(params.currentClass)).forEach((fractionEl) => {
          fractionEl.textContent = params.formatFractionCurrent(current + 1);
        });
        subEl.querySelectorAll(classesToSelector(params.totalClass)).forEach((totalEl) => {
          totalEl.textContent = params.formatFractionTotal(total);
        });
      }
      if (params.type === "progressbar") {
        let progressbarDirection;
        if (params.progressbarOpposite) {
          progressbarDirection = swiper.isHorizontal() ? "vertical" : "horizontal";
        } else {
          progressbarDirection = swiper.isHorizontal() ? "horizontal" : "vertical";
        }
        const scale = (current + 1) / total;
        let scaleX = 1;
        let scaleY = 1;
        if (progressbarDirection === "horizontal") {
          scaleX = scale;
        } else {
          scaleY = scale;
        }
        subEl.querySelectorAll(classesToSelector(params.progressbarFillClass)).forEach((progressEl) => {
          progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
          progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
        });
      }
      if (params.type === "custom" && params.renderCustom) {
        subEl.innerHTML = params.renderCustom(swiper, current + 1, total);
        if (subElIndex === 0)
          emit("paginationRender", subEl);
      } else {
        if (subElIndex === 0)
          emit("paginationRender", subEl);
        emit("paginationUpdate", subEl);
      }
      if (swiper.params.watchOverflow && swiper.enabled) {
        subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
      }
    });
  }
  function render() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled())
      return;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    let el = swiper.pagination.el;
    el = makeElementsArray(el);
    let paginationHTML = "";
    if (params.type === "bullets") {
      let numberOfBullets = swiper.params.loop ? Math.ceil(slidesLength / swiper.params.slidesPerGroup) : swiper.snapGrid.length;
      if (swiper.params.freeMode && swiper.params.freeMode.enabled && numberOfBullets > slidesLength) {
        numberOfBullets = slidesLength;
      }
      for (let i2 = 0; i2 < numberOfBullets; i2 += 1) {
        if (params.renderBullet) {
          paginationHTML += params.renderBullet.call(swiper, i2, params.bulletClass);
        } else {
          paginationHTML += `<${params.bulletElement} ${swiper.isElement ? 'part="bullet"' : ""} class="${params.bulletClass}"></${params.bulletElement}>`;
        }
      }
    }
    if (params.type === "fraction") {
      if (params.renderFraction) {
        paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
      } else {
        paginationHTML = `<span class="${params.currentClass}"></span> / <span class="${params.totalClass}"></span>`;
      }
    }
    if (params.type === "progressbar") {
      if (params.renderProgressbar) {
        paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
      } else {
        paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
      }
    }
    swiper.pagination.bullets = [];
    el.forEach((subEl) => {
      if (params.type !== "custom") {
        subEl.innerHTML = paginationHTML || "";
      }
      if (params.type === "bullets") {
        swiper.pagination.bullets.push(...subEl.querySelectorAll(classesToSelector(params.bulletClass)));
      }
    });
    if (params.type !== "custom") {
      emit("paginationRender", el[0]);
    }
  }
  function init() {
    swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
      el: "swiper-pagination"
    });
    const params = swiper.params.pagination;
    if (!params.el)
      return;
    let el;
    if (typeof params.el === "string" && swiper.isElement) {
      el = swiper.el.querySelector(params.el);
    }
    if (!el && typeof params.el === "string") {
      el = [...document.querySelectorAll(params.el)];
    }
    if (!el) {
      el = params.el;
    }
    if (!el || el.length === 0)
      return;
    if (swiper.params.uniqueNavElements && typeof params.el === "string" && Array.isArray(el) && el.length > 1) {
      el = [...swiper.el.querySelectorAll(params.el)];
      if (el.length > 1) {
        el = el.filter((subEl) => {
          if (elementParents(subEl, ".swiper")[0] !== swiper.el)
            return false;
          return true;
        })[0];
      }
    }
    if (Array.isArray(el) && el.length === 1)
      el = el[0];
    Object.assign(swiper.pagination, {
      el
    });
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      if (params.type === "bullets" && params.clickable) {
        subEl.classList.add(params.clickableClass);
      }
      subEl.classList.add(params.modifierClass + params.type);
      subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
      if (params.type === "bullets" && params.dynamicBullets) {
        subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
        dynamicBulletIndex = 0;
        if (params.dynamicMainBullets < 1) {
          params.dynamicMainBullets = 1;
        }
      }
      if (params.type === "progressbar" && params.progressbarOpposite) {
        subEl.classList.add(params.progressbarOppositeClass);
      }
      if (params.clickable) {
        subEl.addEventListener("click", onBulletClick);
      }
      if (!swiper.enabled) {
        subEl.classList.add(params.lockClass);
      }
    });
  }
  function destroy() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled())
      return;
    let el = swiper.pagination.el;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) => {
        subEl.classList.remove(params.hiddenClass);
        subEl.classList.remove(params.modifierClass + params.type);
        subEl.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
        if (params.clickable) {
          subEl.removeEventListener("click", onBulletClick);
        }
      });
    }
    if (swiper.pagination.bullets)
      swiper.pagination.bullets.forEach((subEl) => subEl.classList.remove(...params.bulletActiveClass.split(" ")));
  }
  on("changeDirection", () => {
    if (!swiper.pagination || !swiper.pagination.el)
      return;
    const params = swiper.params.pagination;
    let {
      el
    } = swiper.pagination;
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.classList.remove(params.horizontalClass, params.verticalClass);
      subEl.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    });
  });
  on("init", () => {
    if (swiper.params.pagination.enabled === false) {
      disable();
    } else {
      init();
      render();
      update2();
    }
  });
  on("activeIndexChange", () => {
    if (typeof swiper.snapIndex === "undefined") {
      update2();
    }
  });
  on("snapIndexChange", () => {
    update2();
  });
  on("snapGridLengthChange", () => {
    render();
    update2();
  });
  on("destroy", () => {
    destroy();
  });
  on("enable disable", () => {
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) => subEl.classList[swiper.enabled ? "remove" : "add"](swiper.params.pagination.lockClass));
    }
  });
  on("lock unlock", () => {
    update2();
  });
  on("click", (_s, e2) => {
    const targetEl = e2.target;
    const el = makeElementsArray(swiper.pagination.el);
    if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && el && el.length > 0 && !targetEl.classList.contains(swiper.params.pagination.bulletClass)) {
      if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl))
        return;
      const isHidden = el[0].classList.contains(swiper.params.pagination.hiddenClass);
      if (isHidden === true) {
        emit("paginationShow");
      } else {
        emit("paginationHide");
      }
      el.forEach((subEl) => subEl.classList.toggle(swiper.params.pagination.hiddenClass));
    }
  });
  const enable = () => {
    swiper.el.classList.remove(swiper.params.pagination.paginationDisabledClass);
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) => subEl.classList.remove(swiper.params.pagination.paginationDisabledClass));
    }
    init();
    render();
    update2();
  };
  const disable = () => {
    swiper.el.classList.add(swiper.params.pagination.paginationDisabledClass);
    let {
      el
    } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) => subEl.classList.add(swiper.params.pagination.paginationDisabledClass));
    }
    destroy();
  };
  Object.assign(swiper.pagination, {
    enable,
    disable,
    render,
    update: update2,
    init,
    destroy
  });
}

// node_modules/swiper/modules/scrollbar.mjs
function Scrollbar(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const document2 = getDocument();
  let isTouched = false;
  let timeout = null;
  let dragTimeout = null;
  let dragStartPos;
  let dragSize;
  let trackSize;
  let divider;
  extendParams({
    scrollbar: {
      el: null,
      dragSize: "auto",
      hide: false,
      draggable: false,
      snapOnRelease: true,
      lockClass: "swiper-scrollbar-lock",
      dragClass: "swiper-scrollbar-drag",
      scrollbarDisabledClass: "swiper-scrollbar-disabled",
      horizontalClass: `swiper-scrollbar-horizontal`,
      verticalClass: `swiper-scrollbar-vertical`
    }
  });
  swiper.scrollbar = {
    el: null,
    dragEl: null
  };
  function setTranslate2() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el)
      return;
    const {
      scrollbar,
      rtlTranslate: rtl
    } = swiper;
    const {
      dragEl,
      el
    } = scrollbar;
    const params = swiper.params.scrollbar;
    const progress = swiper.params.loop ? swiper.progressLoop : swiper.progress;
    let newSize = dragSize;
    let newPos = (trackSize - dragSize) * progress;
    if (rtl) {
      newPos = -newPos;
      if (newPos > 0) {
        newSize = dragSize - newPos;
        newPos = 0;
      } else if (-newPos + dragSize > trackSize) {
        newSize = trackSize + newPos;
      }
    } else if (newPos < 0) {
      newSize = dragSize + newPos;
      newPos = 0;
    } else if (newPos + dragSize > trackSize) {
      newSize = trackSize - newPos;
    }
    if (swiper.isHorizontal()) {
      dragEl.style.transform = `translate3d(${newPos}px, 0, 0)`;
      dragEl.style.width = `${newSize}px`;
    } else {
      dragEl.style.transform = `translate3d(0px, ${newPos}px, 0)`;
      dragEl.style.height = `${newSize}px`;
    }
    if (params.hide) {
      clearTimeout(timeout);
      el.style.opacity = 1;
      timeout = setTimeout(() => {
        el.style.opacity = 0;
        el.style.transitionDuration = "400ms";
      }, 1e3);
    }
  }
  function setTransition2(duration) {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el)
      return;
    swiper.scrollbar.dragEl.style.transitionDuration = `${duration}ms`;
  }
  function updateSize2() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el)
      return;
    const {
      scrollbar
    } = swiper;
    const {
      dragEl,
      el
    } = scrollbar;
    dragEl.style.width = "";
    dragEl.style.height = "";
    trackSize = swiper.isHorizontal() ? el.offsetWidth : el.offsetHeight;
    divider = swiper.size / (swiper.virtualSize + swiper.params.slidesOffsetBefore - (swiper.params.centeredSlides ? swiper.snapGrid[0] : 0));
    if (swiper.params.scrollbar.dragSize === "auto") {
      dragSize = trackSize * divider;
    } else {
      dragSize = parseInt(swiper.params.scrollbar.dragSize, 10);
    }
    if (swiper.isHorizontal()) {
      dragEl.style.width = `${dragSize}px`;
    } else {
      dragEl.style.height = `${dragSize}px`;
    }
    if (divider >= 1) {
      el.style.display = "none";
    } else {
      el.style.display = "";
    }
    if (swiper.params.scrollbar.hide) {
      el.style.opacity = 0;
    }
    if (swiper.params.watchOverflow && swiper.enabled) {
      scrollbar.el.classList[swiper.isLocked ? "add" : "remove"](swiper.params.scrollbar.lockClass);
    }
  }
  function getPointerPosition(e2) {
    return swiper.isHorizontal() ? e2.clientX : e2.clientY;
  }
  function setDragPosition(e2) {
    const {
      scrollbar,
      rtlTranslate: rtl
    } = swiper;
    const {
      el
    } = scrollbar;
    let positionRatio;
    positionRatio = (getPointerPosition(e2) - elementOffset(el)[swiper.isHorizontal() ? "left" : "top"] - (dragStartPos !== null ? dragStartPos : dragSize / 2)) / (trackSize - dragSize);
    positionRatio = Math.max(Math.min(positionRatio, 1), 0);
    if (rtl) {
      positionRatio = 1 - positionRatio;
    }
    const position = swiper.minTranslate() + (swiper.maxTranslate() - swiper.minTranslate()) * positionRatio;
    swiper.updateProgress(position);
    swiper.setTranslate(position);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  function onDragStart(e2) {
    const params = swiper.params.scrollbar;
    const {
      scrollbar,
      wrapperEl
    } = swiper;
    const {
      el,
      dragEl
    } = scrollbar;
    isTouched = true;
    dragStartPos = e2.target === dragEl ? getPointerPosition(e2) - e2.target.getBoundingClientRect()[swiper.isHorizontal() ? "left" : "top"] : null;
    e2.preventDefault();
    e2.stopPropagation();
    wrapperEl.style.transitionDuration = "100ms";
    dragEl.style.transitionDuration = "100ms";
    setDragPosition(e2);
    clearTimeout(dragTimeout);
    el.style.transitionDuration = "0ms";
    if (params.hide) {
      el.style.opacity = 1;
    }
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style["scroll-snap-type"] = "none";
    }
    emit("scrollbarDragStart", e2);
  }
  function onDragMove(e2) {
    const {
      scrollbar,
      wrapperEl
    } = swiper;
    const {
      el,
      dragEl
    } = scrollbar;
    if (!isTouched)
      return;
    if (e2.preventDefault)
      e2.preventDefault();
    else
      e2.returnValue = false;
    setDragPosition(e2);
    wrapperEl.style.transitionDuration = "0ms";
    el.style.transitionDuration = "0ms";
    dragEl.style.transitionDuration = "0ms";
    emit("scrollbarDragMove", e2);
  }
  function onDragEnd(e2) {
    const params = swiper.params.scrollbar;
    const {
      scrollbar,
      wrapperEl
    } = swiper;
    const {
      el
    } = scrollbar;
    if (!isTouched)
      return;
    isTouched = false;
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style["scroll-snap-type"] = "";
      wrapperEl.style.transitionDuration = "";
    }
    if (params.hide) {
      clearTimeout(dragTimeout);
      dragTimeout = nextTick(() => {
        el.style.opacity = 0;
        el.style.transitionDuration = "400ms";
      }, 1e3);
    }
    emit("scrollbarDragEnd", e2);
    if (params.snapOnRelease) {
      swiper.slideToClosest();
    }
  }
  function events2(method) {
    const {
      scrollbar,
      params
    } = swiper;
    const el = scrollbar.el;
    if (!el)
      return;
    const target = el;
    const activeListener = params.passiveListeners ? {
      passive: false,
      capture: false
    } : false;
    const passiveListener = params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    if (!target)
      return;
    const eventMethod = method === "on" ? "addEventListener" : "removeEventListener";
    target[eventMethod]("pointerdown", onDragStart, activeListener);
    document2[eventMethod]("pointermove", onDragMove, activeListener);
    document2[eventMethod]("pointerup", onDragEnd, passiveListener);
  }
  function enableDraggable() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el)
      return;
    events2("on");
  }
  function disableDraggable() {
    if (!swiper.params.scrollbar.el || !swiper.scrollbar.el)
      return;
    events2("off");
  }
  function init() {
    const {
      scrollbar,
      el: swiperEl
    } = swiper;
    swiper.params.scrollbar = createElementIfNotDefined(swiper, swiper.originalParams.scrollbar, swiper.params.scrollbar, {
      el: "swiper-scrollbar"
    });
    const params = swiper.params.scrollbar;
    if (!params.el)
      return;
    let el;
    if (typeof params.el === "string" && swiper.isElement) {
      el = swiper.el.querySelector(params.el);
    }
    if (!el && typeof params.el === "string") {
      el = document2.querySelectorAll(params.el);
    } else if (!el) {
      el = params.el;
    }
    if (swiper.params.uniqueNavElements && typeof params.el === "string" && el.length > 1 && swiperEl.querySelectorAll(params.el).length === 1) {
      el = swiperEl.querySelector(params.el);
    }
    if (el.length > 0)
      el = el[0];
    el.classList.add(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    let dragEl;
    if (el) {
      dragEl = el.querySelector(`.${swiper.params.scrollbar.dragClass}`);
      if (!dragEl) {
        dragEl = createElement("div", swiper.params.scrollbar.dragClass);
        el.append(dragEl);
      }
    }
    Object.assign(scrollbar, {
      el,
      dragEl
    });
    if (params.draggable) {
      enableDraggable();
    }
    if (el) {
      el.classList[swiper.enabled ? "remove" : "add"](swiper.params.scrollbar.lockClass);
    }
  }
  function destroy() {
    const params = swiper.params.scrollbar;
    const el = swiper.scrollbar.el;
    if (el) {
      el.classList.remove(swiper.isHorizontal() ? params.horizontalClass : params.verticalClass);
    }
    disableDraggable();
  }
  on("init", () => {
    if (swiper.params.scrollbar.enabled === false) {
      disable();
    } else {
      init();
      updateSize2();
      setTranslate2();
    }
  });
  on("update resize observerUpdate lock unlock", () => {
    updateSize2();
  });
  on("setTranslate", () => {
    setTranslate2();
  });
  on("setTransition", (_s, duration) => {
    setTransition2(duration);
  });
  on("enable disable", () => {
    const {
      el
    } = swiper.scrollbar;
    if (el) {
      el.classList[swiper.enabled ? "remove" : "add"](swiper.params.scrollbar.lockClass);
    }
  });
  on("destroy", () => {
    destroy();
  });
  const enable = () => {
    swiper.el.classList.remove(swiper.params.scrollbar.scrollbarDisabledClass);
    if (swiper.scrollbar.el) {
      swiper.scrollbar.el.classList.remove(swiper.params.scrollbar.scrollbarDisabledClass);
    }
    init();
    updateSize2();
    setTranslate2();
  };
  const disable = () => {
    swiper.el.classList.add(swiper.params.scrollbar.scrollbarDisabledClass);
    if (swiper.scrollbar.el) {
      swiper.scrollbar.el.classList.add(swiper.params.scrollbar.scrollbarDisabledClass);
    }
    destroy();
  };
  Object.assign(swiper.scrollbar, {
    enable,
    disable,
    updateSize: updateSize2,
    setTranslate: setTranslate2,
    init,
    destroy
  });
}

// node_modules/swiper/modules/zoom.mjs
function Zoom(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit
  } = _ref;
  const window2 = getWindow();
  extendParams({
    zoom: {
      enabled: false,
      maxRatio: 3,
      minRatio: 1,
      toggle: true,
      containerClass: "swiper-zoom-container",
      zoomedSlideClass: "swiper-slide-zoomed"
    }
  });
  swiper.zoom = {
    enabled: false
  };
  let currentScale = 1;
  let isScaling = false;
  let fakeGestureTouched;
  let fakeGestureMoved;
  const evCache = [];
  const gesture = {
    originX: 0,
    originY: 0,
    slideEl: void 0,
    slideWidth: void 0,
    slideHeight: void 0,
    imageEl: void 0,
    imageWrapEl: void 0,
    maxRatio: 3
  };
  const image = {
    isTouched: void 0,
    isMoved: void 0,
    currentX: void 0,
    currentY: void 0,
    minX: void 0,
    minY: void 0,
    maxX: void 0,
    maxY: void 0,
    width: void 0,
    height: void 0,
    startX: void 0,
    startY: void 0,
    touchesStart: {},
    touchesCurrent: {}
  };
  const velocity = {
    x: void 0,
    y: void 0,
    prevPositionX: void 0,
    prevPositionY: void 0,
    prevTime: void 0
  };
  let scale = 1;
  Object.defineProperty(swiper.zoom, "scale", {
    get() {
      return scale;
    },
    set(value) {
      if (scale !== value) {
        const imageEl = gesture.imageEl;
        const slideEl = gesture.slideEl;
        emit("zoomChange", value, imageEl, slideEl);
      }
      scale = value;
    }
  });
  function getDistanceBetweenTouches() {
    if (evCache.length < 2)
      return 1;
    const x1 = evCache[0].pageX;
    const y1 = evCache[0].pageY;
    const x2 = evCache[1].pageX;
    const y2 = evCache[1].pageY;
    const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    return distance;
  }
  function getScaleOrigin() {
    if (evCache.length < 2)
      return {
        x: null,
        y: null
      };
    const box = gesture.imageEl.getBoundingClientRect();
    return [(evCache[0].pageX + (evCache[1].pageX - evCache[0].pageX) / 2 - box.x) / currentScale, (evCache[0].pageY + (evCache[1].pageY - evCache[0].pageY) / 2 - box.y) / currentScale];
  }
  function getSlideSelector() {
    return swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
  }
  function eventWithinSlide(e2) {
    const slideSelector = getSlideSelector();
    if (e2.target.matches(slideSelector))
      return true;
    if (swiper.slides.filter((slideEl) => slideEl.contains(e2.target)).length > 0)
      return true;
    return false;
  }
  function eventWithinZoomContainer(e2) {
    const selector = `.${swiper.params.zoom.containerClass}`;
    if (e2.target.matches(selector))
      return true;
    if ([...swiper.el.querySelectorAll(selector)].filter((containerEl) => containerEl.contains(e2.target)).length > 0)
      return true;
    return false;
  }
  function onGestureStart(e2) {
    if (e2.pointerType === "mouse") {
      evCache.splice(0, evCache.length);
    }
    if (!eventWithinSlide(e2))
      return;
    const params = swiper.params.zoom;
    fakeGestureTouched = false;
    fakeGestureMoved = false;
    evCache.push(e2);
    if (evCache.length < 2) {
      return;
    }
    fakeGestureTouched = true;
    gesture.scaleStart = getDistanceBetweenTouches();
    if (!gesture.slideEl) {
      gesture.slideEl = e2.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
      if (!gesture.slideEl)
        gesture.slideEl = swiper.slides[swiper.activeIndex];
      let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
      if (imageEl) {
        imageEl = imageEl.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0];
      }
      gesture.imageEl = imageEl;
      if (imageEl) {
        gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
      } else {
        gesture.imageWrapEl = void 0;
      }
      if (!gesture.imageWrapEl) {
        gesture.imageEl = void 0;
        return;
      }
      gesture.maxRatio = gesture.imageWrapEl.getAttribute("data-swiper-zoom") || params.maxRatio;
    }
    if (gesture.imageEl) {
      const [originX, originY] = getScaleOrigin();
      gesture.originX = originX;
      gesture.originY = originY;
      gesture.imageEl.style.transitionDuration = "0ms";
    }
    isScaling = true;
  }
  function onGestureChange(e2) {
    if (!eventWithinSlide(e2))
      return;
    const params = swiper.params.zoom;
    const zoom = swiper.zoom;
    const pointerIndex = evCache.findIndex((cachedEv) => cachedEv.pointerId === e2.pointerId);
    if (pointerIndex >= 0)
      evCache[pointerIndex] = e2;
    if (evCache.length < 2) {
      return;
    }
    fakeGestureMoved = true;
    gesture.scaleMove = getDistanceBetweenTouches();
    if (!gesture.imageEl) {
      return;
    }
    zoom.scale = gesture.scaleMove / gesture.scaleStart * currentScale;
    if (zoom.scale > gesture.maxRatio) {
      zoom.scale = gesture.maxRatio - 1 + (zoom.scale - gesture.maxRatio + 1) ** 0.5;
    }
    if (zoom.scale < params.minRatio) {
      zoom.scale = params.minRatio + 1 - (params.minRatio - zoom.scale + 1) ** 0.5;
    }
    gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
  }
  function onGestureEnd(e2) {
    if (!eventWithinSlide(e2))
      return;
    if (e2.pointerType === "mouse" && e2.type === "pointerout")
      return;
    const params = swiper.params.zoom;
    const zoom = swiper.zoom;
    const pointerIndex = evCache.findIndex((cachedEv) => cachedEv.pointerId === e2.pointerId);
    if (pointerIndex >= 0)
      evCache.splice(pointerIndex, 1);
    if (!fakeGestureTouched || !fakeGestureMoved) {
      return;
    }
    fakeGestureTouched = false;
    fakeGestureMoved = false;
    if (!gesture.imageEl)
      return;
    zoom.scale = Math.max(Math.min(zoom.scale, gesture.maxRatio), params.minRatio);
    gesture.imageEl.style.transitionDuration = `${swiper.params.speed}ms`;
    gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
    currentScale = zoom.scale;
    isScaling = false;
    if (zoom.scale > 1 && gesture.slideEl) {
      gesture.slideEl.classList.add(`${params.zoomedSlideClass}`);
    } else if (zoom.scale <= 1 && gesture.slideEl) {
      gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`);
    }
    if (zoom.scale === 1) {
      gesture.originX = 0;
      gesture.originY = 0;
      gesture.slideEl = void 0;
    }
  }
  function onTouchStart2(e2) {
    const device = swiper.device;
    if (!gesture.imageEl)
      return;
    if (image.isTouched)
      return;
    if (device.android && e2.cancelable)
      e2.preventDefault();
    image.isTouched = true;
    const event2 = evCache.length > 0 ? evCache[0] : e2;
    image.touchesStart.x = event2.pageX;
    image.touchesStart.y = event2.pageY;
  }
  function onTouchMove2(e2) {
    if (!eventWithinSlide(e2) || !eventWithinZoomContainer(e2))
      return;
    const zoom = swiper.zoom;
    if (!gesture.imageEl)
      return;
    if (!image.isTouched || !gesture.slideEl)
      return;
    if (!image.isMoved) {
      image.width = gesture.imageEl.offsetWidth;
      image.height = gesture.imageEl.offsetHeight;
      image.startX = getTranslate(gesture.imageWrapEl, "x") || 0;
      image.startY = getTranslate(gesture.imageWrapEl, "y") || 0;
      gesture.slideWidth = gesture.slideEl.offsetWidth;
      gesture.slideHeight = gesture.slideEl.offsetHeight;
      gesture.imageWrapEl.style.transitionDuration = "0ms";
    }
    const scaledWidth = image.width * zoom.scale;
    const scaledHeight = image.height * zoom.scale;
    if (scaledWidth < gesture.slideWidth && scaledHeight < gesture.slideHeight)
      return;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.touchesCurrent.x = evCache.length > 0 ? evCache[0].pageX : e2.pageX;
    image.touchesCurrent.y = evCache.length > 0 ? evCache[0].pageY : e2.pageY;
    const touchesDiff = Math.max(Math.abs(image.touchesCurrent.x - image.touchesStart.x), Math.abs(image.touchesCurrent.y - image.touchesStart.y));
    if (touchesDiff > 5) {
      swiper.allowClick = false;
    }
    if (!image.isMoved && !isScaling) {
      if (swiper.isHorizontal() && (Math.floor(image.minX) === Math.floor(image.startX) && image.touchesCurrent.x < image.touchesStart.x || Math.floor(image.maxX) === Math.floor(image.startX) && image.touchesCurrent.x > image.touchesStart.x)) {
        image.isTouched = false;
        return;
      }
      if (!swiper.isHorizontal() && (Math.floor(image.minY) === Math.floor(image.startY) && image.touchesCurrent.y < image.touchesStart.y || Math.floor(image.maxY) === Math.floor(image.startY) && image.touchesCurrent.y > image.touchesStart.y)) {
        image.isTouched = false;
        return;
      }
    }
    if (e2.cancelable) {
      e2.preventDefault();
    }
    e2.stopPropagation();
    image.isMoved = true;
    const scaleRatio = (zoom.scale - currentScale) / (gesture.maxRatio - swiper.params.zoom.minRatio);
    const {
      originX,
      originY
    } = gesture;
    image.currentX = image.touchesCurrent.x - image.touchesStart.x + image.startX + scaleRatio * (image.width - originX * 2);
    image.currentY = image.touchesCurrent.y - image.touchesStart.y + image.startY + scaleRatio * (image.height - originY * 2);
    if (image.currentX < image.minX) {
      image.currentX = image.minX + 1 - (image.minX - image.currentX + 1) ** 0.8;
    }
    if (image.currentX > image.maxX) {
      image.currentX = image.maxX - 1 + (image.currentX - image.maxX + 1) ** 0.8;
    }
    if (image.currentY < image.minY) {
      image.currentY = image.minY + 1 - (image.minY - image.currentY + 1) ** 0.8;
    }
    if (image.currentY > image.maxY) {
      image.currentY = image.maxY - 1 + (image.currentY - image.maxY + 1) ** 0.8;
    }
    if (!velocity.prevPositionX)
      velocity.prevPositionX = image.touchesCurrent.x;
    if (!velocity.prevPositionY)
      velocity.prevPositionY = image.touchesCurrent.y;
    if (!velocity.prevTime)
      velocity.prevTime = Date.now();
    velocity.x = (image.touchesCurrent.x - velocity.prevPositionX) / (Date.now() - velocity.prevTime) / 2;
    velocity.y = (image.touchesCurrent.y - velocity.prevPositionY) / (Date.now() - velocity.prevTime) / 2;
    if (Math.abs(image.touchesCurrent.x - velocity.prevPositionX) < 2)
      velocity.x = 0;
    if (Math.abs(image.touchesCurrent.y - velocity.prevPositionY) < 2)
      velocity.y = 0;
    velocity.prevPositionX = image.touchesCurrent.x;
    velocity.prevPositionY = image.touchesCurrent.y;
    velocity.prevTime = Date.now();
    gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`;
  }
  function onTouchEnd2() {
    const zoom = swiper.zoom;
    if (!gesture.imageEl)
      return;
    if (!image.isTouched || !image.isMoved) {
      image.isTouched = false;
      image.isMoved = false;
      return;
    }
    image.isTouched = false;
    image.isMoved = false;
    let momentumDurationX = 300;
    let momentumDurationY = 300;
    const momentumDistanceX = velocity.x * momentumDurationX;
    const newPositionX = image.currentX + momentumDistanceX;
    const momentumDistanceY = velocity.y * momentumDurationY;
    const newPositionY = image.currentY + momentumDistanceY;
    if (velocity.x !== 0)
      momentumDurationX = Math.abs((newPositionX - image.currentX) / velocity.x);
    if (velocity.y !== 0)
      momentumDurationY = Math.abs((newPositionY - image.currentY) / velocity.y);
    const momentumDuration = Math.max(momentumDurationX, momentumDurationY);
    image.currentX = newPositionX;
    image.currentY = newPositionY;
    const scaledWidth = image.width * zoom.scale;
    const scaledHeight = image.height * zoom.scale;
    image.minX = Math.min(gesture.slideWidth / 2 - scaledWidth / 2, 0);
    image.maxX = -image.minX;
    image.minY = Math.min(gesture.slideHeight / 2 - scaledHeight / 2, 0);
    image.maxY = -image.minY;
    image.currentX = Math.max(Math.min(image.currentX, image.maxX), image.minX);
    image.currentY = Math.max(Math.min(image.currentY, image.maxY), image.minY);
    gesture.imageWrapEl.style.transitionDuration = `${momentumDuration}ms`;
    gesture.imageWrapEl.style.transform = `translate3d(${image.currentX}px, ${image.currentY}px,0)`;
  }
  function onTransitionEnd() {
    const zoom = swiper.zoom;
    if (gesture.slideEl && swiper.activeIndex !== swiper.slides.indexOf(gesture.slideEl)) {
      if (gesture.imageEl) {
        gesture.imageEl.style.transform = "translate3d(0,0,0) scale(1)";
      }
      if (gesture.imageWrapEl) {
        gesture.imageWrapEl.style.transform = "translate3d(0,0,0)";
      }
      gesture.slideEl.classList.remove(`${swiper.params.zoom.zoomedSlideClass}`);
      zoom.scale = 1;
      currentScale = 1;
      gesture.slideEl = void 0;
      gesture.imageEl = void 0;
      gesture.imageWrapEl = void 0;
      gesture.originX = 0;
      gesture.originY = 0;
    }
  }
  function zoomIn(e2) {
    const zoom = swiper.zoom;
    const params = swiper.params.zoom;
    if (!gesture.slideEl) {
      if (e2 && e2.target) {
        gesture.slideEl = e2.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
      }
      if (!gesture.slideEl) {
        if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
          gesture.slideEl = elementChildren(swiper.slidesEl, `.${swiper.params.slideActiveClass}`)[0];
        } else {
          gesture.slideEl = swiper.slides[swiper.activeIndex];
        }
      }
      let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
      if (imageEl) {
        imageEl = imageEl.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0];
      }
      gesture.imageEl = imageEl;
      if (imageEl) {
        gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
      } else {
        gesture.imageWrapEl = void 0;
      }
    }
    if (!gesture.imageEl || !gesture.imageWrapEl)
      return;
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style.overflow = "hidden";
      swiper.wrapperEl.style.touchAction = "none";
    }
    gesture.slideEl.classList.add(`${params.zoomedSlideClass}`);
    let touchX;
    let touchY;
    let offsetX;
    let offsetY;
    let diffX;
    let diffY;
    let translateX;
    let translateY;
    let imageWidth;
    let imageHeight;
    let scaledWidth;
    let scaledHeight;
    let translateMinX;
    let translateMinY;
    let translateMaxX;
    let translateMaxY;
    let slideWidth;
    let slideHeight;
    if (typeof image.touchesStart.x === "undefined" && e2) {
      touchX = e2.pageX;
      touchY = e2.pageY;
    } else {
      touchX = image.touchesStart.x;
      touchY = image.touchesStart.y;
    }
    const forceZoomRatio = typeof e2 === "number" ? e2 : null;
    if (currentScale === 1 && forceZoomRatio) {
      touchX = void 0;
      touchY = void 0;
    }
    zoom.scale = forceZoomRatio || gesture.imageWrapEl.getAttribute("data-swiper-zoom") || params.maxRatio;
    currentScale = forceZoomRatio || gesture.imageWrapEl.getAttribute("data-swiper-zoom") || params.maxRatio;
    if (e2 && !(currentScale === 1 && forceZoomRatio)) {
      slideWidth = gesture.slideEl.offsetWidth;
      slideHeight = gesture.slideEl.offsetHeight;
      offsetX = elementOffset(gesture.slideEl).left + window2.scrollX;
      offsetY = elementOffset(gesture.slideEl).top + window2.scrollY;
      diffX = offsetX + slideWidth / 2 - touchX;
      diffY = offsetY + slideHeight / 2 - touchY;
      imageWidth = gesture.imageEl.offsetWidth;
      imageHeight = gesture.imageEl.offsetHeight;
      scaledWidth = imageWidth * zoom.scale;
      scaledHeight = imageHeight * zoom.scale;
      translateMinX = Math.min(slideWidth / 2 - scaledWidth / 2, 0);
      translateMinY = Math.min(slideHeight / 2 - scaledHeight / 2, 0);
      translateMaxX = -translateMinX;
      translateMaxY = -translateMinY;
      translateX = diffX * zoom.scale;
      translateY = diffY * zoom.scale;
      if (translateX < translateMinX) {
        translateX = translateMinX;
      }
      if (translateX > translateMaxX) {
        translateX = translateMaxX;
      }
      if (translateY < translateMinY) {
        translateY = translateMinY;
      }
      if (translateY > translateMaxY) {
        translateY = translateMaxY;
      }
    } else {
      translateX = 0;
      translateY = 0;
    }
    if (forceZoomRatio && zoom.scale === 1) {
      gesture.originX = 0;
      gesture.originY = 0;
    }
    gesture.imageWrapEl.style.transitionDuration = "300ms";
    gesture.imageWrapEl.style.transform = `translate3d(${translateX}px, ${translateY}px,0)`;
    gesture.imageEl.style.transitionDuration = "300ms";
    gesture.imageEl.style.transform = `translate3d(0,0,0) scale(${zoom.scale})`;
  }
  function zoomOut() {
    const zoom = swiper.zoom;
    const params = swiper.params.zoom;
    if (!gesture.slideEl) {
      if (swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual) {
        gesture.slideEl = elementChildren(swiper.slidesEl, `.${swiper.params.slideActiveClass}`)[0];
      } else {
        gesture.slideEl = swiper.slides[swiper.activeIndex];
      }
      let imageEl = gesture.slideEl.querySelector(`.${params.containerClass}`);
      if (imageEl) {
        imageEl = imageEl.querySelectorAll("picture, img, svg, canvas, .swiper-zoom-target")[0];
      }
      gesture.imageEl = imageEl;
      if (imageEl) {
        gesture.imageWrapEl = elementParents(gesture.imageEl, `.${params.containerClass}`)[0];
      } else {
        gesture.imageWrapEl = void 0;
      }
    }
    if (!gesture.imageEl || !gesture.imageWrapEl)
      return;
    if (swiper.params.cssMode) {
      swiper.wrapperEl.style.overflow = "";
      swiper.wrapperEl.style.touchAction = "";
    }
    zoom.scale = 1;
    currentScale = 1;
    gesture.imageWrapEl.style.transitionDuration = "300ms";
    gesture.imageWrapEl.style.transform = "translate3d(0,0,0)";
    gesture.imageEl.style.transitionDuration = "300ms";
    gesture.imageEl.style.transform = "translate3d(0,0,0) scale(1)";
    gesture.slideEl.classList.remove(`${params.zoomedSlideClass}`);
    gesture.slideEl = void 0;
    gesture.originX = 0;
    gesture.originY = 0;
  }
  function zoomToggle(e2) {
    const zoom = swiper.zoom;
    if (zoom.scale && zoom.scale !== 1) {
      zoomOut();
    } else {
      zoomIn(e2);
    }
  }
  function getListeners() {
    const passiveListener = swiper.params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    const activeListenerWithCapture = swiper.params.passiveListeners ? {
      passive: false,
      capture: true
    } : true;
    return {
      passiveListener,
      activeListenerWithCapture
    };
  }
  function enable() {
    const zoom = swiper.zoom;
    if (zoom.enabled)
      return;
    zoom.enabled = true;
    const {
      passiveListener,
      activeListenerWithCapture
    } = getListeners();
    swiper.wrapperEl.addEventListener("pointerdown", onGestureStart, passiveListener);
    swiper.wrapperEl.addEventListener("pointermove", onGestureChange, activeListenerWithCapture);
    ["pointerup", "pointercancel", "pointerout"].forEach((eventName) => {
      swiper.wrapperEl.addEventListener(eventName, onGestureEnd, passiveListener);
    });
    swiper.wrapperEl.addEventListener("pointermove", onTouchMove2, activeListenerWithCapture);
  }
  function disable() {
    const zoom = swiper.zoom;
    if (!zoom.enabled)
      return;
    zoom.enabled = false;
    const {
      passiveListener,
      activeListenerWithCapture
    } = getListeners();
    swiper.wrapperEl.removeEventListener("pointerdown", onGestureStart, passiveListener);
    swiper.wrapperEl.removeEventListener("pointermove", onGestureChange, activeListenerWithCapture);
    ["pointerup", "pointercancel", "pointerout"].forEach((eventName) => {
      swiper.wrapperEl.removeEventListener(eventName, onGestureEnd, passiveListener);
    });
    swiper.wrapperEl.removeEventListener("pointermove", onTouchMove2, activeListenerWithCapture);
  }
  on("init", () => {
    if (swiper.params.zoom.enabled) {
      enable();
    }
  });
  on("destroy", () => {
    disable();
  });
  on("touchStart", (_s, e2) => {
    if (!swiper.zoom.enabled)
      return;
    onTouchStart2(e2);
  });
  on("touchEnd", (_s, e2) => {
    if (!swiper.zoom.enabled)
      return;
    onTouchEnd2();
  });
  on("doubleTap", (_s, e2) => {
    if (!swiper.animating && swiper.params.zoom.enabled && swiper.zoom.enabled && swiper.params.zoom.toggle) {
      zoomToggle(e2);
    }
  });
  on("transitionEnd", () => {
    if (swiper.zoom.enabled && swiper.params.zoom.enabled) {
      onTransitionEnd();
    }
  });
  on("slideChange", () => {
    if (swiper.zoom.enabled && swiper.params.zoom.enabled && swiper.params.cssMode) {
      onTransitionEnd();
    }
  });
  Object.assign(swiper.zoom, {
    enable,
    disable,
    in: zoomIn,
    out: zoomOut,
    toggle: zoomToggle
  });
}

// node_modules/swiper/modules/a11y.mjs
function A11y(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    a11y: {
      enabled: true,
      notificationClass: "swiper-notification",
      prevSlideMessage: "Previous slide",
      nextSlideMessage: "Next slide",
      firstSlideMessage: "This is the first slide",
      lastSlideMessage: "This is the last slide",
      paginationBulletMessage: "Go to slide {{index}}",
      slideLabelMessage: "{{index}} / {{slidesLength}}",
      containerMessage: null,
      containerRoleDescriptionMessage: null,
      itemRoleDescriptionMessage: null,
      slideRole: "group",
      id: null
    }
  });
  swiper.a11y = {
    clicked: false
  };
  let liveRegion = null;
  function notify(message) {
    const notification = liveRegion;
    if (notification.length === 0)
      return;
    notification.innerHTML = "";
    notification.innerHTML = message;
  }
  const makeElementsArray = (el) => {
    if (!Array.isArray(el))
      el = [el].filter((e2) => !!e2);
    return el;
  };
  function getRandomNumber(size) {
    if (size === void 0) {
      size = 16;
    }
    const randomChar = () => Math.round(16 * Math.random()).toString(16);
    return "x".repeat(size).replace(/x/g, randomChar);
  }
  function makeElFocusable(el) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("tabIndex", "0");
    });
  }
  function makeElNotFocusable(el) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("tabIndex", "-1");
    });
  }
  function addElRole(el, role) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("role", role);
    });
  }
  function addElRoleDescription(el, description) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("aria-roledescription", description);
    });
  }
  function addElControls(el, controls) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("aria-controls", controls);
    });
  }
  function addElLabel(el, label) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("aria-label", label);
    });
  }
  function addElId(el, id) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("id", id);
    });
  }
  function addElLive(el, live) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("aria-live", live);
    });
  }
  function disableEl(el) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("aria-disabled", true);
    });
  }
  function enableEl(el) {
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.setAttribute("aria-disabled", false);
    });
  }
  function onEnterOrSpaceKey(e2) {
    if (e2.keyCode !== 13 && e2.keyCode !== 32)
      return;
    const params = swiper.params.a11y;
    const targetEl = e2.target;
    if (swiper.pagination && swiper.pagination.el && (targetEl === swiper.pagination.el || swiper.pagination.el.contains(e2.target))) {
      if (!e2.target.matches(classesToSelector(swiper.params.pagination.bulletClass)))
        return;
    }
    if (swiper.navigation && swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl) {
      if (!(swiper.isEnd && !swiper.params.loop)) {
        swiper.slideNext();
      }
      if (swiper.isEnd) {
        notify(params.lastSlideMessage);
      } else {
        notify(params.nextSlideMessage);
      }
    }
    if (swiper.navigation && swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl) {
      if (!(swiper.isBeginning && !swiper.params.loop)) {
        swiper.slidePrev();
      }
      if (swiper.isBeginning) {
        notify(params.firstSlideMessage);
      } else {
        notify(params.prevSlideMessage);
      }
    }
    if (swiper.pagination && targetEl.matches(classesToSelector(swiper.params.pagination.bulletClass))) {
      targetEl.click();
    }
  }
  function updateNavigation() {
    if (swiper.params.loop || swiper.params.rewind || !swiper.navigation)
      return;
    const {
      nextEl,
      prevEl
    } = swiper.navigation;
    if (prevEl) {
      if (swiper.isBeginning) {
        disableEl(prevEl);
        makeElNotFocusable(prevEl);
      } else {
        enableEl(prevEl);
        makeElFocusable(prevEl);
      }
    }
    if (nextEl) {
      if (swiper.isEnd) {
        disableEl(nextEl);
        makeElNotFocusable(nextEl);
      } else {
        enableEl(nextEl);
        makeElFocusable(nextEl);
      }
    }
  }
  function hasPagination() {
    return swiper.pagination && swiper.pagination.bullets && swiper.pagination.bullets.length;
  }
  function hasClickablePagination() {
    return hasPagination() && swiper.params.pagination.clickable;
  }
  function updatePagination() {
    const params = swiper.params.a11y;
    if (!hasPagination())
      return;
    swiper.pagination.bullets.forEach((bulletEl) => {
      if (swiper.params.pagination.clickable) {
        makeElFocusable(bulletEl);
        if (!swiper.params.pagination.renderBullet) {
          addElRole(bulletEl, "button");
          addElLabel(bulletEl, params.paginationBulletMessage.replace(/\{\{index\}\}/, elementIndex(bulletEl) + 1));
        }
      }
      if (bulletEl.matches(classesToSelector(swiper.params.pagination.bulletActiveClass))) {
        bulletEl.setAttribute("aria-current", "true");
      } else {
        bulletEl.removeAttribute("aria-current");
      }
    });
  }
  const initNavEl = (el, wrapperId, message) => {
    makeElFocusable(el);
    if (el.tagName !== "BUTTON") {
      addElRole(el, "button");
      el.addEventListener("keydown", onEnterOrSpaceKey);
    }
    addElLabel(el, message);
    addElControls(el, wrapperId);
  };
  const handlePointerDown = () => {
    swiper.a11y.clicked = true;
  };
  const handlePointerUp = () => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!swiper.destroyed) {
          swiper.a11y.clicked = false;
        }
      });
    });
  };
  const handleFocus = (e2) => {
    if (swiper.a11y.clicked)
      return;
    const slideEl = e2.target.closest(`.${swiper.params.slideClass}, swiper-slide`);
    if (!slideEl || !swiper.slides.includes(slideEl))
      return;
    const isActive = swiper.slides.indexOf(slideEl) === swiper.activeIndex;
    const isVisible = swiper.params.watchSlidesProgress && swiper.visibleSlides && swiper.visibleSlides.includes(slideEl);
    if (isActive || isVisible)
      return;
    if (e2.sourceCapabilities && e2.sourceCapabilities.firesTouchEvents)
      return;
    if (swiper.isHorizontal()) {
      swiper.el.scrollLeft = 0;
    } else {
      swiper.el.scrollTop = 0;
    }
    swiper.slideTo(swiper.slides.indexOf(slideEl), 0);
  };
  const initSlides = () => {
    const params = swiper.params.a11y;
    if (params.itemRoleDescriptionMessage) {
      addElRoleDescription(swiper.slides, params.itemRoleDescriptionMessage);
    }
    if (params.slideRole) {
      addElRole(swiper.slides, params.slideRole);
    }
    const slidesLength = swiper.slides.length;
    if (params.slideLabelMessage) {
      swiper.slides.forEach((slideEl, index) => {
        const slideIndex = swiper.params.loop ? parseInt(slideEl.getAttribute("data-swiper-slide-index"), 10) : index;
        const ariaLabelMessage = params.slideLabelMessage.replace(/\{\{index\}\}/, slideIndex + 1).replace(/\{\{slidesLength\}\}/, slidesLength);
        addElLabel(slideEl, ariaLabelMessage);
      });
    }
  };
  const init = () => {
    const params = swiper.params.a11y;
    swiper.el.append(liveRegion);
    const containerEl = swiper.el;
    if (params.containerRoleDescriptionMessage) {
      addElRoleDescription(containerEl, params.containerRoleDescriptionMessage);
    }
    if (params.containerMessage) {
      addElLabel(containerEl, params.containerMessage);
    }
    const wrapperEl = swiper.wrapperEl;
    const wrapperId = params.id || wrapperEl.getAttribute("id") || `swiper-wrapper-${getRandomNumber(16)}`;
    const live = swiper.params.autoplay && swiper.params.autoplay.enabled ? "off" : "polite";
    addElId(wrapperEl, wrapperId);
    addElLive(wrapperEl, live);
    initSlides();
    let {
      nextEl,
      prevEl
    } = swiper.navigation ? swiper.navigation : {};
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    if (nextEl) {
      nextEl.forEach((el) => initNavEl(el, wrapperId, params.nextSlideMessage));
    }
    if (prevEl) {
      prevEl.forEach((el) => initNavEl(el, wrapperId, params.prevSlideMessage));
    }
    if (hasClickablePagination()) {
      const paginationEl = Array.isArray(swiper.pagination.el) ? swiper.pagination.el : [swiper.pagination.el];
      paginationEl.forEach((el) => {
        el.addEventListener("keydown", onEnterOrSpaceKey);
      });
    }
    swiper.el.addEventListener("focus", handleFocus, true);
    swiper.el.addEventListener("pointerdown", handlePointerDown, true);
    swiper.el.addEventListener("pointerup", handlePointerUp, true);
  };
  function destroy() {
    if (liveRegion)
      liveRegion.remove();
    let {
      nextEl,
      prevEl
    } = swiper.navigation ? swiper.navigation : {};
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    if (nextEl) {
      nextEl.forEach((el) => el.removeEventListener("keydown", onEnterOrSpaceKey));
    }
    if (prevEl) {
      prevEl.forEach((el) => el.removeEventListener("keydown", onEnterOrSpaceKey));
    }
    if (hasClickablePagination()) {
      const paginationEl = Array.isArray(swiper.pagination.el) ? swiper.pagination.el : [swiper.pagination.el];
      paginationEl.forEach((el) => {
        el.removeEventListener("keydown", onEnterOrSpaceKey);
      });
    }
    swiper.el.removeEventListener("focus", handleFocus, true);
    swiper.el.removeEventListener("pointerdown", handlePointerDown, true);
    swiper.el.removeEventListener("pointerup", handlePointerUp, true);
  }
  on("beforeInit", () => {
    liveRegion = createElement("span", swiper.params.a11y.notificationClass);
    liveRegion.setAttribute("aria-live", "assertive");
    liveRegion.setAttribute("aria-atomic", "true");
  });
  on("afterInit", () => {
    if (!swiper.params.a11y.enabled)
      return;
    init();
  });
  on("slidesLengthChange snapGridLengthChange slidesGridLengthChange", () => {
    if (!swiper.params.a11y.enabled)
      return;
    initSlides();
  });
  on("fromEdge toEdge afterInit lock unlock", () => {
    if (!swiper.params.a11y.enabled)
      return;
    updateNavigation();
  });
  on("paginationUpdate", () => {
    if (!swiper.params.a11y.enabled)
      return;
    updatePagination();
  });
  on("destroy", () => {
    if (!swiper.params.a11y.enabled)
      return;
    destroy();
  });
}

// node_modules/swiper/modules/autoplay.mjs
function Autoplay(_ref) {
  let {
    swiper,
    extendParams,
    on,
    emit,
    params
  } = _ref;
  swiper.autoplay = {
    running: false,
    paused: false,
    timeLeft: 0
  };
  extendParams({
    autoplay: {
      enabled: false,
      delay: 3e3,
      waitForTransition: true,
      disableOnInteraction: true,
      stopOnLastSlide: false,
      reverseDirection: false,
      pauseOnMouseEnter: false
    }
  });
  let timeout;
  let raf;
  let autoplayDelayTotal = params && params.autoplay ? params.autoplay.delay : 3e3;
  let autoplayDelayCurrent = params && params.autoplay ? params.autoplay.delay : 3e3;
  let autoplayTimeLeft;
  let autoplayStartTime = (/* @__PURE__ */ new Date()).getTime;
  let wasPaused;
  let isTouched;
  let pausedByTouch;
  let touchStartTimeout;
  let slideChanged;
  let pausedByInteraction;
  function onTransitionEnd(e2) {
    if (!swiper || swiper.destroyed || !swiper.wrapperEl)
      return;
    if (e2.target !== swiper.wrapperEl)
      return;
    swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd);
    resume();
  }
  const calcTimeLeft = () => {
    if (swiper.destroyed || !swiper.autoplay.running)
      return;
    if (swiper.autoplay.paused) {
      wasPaused = true;
    } else if (wasPaused) {
      autoplayDelayCurrent = autoplayTimeLeft;
      wasPaused = false;
    }
    const timeLeft = swiper.autoplay.paused ? autoplayTimeLeft : autoplayStartTime + autoplayDelayCurrent - (/* @__PURE__ */ new Date()).getTime();
    swiper.autoplay.timeLeft = timeLeft;
    emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal);
    raf = requestAnimationFrame(() => {
      calcTimeLeft();
    });
  };
  const getSlideDelay = () => {
    let activeSlideEl;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      activeSlideEl = swiper.slides.filter((slideEl) => slideEl.classList.contains("swiper-slide-active"))[0];
    } else {
      activeSlideEl = swiper.slides[swiper.activeIndex];
    }
    if (!activeSlideEl)
      return void 0;
    const currentSlideDelay = parseInt(activeSlideEl.getAttribute("data-swiper-autoplay"), 10);
    return currentSlideDelay;
  };
  const run = (delayForce) => {
    if (swiper.destroyed || !swiper.autoplay.running)
      return;
    cancelAnimationFrame(raf);
    calcTimeLeft();
    let delay = typeof delayForce === "undefined" ? swiper.params.autoplay.delay : delayForce;
    autoplayDelayTotal = swiper.params.autoplay.delay;
    autoplayDelayCurrent = swiper.params.autoplay.delay;
    const currentSlideDelay = getSlideDelay();
    if (!Number.isNaN(currentSlideDelay) && currentSlideDelay > 0 && typeof delayForce === "undefined") {
      delay = currentSlideDelay;
      autoplayDelayTotal = currentSlideDelay;
      autoplayDelayCurrent = currentSlideDelay;
    }
    autoplayTimeLeft = delay;
    const speed = swiper.params.speed;
    const proceed = () => {
      if (!swiper || swiper.destroyed)
        return;
      if (swiper.params.autoplay.reverseDirection) {
        if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
          swiper.slidePrev(speed, true, true);
          emit("autoplay");
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          swiper.slideTo(swiper.slides.length - 1, speed, true, true);
          emit("autoplay");
        }
      } else {
        if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
          swiper.slideNext(speed, true, true);
          emit("autoplay");
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          swiper.slideTo(0, speed, true, true);
          emit("autoplay");
        }
      }
      if (swiper.params.cssMode) {
        autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
        requestAnimationFrame(() => {
          run();
        });
      }
    };
    if (delay > 0) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        proceed();
      }, delay);
    } else {
      requestAnimationFrame(() => {
        proceed();
      });
    }
    return delay;
  };
  const start = () => {
    swiper.autoplay.running = true;
    run();
    emit("autoplayStart");
  };
  const stop = () => {
    swiper.autoplay.running = false;
    clearTimeout(timeout);
    cancelAnimationFrame(raf);
    emit("autoplayStop");
  };
  const pause = (internal, reset) => {
    if (swiper.destroyed || !swiper.autoplay.running)
      return;
    clearTimeout(timeout);
    if (!internal) {
      pausedByInteraction = true;
    }
    const proceed = () => {
      emit("autoplayPause");
      if (swiper.params.autoplay.waitForTransition) {
        swiper.wrapperEl.addEventListener("transitionend", onTransitionEnd);
      } else {
        resume();
      }
    };
    swiper.autoplay.paused = true;
    if (reset) {
      if (slideChanged) {
        autoplayTimeLeft = swiper.params.autoplay.delay;
      }
      slideChanged = false;
      proceed();
      return;
    }
    const delay = autoplayTimeLeft || swiper.params.autoplay.delay;
    autoplayTimeLeft = delay - ((/* @__PURE__ */ new Date()).getTime() - autoplayStartTime);
    if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop)
      return;
    if (autoplayTimeLeft < 0)
      autoplayTimeLeft = 0;
    proceed();
  };
  const resume = () => {
    if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop || swiper.destroyed || !swiper.autoplay.running)
      return;
    autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
    if (pausedByInteraction) {
      pausedByInteraction = false;
      run(autoplayTimeLeft);
    } else {
      run();
    }
    swiper.autoplay.paused = false;
    emit("autoplayResume");
  };
  const onVisibilityChange = () => {
    if (swiper.destroyed || !swiper.autoplay.running)
      return;
    const document2 = getDocument();
    if (document2.visibilityState === "hidden") {
      pausedByInteraction = true;
      pause(true);
    }
    if (document2.visibilityState === "visible") {
      resume();
    }
  };
  const onPointerEnter = (e2) => {
    if (e2.pointerType !== "mouse")
      return;
    pausedByInteraction = true;
    pause(true);
  };
  const onPointerLeave = (e2) => {
    if (e2.pointerType !== "mouse")
      return;
    if (swiper.autoplay.paused) {
      resume();
    }
  };
  const attachMouseEvents = () => {
    if (swiper.params.autoplay.pauseOnMouseEnter) {
      swiper.el.addEventListener("pointerenter", onPointerEnter);
      swiper.el.addEventListener("pointerleave", onPointerLeave);
    }
  };
  const detachMouseEvents = () => {
    swiper.el.removeEventListener("pointerenter", onPointerEnter);
    swiper.el.removeEventListener("pointerleave", onPointerLeave);
  };
  const attachDocumentEvents = () => {
    const document2 = getDocument();
    document2.addEventListener("visibilitychange", onVisibilityChange);
  };
  const detachDocumentEvents = () => {
    const document2 = getDocument();
    document2.removeEventListener("visibilitychange", onVisibilityChange);
  };
  on("init", () => {
    if (swiper.params.autoplay.enabled) {
      attachMouseEvents();
      attachDocumentEvents();
      autoplayStartTime = (/* @__PURE__ */ new Date()).getTime();
      start();
    }
  });
  on("destroy", () => {
    detachMouseEvents();
    detachDocumentEvents();
    if (swiper.autoplay.running) {
      stop();
    }
  });
  on("beforeTransitionStart", (_s, speed, internal) => {
    if (swiper.destroyed || !swiper.autoplay.running)
      return;
    if (internal || !swiper.params.autoplay.disableOnInteraction) {
      pause(true, true);
    } else {
      stop();
    }
  });
  on("sliderFirstMove", () => {
    if (swiper.destroyed || !swiper.autoplay.running)
      return;
    if (swiper.params.autoplay.disableOnInteraction) {
      stop();
      return;
    }
    isTouched = true;
    pausedByTouch = false;
    pausedByInteraction = false;
    touchStartTimeout = setTimeout(() => {
      pausedByInteraction = true;
      pausedByTouch = true;
      pause(true);
    }, 200);
  });
  on("touchEnd", () => {
    if (swiper.destroyed || !swiper.autoplay.running || !isTouched)
      return;
    clearTimeout(touchStartTimeout);
    clearTimeout(timeout);
    if (swiper.params.autoplay.disableOnInteraction) {
      pausedByTouch = false;
      isTouched = false;
      return;
    }
    if (pausedByTouch && swiper.params.cssMode)
      resume();
    pausedByTouch = false;
    isTouched = false;
  });
  on("slideChange", () => {
    if (swiper.destroyed || !swiper.autoplay.running)
      return;
    slideChanged = true;
  });
  Object.assign(swiper.autoplay, {
    start,
    stop,
    pause,
    resume
  });
}

// node_modules/swiper/modules/thumbs.mjs
function Thumb(_ref) {
  let {
    swiper,
    extendParams,
    on
  } = _ref;
  extendParams({
    thumbs: {
      swiper: null,
      multipleActiveThumbs: true,
      autoScrollOffset: 0,
      slideThumbActiveClass: "swiper-slide-thumb-active",
      thumbsContainerClass: "swiper-thumbs"
    }
  });
  let initialized = false;
  let swiperCreated = false;
  swiper.thumbs = {
    swiper: null
  };
  function onThumbClick() {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed)
      return;
    const clickedIndex = thumbsSwiper.clickedIndex;
    const clickedSlide = thumbsSwiper.clickedSlide;
    if (clickedSlide && clickedSlide.classList.contains(swiper.params.thumbs.slideThumbActiveClass))
      return;
    if (typeof clickedIndex === "undefined" || clickedIndex === null)
      return;
    let slideToIndex;
    if (thumbsSwiper.params.loop) {
      slideToIndex = parseInt(thumbsSwiper.clickedSlide.getAttribute("data-swiper-slide-index"), 10);
    } else {
      slideToIndex = clickedIndex;
    }
    if (swiper.params.loop) {
      swiper.slideToLoop(slideToIndex);
    } else {
      swiper.slideTo(slideToIndex);
    }
  }
  function init() {
    const {
      thumbs: thumbsParams
    } = swiper.params;
    if (initialized)
      return false;
    initialized = true;
    const SwiperClass = swiper.constructor;
    if (thumbsParams.swiper instanceof SwiperClass) {
      swiper.thumbs.swiper = thumbsParams.swiper;
      Object.assign(swiper.thumbs.swiper.originalParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      Object.assign(swiper.thumbs.swiper.params, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper.update();
    } else if (isObject2(thumbsParams.swiper)) {
      const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
      Object.assign(thumbsSwiperParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false
      });
      swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
      swiperCreated = true;
    }
    swiper.thumbs.swiper.el.classList.add(swiper.params.thumbs.thumbsContainerClass);
    swiper.thumbs.swiper.on("tap", onThumbClick);
    return true;
  }
  function update2(initial) {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed)
      return;
    const slidesPerView = thumbsSwiper.params.slidesPerView === "auto" ? thumbsSwiper.slidesPerViewDynamic() : thumbsSwiper.params.slidesPerView;
    let thumbsToActivate = 1;
    const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
    if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
      thumbsToActivate = swiper.params.slidesPerView;
    }
    if (!swiper.params.thumbs.multipleActiveThumbs) {
      thumbsToActivate = 1;
    }
    thumbsToActivate = Math.floor(thumbsToActivate);
    thumbsSwiper.slides.forEach((slideEl) => slideEl.classList.remove(thumbActiveClass));
    if (thumbsSwiper.params.loop || thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled) {
      for (let i2 = 0; i2 < thumbsToActivate; i2 += 1) {
        elementChildren(thumbsSwiper.slidesEl, `[data-swiper-slide-index="${swiper.realIndex + i2}"]`).forEach((slideEl) => {
          slideEl.classList.add(thumbActiveClass);
        });
      }
    } else {
      for (let i2 = 0; i2 < thumbsToActivate; i2 += 1) {
        if (thumbsSwiper.slides[swiper.realIndex + i2]) {
          thumbsSwiper.slides[swiper.realIndex + i2].classList.add(thumbActiveClass);
        }
      }
    }
    const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
    const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
    if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
      const currentThumbsIndex = thumbsSwiper.activeIndex;
      let newThumbsIndex;
      let direction;
      if (thumbsSwiper.params.loop) {
        const newThumbsSlide = thumbsSwiper.slides.filter((slideEl) => slideEl.getAttribute("data-swiper-slide-index") === `${swiper.realIndex}`)[0];
        newThumbsIndex = thumbsSwiper.slides.indexOf(newThumbsSlide);
        direction = swiper.activeIndex > swiper.previousIndex ? "next" : "prev";
      } else {
        newThumbsIndex = swiper.realIndex;
        direction = newThumbsIndex > swiper.previousIndex ? "next" : "prev";
      }
      if (useOffset) {
        newThumbsIndex += direction === "next" ? autoScrollOffset : -1 * autoScrollOffset;
      }
      if (thumbsSwiper.visibleSlidesIndexes && thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0) {
        if (thumbsSwiper.params.centeredSlides) {
          if (newThumbsIndex > currentThumbsIndex) {
            newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
          } else {
            newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
          }
        } else if (newThumbsIndex > currentThumbsIndex && thumbsSwiper.params.slidesPerGroup === 1)
          ;
        thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : void 0);
      }
    }
  }
  on("beforeInit", () => {
    const {
      thumbs
    } = swiper.params;
    if (!thumbs || !thumbs.swiper)
      return;
    if (typeof thumbs.swiper === "string" || thumbs.swiper instanceof HTMLElement) {
      const document2 = getDocument();
      const getThumbsElementAndInit = () => {
        const thumbsElement = typeof thumbs.swiper === "string" ? document2.querySelector(thumbs.swiper) : thumbs.swiper;
        if (thumbsElement && thumbsElement.swiper) {
          thumbs.swiper = thumbsElement.swiper;
          init();
          update2(true);
        } else if (thumbsElement) {
          const onThumbsSwiper = (e2) => {
            thumbs.swiper = e2.detail[0];
            thumbsElement.removeEventListener("init", onThumbsSwiper);
            init();
            update2(true);
            thumbs.swiper.update();
            swiper.update();
          };
          thumbsElement.addEventListener("init", onThumbsSwiper);
        }
        return thumbsElement;
      };
      const watchForThumbsToAppear = () => {
        if (swiper.destroyed)
          return;
        const thumbsElement = getThumbsElementAndInit();
        if (!thumbsElement) {
          requestAnimationFrame(watchForThumbsToAppear);
        }
      };
      requestAnimationFrame(watchForThumbsToAppear);
    } else {
      init();
      update2(true);
    }
  });
  on("slideChange update resize observerUpdate", () => {
    update2();
  });
  on("setTransition", (_s, duration) => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed)
      return;
    thumbsSwiper.setTransition(duration);
  });
  on("beforeDestroy", () => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed)
      return;
    if (swiperCreated) {
      thumbsSwiper.destroy();
    }
  });
  Object.assign(swiper.thumbs, {
    init,
    update: update2
  });
}

// _src/scripts/global/base-swiper.js
var BaseSwiper = class extends HTMLElement {
  constructor() {
    super();
    this.swiperEl = this.querySelector(".swiper");
    this.getConfig = JSON.parse(this.getAttribute("slider-config"));
    console.log("this.getConfig", this.getConfig);
    this.LOAD_WHEN_IN_VIEW = this.hasAttribute("load-when-in-view");
    this.DISABLE_ON_BREAKPOINT = this.hasAttribute("disable-on-breakpoint");
    this.BREAKPOINT = parseInt(this.getAttribute("disable-on-breakpoint"));
    this.LOADED = false;
    this.swiperNav = this.querySelector("[swiper-nav]");
    this.config = {
      modules: [Navigation, Pagination, A11y, Autoplay],
      a11y: {
        enabled: true,
        prevSlideMessage: "Previous slide",
        nextSlideMessage: "Next slide",
        firstSlideMessage: "This is the first slide",
        lastSlideMessage: "This is the last slide",
        paginationBulletMessage: "Go to slide {{index}}"
      },
      navigation: {
        nextEl: this.querySelector("[swiper-button-next]"),
        prevEl: this.querySelector("[swiper-button-prev]")
      },
      pagination: {
        el: this.querySelector("[swiper-pagination]"),
        type: "fraction"
      },
      ...this.getConfig
    };
    if (Shopify.designMode) {
      console.log("DEISNG MODE");
      document.addEventListener("shopify:section:load", () => {
        if (this.swiper)
          this.swiper.destroy();
        this.connectedCallback();
      });
    }
  }
  connectedCallback() {
    if (this.DISABLE_ON_BREAKPOINT) {
      this.setAttribute("disabled", "");
      this.handleResize();
      window.addEventListener("resize", this.handleResize.bind(this));
      return;
    }
    if (!this.LOAD_WHEN_IN_VIEW)
      this.init();
    if (this.LOAD_WHEN_IN_VIEW)
      this.observer();
  }
  disconnectedCallback() {
    if (this.swiper)
      this.swiper.destroy();
    if (this.intersectionObserver)
      this.intersectionObserver.disconnect();
  }
  init() {
    this.swiper = new Swiper(this.swiperEl, this.config);
    console.log("==> INIT SWIPER", this.swiper);
  }
  handleResize() {
    const windowWidth = window.innerWidth;
    if (windowWidth > this.BREAKPOINT && this.LOADED) {
      this.setAttribute("disabled", "");
      if (this.swiper) {
        this.swiper.destroy();
        console.log("====>this.swiper.destroy();");
        this.LOADED = false;
        this.swiperNav.classList.add("hidden");
      }
    }
    if (windowWidth < this.BREAKPOINT && !this.LOADED) {
      this.removeAttribute("disabled");
      this.swiperNav.classList.remove("hidden");
      this.init();
      this.LOADED = true;
      console.log("=======> handling breakpoints", this.LOADED, this.swiper);
    }
  }
  handleObserver(entries, observer) {
    if (!entries[0].isIntersecting)
      return;
    observer.unobserve(this);
    if (!entries[0].isIntersecting)
      return;
    observer.unobserve(this);
    this.swiperEl = this.querySelector(".swiper");
    console.log("BASESWIPER handleObserver() config", this.config);
    this.init();
  }
  observer() {
    const options = {
      rootMargin: "0px 0px -30px 0px"
    };
    this.intersectionObserver = new IntersectionObserver(
      this.handleObserver.bind(this),
      options
    );
    this.intersectionObserver.observe(this);
  }
};

// _src/scripts/components/swiper-slider.js
var SwiperSlider = class extends BaseSwiper {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {
    super.connectedCallback();
  }
  init() {
    super.init();
  }
};
window.customElements.define("swiper-slider", SwiperSlider);

// _src/scripts/components/tab-component.js
var TabComponent = class extends HTMLElement {
  constructor() {
    super();
    const tabs = this.querySelectorAll("tab-component-nav");
    const panels = this.querySelectorAll("tab-component-panel");
    const selectedTab = this.querySelector("[selected]");
    const selectedPanel = this.querySelector(`#${selectedTab.id}`);
    tabs.forEach((tab) => {
      tab.addEventListener("click", (evt) => {
        tabs.forEach((tab2) => {
          tab2.setAttribute("aria-selected", false);
          tab2.removeAttribute("selected");
        });
        tab.setAttribute("aria-selected", true);
        tab.setAttribute("selected", "");
        const panelId = this.querySelector(`#${tab.getAttribute("aria-controls")}`);
        panels.forEach((panel) => {
          panel.setAttribute("aria-hidden", true);
        });
        panelId.setAttribute("aria-hidden", false);
      });
    });
  }
};
window.customElements.define("tab-component", TabComponent);

// _src/scripts/components/tabs-component.js
var TabsComponent = class extends HTMLElement {
  constructor() {
    super();
    this.tabTriggers = this.querySelectorAll('button[role="tab"]');
    this.details = this.querySelectorAll("details");
    this.settings = this.getAttribute("data-settings");
    this.OPENED;
    this.BREAKPOINT = window.matchMedia("(min-width: 768px)");
    this.PREV_ACTIVE_TAB_TRIGGER = this.querySelector(
      "nav button[role='tab'].is-active"
    );
    console.log("this.PREV_ACTIVE_TAB_TRIGGER", this.PREV_ACTIVE_TAB_TRIGGER);
    console.log("this.settings", this.settings);
  }
  connectedCallback() {
    this.handleSettings();
  }
  handleSettings() {
    if (this.settings === "tab") {
      this.handleTabs();
      return;
    }
    if (this.settings === "accordion") {
      this.handleAccordion();
      return;
    }
    if (this.settings === "mixed") {
      this.handleMixed();
      return;
    }
  }
  handleTabs() {
    console.log("handleTabs");
    this.tabTriggers.forEach((tabTrigger) => {
      tabTrigger.addEventListener("click", (event2) => {
        if (this.PREV_ACTIVE_TAB_TRIGGER) {
          this.PREV_ACTIVE_TAB_TRIGGER.classList.remove("is-active");
          this.querySelector(
            `#${this.PREV_ACTIVE_TAB_TRIGGER.getAttribute("aria-controls")}`
          ).removeAttribute("open");
          console.log(
            "panel",
            this.querySelector(
              `#${this.PREV_ACTIVE_TAB_TRIGGER.getAttribute("aria-controls")}`
            )
          );
        }
        console.log("tabTrigger", event2.target);
        event2.target.classList.add("is-active");
        this.querySelector(
          `#${event2.target.getAttribute("aria-controls")}`
        ).setAttribute("open", "");
        this.PREV_ACTIVE_TAB_TRIGGER = event2.target;
      });
    });
  }
  handleAccordion() {
    console.log("handleAccordion");
    this.addEventListener(
      "toggle",
      (event2) => {
        console.log("toggle", event2.target);
        event2.target.classList.toggle("open");
        if (!event2.target.hasAttribute("open"))
          return;
        this.OPENED = this.querySelectorAll("details[open]");
        console.log("This.opened", this.OPENED);
        this.OPENED.forEach((detail) => {
          if (detail === event2.target)
            return;
          detail.removeAttribute("open");
        });
      },
      true
    );
  }
  handleMixed() {
    console.log("handleMixed");
    this.handleMixedBreakpoint();
    this.BREAKPOINT.addEventListener(
      "change",
      this.handleMixedBreakpoint.bind(this)
    );
  }
  handleMixedBreakpoint() {
    if (this.BREAKPOINT.matches) {
      this.handleTabs();
    } else {
      this.handleAccordion();
    }
  }
  // handleMixedChange(event) {
  //   console.log("event", event); // MediaQueryListEvent
  //   console.log("event.matches", event.matches); // true or false
  //   if (event.matches) {
  //     alert("matches");
  //   } else {
  //     alert("does not match");
  //   }
  // }
  attributeChangedCallback(name, oldVal, newVal) {
  }
  adoptedCallback() {
  }
};
window.customElements.define("tabs-component", TabsComponent);

// _src/scripts/components/details-drawer.js
var DetailsDrawer = class extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector("details");
    this.addEventListener("keyup", this.onKeyUp.bind(this));
    this.addEventListener("focusout", this.onFocusOut.bind(this));
    this.bindEvents();
  }
  bindEvents() {
    this.querySelectorAll("summary").forEach((summary) => summary.addEventListener("click", this.onSummaryClick.bind(this)));
    this.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", this.onCloseButtonClick.bind(this));
      console.log("button", button);
    });
  }
  onKeyUp(event2) {
    if (event2.code.toUpperCase() !== "ESCAPE")
      return;
    const openDetailsElement = event2.target.closest("details[open]");
    if (!openDetailsElement)
      return;
    openDetailsElement === this.mainDetailsToggle ? this.closeMenuDrawer(event2, this.mainDetailsToggle.querySelector("summary")) : this.closeSubmenu(openDetailsElement);
  }
  onSummaryClick(event2) {
    const summaryElement = event2.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const parentMenuElement = detailsElement.closest(".has-submenu");
    const isOpen = detailsElement.hasAttribute("open");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    function addTrapFocus() {
      if (!detailsElement.querySelector("button")) {
        trapFocus2(summaryElement.nextElementSibling);
      }
      if (detailsElement.querySelector("button")) {
        trapFocus2(summaryElement.nextElementSibling, detailsElement.querySelector("button"));
      }
      summaryElement.nextElementSibling.removeEventListener("transitionend", addTrapFocus);
    }
    if (detailsElement === this.mainDetailsToggle) {
      if (isOpen)
        event2.preventDefault();
      isOpen ? this.closeMenuDrawer(event2, summaryElement) : this.openMenuDrawer(summaryElement);
      if (window.matchMedia("(max-width: 990px)")) {
        document.documentElement.style.setProperty("--viewport-height", `${window.innerHeight}px`);
      }
    } else {
      setTimeout(() => {
        detailsElement.classList.add("menu-opening");
        summaryElement.setAttribute("aria-expanded", true);
      }, 100);
    }
  }
  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });
    summaryElement.setAttribute("aria-expanded", true);
    trapFocus2(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }
  closeMenuDrawer(event2, elementToFocus = false) {
    if (event2 === void 0)
      return;
    this.mainDetailsToggle.classList.remove("menu-opening");
    this.mainDetailsToggle.querySelectorAll("details").forEach((details) => {
      details.removeAttribute("open");
      details.classList.remove("menu-opening");
    });
    document.body.classList.remove(`overflow-hidden-${this.dataset.breakpoint}`);
    removeTrapFocus2(elementToFocus);
    this.closeAnimation(this.mainDetailsToggle);
  }
  onFocusOut(event2) {
    setTimeout(() => {
      if (this.mainDetailsToggle.hasAttribute("open") && !this.mainDetailsToggle.contains(document.activeElement))
        this.closeMenuDrawer();
    });
  }
  onCloseButtonClick(event2) {
    const detailsElement = event2.currentTarget.closest("details");
    this.closeMenuDrawer(detailsElement);
  }
  closeAnimation(detailsElement) {
    let animationStart;
    const handleAnimation = (time) => {
      if (animationStart === void 0) {
        animationStart = time;
      }
      const elapsedTime = time - animationStart;
      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute("open");
        detailsElement.setAttribute("aria-expanded", false);
        if (detailsElement.closest("details[open]")) {
          trapFocus2(detailsElement.closest("details[open]"), detailsElement.querySelector("summary"));
        }
      }
    };
    window.requestAnimationFrame(handleAnimation);
  }
};
window.customElements.define("details-drawer", DetailsDrawer);

// _src/scripts/components/details-modal.js
var DetailsModal = class extends HTMLElement {
  constructor() {
    super();
    this.detailsContainer = this.querySelector("details");
    this.summaryToggle = this.querySelector("summary");
    console.log("this.detailsContainer", this.detailsContainer);
    this.detailsContainer.addEventListener(
      "keyup",
      (event2) => event2.code.toUpperCase() === "ESCAPE" && this.close()
    );
    this.summaryToggle.addEventListener(
      "click",
      this.onSummaryClick.bind(this)
    );
    this.querySelector('button[type="button"]').addEventListener(
      "click",
      this.close.bind(this)
    );
    this.summaryToggle.setAttribute("role", "button");
  }
  isOpen() {
    return this.detailsContainer.hasAttribute("open");
  }
  onSummaryClick(event2) {
    event2.preventDefault();
    event2.target.closest("details").hasAttribute("open") ? this.close() : this.open(event2);
  }
  onBodyClick(event2) {
    if (!this.contains(event2.target) || event2.target.classList.contains("modal-overlay"))
      this.close(false);
  }
  open(event2) {
    this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
    event2.target.closest("details").setAttribute("open", true);
    event2.target.closest("details").classList.add("menu-opening");
    document.body.addEventListener("click", this.onBodyClickEvent);
    document.body.classList.add("overflow-hidden");
    trapFocus(
      this.detailsContainer.querySelector('[tabindex="-1"]'),
      this.detailsContainer.querySelector('input:not([type="hidden"])')
    );
  }
  close(focusToggle = true) {
    removeTrapFocus(focusToggle ? this.summaryToggle : null);
    this.detailsContainer.removeAttribute("open");
    document.body.removeEventListener("click", this.onBodyClickEvent);
    document.body.classList.remove("overflow-hidden");
  }
};
customElements.define("details-modal", DetailsModal);

// _src/scripts/components/drawer-dialog.js
var DrawerDialog = class extends HTMLElement {
  constructor() {
    super();
    this.details = this.querySelector("details");
    this.summary = this.querySelector("summary");
    this.closeButtons = this.querySelectorAll('button[is="close"]');
    this.modalOverlay = this.querySelector(".modal-overlay");
    this.drawer = this.querySelector("aside");
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.summary.setAttribute("role", "button");
    this.details.addEventListener("keyup", (event2) => {
      console.log("eventcode", event2.code);
      if (event2.code)
        event2.code.toUpperCase() === "ESCAPE" && this.close();
    });
    this.summary.addEventListener("click", this.onSummaryClick.bind(this));
    this.closeButtons.forEach((button) => button.addEventListener("click", this.close.bind(this)));
    this.modalOverlay.addEventListener("click", this.close.bind(this));
    if (this.cancelbutton)
      this.cancelbutton.addEventListener("click", this.close.bind(this));
  }
  onSummaryClick(event2) {
    event2.preventDefault();
    event2.target.closest("details").hasAttribute("open") ? this.close() : this.open(event2);
  }
  onBodyClick(event2) {
    if (!this.contains(event2.target) || event2.target.classList.contains("modal-overlay"))
      this.close(false);
  }
  open() {
    this.onBodyClick = this.onBodyClickEvent || this.onBodyClick.bind(this);
    event.target.closest("details").setAttribute("open", "");
    document.body.addEventListener("click", this.onBodyClickEvent);
    document.body.classList.add("overflow-hidden");
    window.requestAnimationFrame(() => this.openAnimation());
  }
  openAnimation() {
    this.isExpanding = true;
    if (this.animation)
      this.animation.cancel();
    this.animation = this.drawer.animate({
      transform: ["translateX(-100%)", "translateX(0)"]
    }, {
      duration: 300,
      easing: "ease-out"
    });
    this.animation.oncancel = () => this.isExpanding = false;
  }
  close() {
    console.log("CLOSE");
    window.requestAnimationFrame(() => this.closeAnimation());
  }
  closeAnimation() {
    this.isClosing = true;
    if (this.animation)
      this.animation.cancel();
    this.animation = this.drawer.animate({
      transform: ["translateX(0)", "translateX(-100%)"]
    }, {
      duration: 300,
      easing: "ease-out"
    });
    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => this.isClosing = false;
  }
  onAnimationFinish(open) {
    this.details.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    if (!open) {
      document.body.removeEventListener("click", this.onBodyClickEvent);
      document.body.classList.remove("overflow-hidden");
    }
  }
};
window.customElements.define("drawer-dialog", DrawerDialog);

// _src/scripts/components/modal-dialog.js
var ModalDialog = class extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      "click",
      this.hide.bind(this, false)
    );
    this.addEventListener("keyup", (event2) => {
      if (event2.code.toUpperCase() === "ESCAPE")
        this.hide();
    });
    if (this.classList.contains("media-modal")) {
      this.addEventListener("pointerup", (event2) => {
        if (event2.pointerType === "mouse" && !event2.target.closest("deferred-media, product-model"))
          this.hide();
      });
    } else {
      this.addEventListener("click", (event2) => {
        if (event2.target === this)
          this.hide();
      });
    }
  }
  connectedCallback() {
    if (this.moved)
      return;
    this.moved = true;
    document.body.appendChild(this);
  }
  show(opener) {
    this.openedBy = opener;
    const popup = this.querySelector(".template-popup");
    document.body.classList.add("overflow-hidden");
    this.setAttribute("open", "");
    if (popup)
      popup.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
    window.pauseAllMedia();
  }
  hide() {
    document.body.classList.remove("overflow-hidden");
    document.body.dispatchEvent(new CustomEvent("modalClosed"));
    this.removeAttribute("open");
    removeTrapFocus(this.openedBy);
    window.pauseAllMedia();
  }
};
customElements.define("modal-dialog", ModalDialog);
if (!customElements.get("quick-add-modal")) {
  customElements.define("quick-add-modal", class QuickAddModal extends ModalDialog {
    constructor() {
      super();
      this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');
    }
    hide(preventFocus = false) {
      const cartNotification = document.querySelector("cart-notification") || document.querySelector("cart-drawer");
      if (cartNotification)
        cartNotification.setActiveElement(this.openedBy);
      this.modalContent.innerHTML = "";
      if (preventFocus)
        this.openedBy = null;
      super.hide();
    }
    show(opener) {
      opener.setAttribute("aria-disabled", true);
      opener.classList.add("loading");
      opener.querySelector(".loading-overlay__spinner").classList.remove("hidden");
      fetch(opener.getAttribute("data-product-url")).then((response) => response.text()).then((responseText) => {
        const responseHTML = new DOMParser().parseFromString(responseText, "text/html");
        this.productElement = responseHTML.querySelector('section[id^="MainProduct-"]');
        this.preventDuplicatedIDs();
        this.removeDOMElements();
        this.setInnerHTML(this.modalContent, this.productElement.innerHTML);
        if (window.Shopify && Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }
        if (window.ProductModel)
          window.ProductModel.loadShopifyXR();
        this.removeGalleryListSemantic();
        this.updateImageSizes();
        this.preventVariantURLSwitching();
        super.show(opener);
      }).finally(() => {
        opener.removeAttribute("aria-disabled");
        opener.classList.remove("loading");
        opener.querySelector(".loading-overlay__spinner").classList.add("hidden");
      });
    }
    setInnerHTML(element, html) {
      element.innerHTML = html;
      element.querySelectorAll("script").forEach((oldScriptTag) => {
        const newScriptTag = document.createElement("script");
        Array.from(oldScriptTag.attributes).forEach((attribute) => {
          newScriptTag.setAttribute(attribute.name, attribute.value);
        });
        newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
        oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
      });
    }
    preventVariantURLSwitching() {
      const variantPicker = this.modalContent.querySelector("variant-radios,variant-selects");
      if (!variantPicker)
        return;
      variantPicker.setAttribute("data-update-url", "false");
    }
    removeDOMElements() {
      const pickupAvailability = this.productElement.querySelector("pickup-availability");
      if (pickupAvailability)
        pickupAvailability.remove();
      const productModal = this.productElement.querySelector("product-modal");
      if (productModal)
        productModal.remove();
    }
    preventDuplicatedIDs() {
      console.log("this.productElement", this.productElement);
      const sectionId = this.productElement.dataset.section;
      this.productElement.innerHTML = this.productElement.innerHTML.replaceAll(sectionId, `quickadd-${sectionId}`);
      this.productElement.querySelectorAll("variant-selects, variant-radios").forEach((variantSelect) => {
        variantSelect.dataset.originalSection = sectionId;
      });
    }
    removeGalleryListSemantic() {
      const galleryList = this.modalContent.querySelector('[id^="Slider-Gallery"]');
      if (!galleryList)
        return;
      galleryList.setAttribute("role", "presentation");
      galleryList.querySelectorAll('[id^="Slide-"]').forEach((li) => li.setAttribute("role", "presentation"));
    }
    updateImageSizes() {
      const product = this.modalContent.querySelector(".product");
      const desktopColumns = product.classList.contains("product--columns");
      if (!desktopColumns)
        return;
      const mediaImages = product.querySelectorAll(".product__media img");
      if (!mediaImages.length)
        return;
      let mediaImageSizes = "(min-width: 1000px) 715px, (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)";
      if (product.classList.contains("product--medium")) {
        mediaImageSizes = mediaImageSizes.replace("715px", "605px");
      } else if (product.classList.contains("product--small")) {
        mediaImageSizes = mediaImageSizes.replace("715px", "495px");
      }
      mediaImages.forEach((img) => img.setAttribute("sizes", mediaImageSizes));
    }
  });
}

// _src/scripts/components/modal-opener.js
var ModalOpener = class extends HTMLElement {
  constructor() {
    super();
    const button = this.querySelector("button");
    if (!button)
      return;
    button.addEventListener("click", () => {
      const modal = document.querySelector(this.getAttribute("data-modal"));
      if (modal)
        modal.show(button);
    });
  }
};
customElements.define("modal-opener", ModalOpener);

// _src/scripts/components/menu-drawer.js
var MenuDrawer = class extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector("details");
    this.addEventListener("keyup", this.onKeyUp.bind(this));
    this.addEventListener("focusout", this.onFocusOut.bind(this));
    this.bindEvents();
  }
  bindEvents() {
    this.querySelectorAll("summary").forEach((summary) => summary.addEventListener("click", this.onSummaryClick.bind(this)));
    this.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", this.onCloseButtonClick.bind(this));
      console.log("button", button);
    });
  }
  onKeyUp(event2) {
    if (event2.code.toUpperCase() !== "ESCAPE")
      return;
    const openDetailsElement = event2.target.closest("details[open]");
    if (!openDetailsElement)
      return;
    openDetailsElement === this.mainDetailsToggle ? this.closeMenuDrawer(event2, this.mainDetailsToggle.querySelector("summary")) : this.closeSubmenu(openDetailsElement);
  }
  onSummaryClick(event2) {
    const summaryElement = event2.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const parentMenuElement = detailsElement.closest(".has-submenu");
    const isOpen = detailsElement.hasAttribute("open");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    function addTrapFocus() {
      if (!detailsElement.querySelector("button")) {
        trapFocus2(summaryElement.nextElementSibling);
      }
      if (detailsElement.querySelector("button")) {
        trapFocus2(summaryElement.nextElementSibling, detailsElement.querySelector("button"));
      }
      summaryElement.nextElementSibling.removeEventListener("transitionend", addTrapFocus);
    }
    if (detailsElement === this.mainDetailsToggle) {
      if (isOpen)
        event2.preventDefault();
      isOpen ? this.closeMenuDrawer(event2, summaryElement) : this.openMenuDrawer(summaryElement);
      if (window.matchMedia("(max-width: 990px)")) {
        document.documentElement.style.setProperty("--viewport-height", `${window.innerHeight}px`);
      }
    } else {
      setTimeout(() => {
        detailsElement.classList.add("menu-opening");
        summaryElement.setAttribute("aria-expanded", true);
        parentMenuElement && parentMenuElement.classList.add("submenu-open");
        !reducedMotion || reducedMotion.matches ? addTrapFocus() : summaryElement.nextElementSibling.addEventListener("transitionend", addTrapFocus);
      }, 100);
    }
  }
  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
    });
    summaryElement.setAttribute("aria-expanded", true);
    trapFocus2(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }
  closeMenuDrawer(event2, elementToFocus = false) {
    if (event2 === void 0)
      return;
    this.mainDetailsToggle.classList.remove("menu-opening");
    this.mainDetailsToggle.querySelectorAll("details").forEach((details) => {
      details.removeAttribute("open");
      details.classList.remove("menu-opening");
    });
    this.mainDetailsToggle.querySelectorAll(".submenu-open").forEach((submenu) => {
      submenu.classList.remove("submenu-open");
    });
    document.body.classList.remove(`overflow-hidden-${this.dataset.breakpoint}`);
    removeTrapFocus2(elementToFocus);
    this.closeAnimation(this.mainDetailsToggle);
  }
  onFocusOut(event2) {
    setTimeout(() => {
      if (this.mainDetailsToggle.hasAttribute("open") && !this.mainDetailsToggle.contains(document.activeElement))
        this.closeMenuDrawer();
    });
  }
  onCloseButtonClick(event2) {
    const detailsElement = event2.currentTarget.closest("details");
    this.closeSubmenu(detailsElement);
  }
  closeSubmenu(detailsElement) {
    const parentMenuElement = detailsElement.closest(".submenu-open");
    parentMenuElement && parentMenuElement.classList.remove("submenu-open");
    detailsElement.classList.remove("menu-opening");
    detailsElement.querySelector("summary").setAttribute("aria-expanded", false);
    removeTrapFocus2(detailsElement.querySelector("summary"));
    this.closeAnimation(detailsElement);
  }
  closeAnimation(detailsElement) {
    let animationStart;
    const handleAnimation = (time) => {
      if (animationStart === void 0) {
        animationStart = time;
      }
      const elapsedTime = time - animationStart;
      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute("open");
        detailsElement.setAttribute("aria-expanded", false);
        if (detailsElement.closest("details[open]")) {
          trapFocus2(detailsElement.closest("details[open]"), detailsElement.querySelector("summary"));
        }
      }
    };
    window.requestAnimationFrame(handleAnimation);
  }
};
customElements.define("menu-drawer", MenuDrawer);

// _src/scripts/components/header-drawer.js
var HeaderDrawer = class extends MenuDrawer {
  constructor() {
    super();
    this.header = this.header || document.getElementById("shopify-section-header");
  }
  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
      summaryElement.setAttribute("aria-expanded", true);
      trapFocus2(this.mainDetailsToggle, summaryElement);
    });
  }
  closeMenuDrawer(event2, elementToFocus, summaryElement) {
    super.closeMenuDrawer(event2, elementToFocus);
    super.querySelector("summary").setAttribute("aria-expanded", false);
  }
};
window.customElements.define("header-drawer", HeaderDrawer);

// _src/scripts/components/search-drawer.js
var SearchDrawer = class extends DetailsDrawer {
  constructor() {
    super();
  }
  connectedCallback() {
  }
  disconnectedCallback() {
  }
  attributeChangedCallback(name, oldVal, newVal) {
  }
  adoptedCallback() {
  }
};
window.customElements.define("search-drawer", SearchDrawer);

// _src/scripts/components/filter-drawer.js
var FilterDrawer = class extends DetailsDrawer {
  constructor() {
    super();
  }
};
window.customElements.define("filter-drawer", FilterDrawer);

// _src/scripts/components/custom-select.js
var CustomSelect = class extends HTMLElement {
  constructor() {
    super();
    const selectedLabel = this.querySelector(".selected-label");
    const selectedValue = this.querySelector("input:checked");
    const radios = this.querySelectorAll("input");
    const detail = this.querySelector("details");
    document.addEventListener("click", (event2) => {
      const isClickInside = detail.contains(event2.target);
      if (!isClickInside) {
        detail.removeAttribute("open");
      }
    });
    radios.forEach((radio, index) => {
      radio.addEventListener("click", () => {
        selectedLabel.textContent = radio.getAttribute("title");
        detail.removeAttribute("open");
      });
    });
  }
};
window.customElements.define("custom-select", CustomSelect);

// _src/scripts/components/dropdown-menu.js
var DropdownMenu = class extends HTMLElement {
  constructor() {
    super();
    const details = this.querySelector("details");
    var delay = 150;
    var timeoutId;
    details.addEventListener("mouseenter", () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.open();
      }, delay);
    });
    details.addEventListener("mouseleave", () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.close();
      }, delay);
    });
  }
  open() {
    const details = this.querySelector("details");
    details.setAttribute("open", "");
    details.classList.add("is-opening");
  }
  close() {
    const details = this.querySelector("details");
    details.removeAttribute("open");
    details.classList.remove("is-opening");
  }
};
window.customElements.define("dropdown-menu", DropdownMenu);

// _src/scripts/components/add-to-favorites.js
var AddToFavorites = class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const button = this.querySelector("button");
    const productJSON = JSON.parse(this.getAttribute("product-json"));
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    button.addEventListener("click", (evt) => {
      this.toggleAddToFavorites(productJSON);
    });
    this.display(favorites, button, productJSON);
  }
  display(favorites, button, productJSON) {
    if (favorites !== null && favorites.some(
      (obj) => Object.entries(obj).some(
        ([key, value]) => key === "id" && value === productJSON.id
      )
    )) {
      button.classList.add("is-active");
    }
  }
  toggleAddToFavorites(productJSON) {
    const button = this.querySelector("button");
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.some(
      (obj) => Object.entries(obj).some(
        ([key, value]) => key === "id" && value === productJSON.id
      )
    )) {
      console.log("remove from favorites", productJSON.id);
      let newFavoritesArray = favorites.filter(
        (obj) => !Object.entries(obj).some(
          ([key, value]) => key === "id" && value === productJSON.id
        )
      );
      localStorage.setItem("favorites", JSON.stringify(newFavoritesArray));
      button.classList.remove("is-active");
    } else {
      console.log("add to favorites", productJSON.id);
      favorites.push(productJSON);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      button.classList.add("is-active");
    }
  }
  getProductJSON() {
    return JSON.parse(this.getAttribute("product-json"));
  }
};
window.customElements.define("add-to-favorites", AddToFavorites);

// _src/scripts/components/product-card-favorites.js
var ProductCardFavorites = class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.isloading = true;
    const favorite = JSON.parse(this.getAttribute("favorite"));
    console.log("product-card-favorites loaded", favorite);
    console.log("product_options", favorite.product_options);
    const productHandle = favorite.handle;
    const stylesheetURL = this.getAttribute("stylesheet-url");
    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", stylesheetURL);
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(linkElem);
    this.getProductData(productHandle, shadowRoot);
  }
  async getProductData(productHandle, shadowRoot) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      mode: "no-cors"
    };
    try {
      this.isLoading = true;
      const response = await fetch(`/products/${productHandle}.js`, options);
      if (!response.ok)
        throw new Error("Network response was not ok");
      const productData = await response.json();
      console.log("product data", productData);
      this.renderHTML(productData, shadowRoot);
      this.removeProduct(shadowRoot);
      this.onChange(shadowRoot, productData);
      this.addToCart(shadowRoot);
    } catch (error) {
      console.error(error);
    }
  }
  renderHTML(productData, shadowRoot) {
    this.isLoading = false;
    console.log("window.themeVariables.color", window.themeVariables.colors);
    console.log("RENDERHTML data", productData);
    const template = document.createElement("template");
    template.innerHTML = this.isLoading ? `loading` : `
    <li class="h-full">
    <div class="product-card-favorites" product-id="${productData.id}">
      <div class="product-card-favorites__image">
        <a href='${productData.url}' class="product-card-favorites__image-link">
          <img src="${productData.featured_image}&width=350" loading="lazy" class="product-card-favorites__image-img">
        </a>
      </div>
      

      <div class="product-card-favorites__main">
        <span class="product-card-favorites__main-shop-name">${productData.vendor}</span>
        <p class="product-card-favorites__main-product-title">${productData.title}</p>
        <span class="product-card-favorites__main-product-price">$${(productData.price / 100).toFixed(2)}</span>

        ${productData.options[0].name !== "Title" ? `
          <form>
          ${productData.options.map(
      (option, index) => option.name === "Color" ? `
                <fieldset class="flex gap-x-3 mt-4">
                  ${option.values.map(
        (value, index2) => `
                    <label for="FavoritesCard-${productData.id}-${option.position}-${index2}" class="cursor-pointer">
                      <input type="radio" id="FavoritesCard-${productData.id}-${option.position}-${index2}" name="${option.name}" value="${value}" title="${value}" class="sr-only peer" ${index2 === 0 ? "checked" : ""}/>
                      <span
                        class="relative inline-block w-3 h-3 rounded-full overflow-hidden border border-neutral-500 outline outline-1 outline-transparent outline-offset-4 peer-checked:outline peer-checked:outline-neutral-500 "
                        style="background-color: ${window.themeVariables.colors.find(
          (color) => color.name === value.toLowerCase().trim()
        ) ? window.themeVariables.colors.find(
          (color) => color.name === value.toLowerCase().trim()
        ).hex : value.toLowerCase().trim()}"
                      >
                        <span class="sr-only">${value.toLowerCase().trim()}</span>
                      </span>
                    </label>
                  `
      ).join("")}
                </fieldset>  
              ` : `
                <fieldset class="flex gap-x-3 mt-4">
                  ${option.values.map(
        (value, index2) => `
                    <label for="FavoritesCard-${productData.id}-${option.position}-${index2}" class="cursor-pointer">
                      <input type="radio" id="FavoritesCard-${productData.id}-${option.position}-${index2}" name="${option.name}" value="${value}" title="${value}" class="sr-only peer" ${index2 === 0 ? "checked" : ""} />

                    <span
                        class="favorites-card-fieldset-input-span"
                      >
                      ${value}
                      </span>
                    </label>
                  `
      ).join("")}
                </fieldset>
              `
    ).join("")}
        
        </form>
        ` : ""}
       
       

        <span id="ProductCardFavorites-Status-${productData.id}" class=""></span>
      </div>

      <div class="product-card-favorites__actions">
        <button id="AddToCart-${productData.handle}" type="button" class="btn-primary" product-id="${productData.variants[0].id}" ${productData.variants[0].available === false ? "disabled" : ""}>${productData.variants[0].available === false ? "Sold out" : "Add to cart"}</button>

        <div class="product-card-favorites__actions-middle">
          <a href='${productData.url}' class="">View item</a>
          <button id='ProductCardFavorites-Remove-${productData.id}' type="button" product-id="${productData.id}"  class="">Remove</button>
        </div>

        <p class="text-center">Need help? Call <a href="tel:${window.themeVariables.phone_number}">${window.themeVariables.phone_number}</a> or <open-chatbox-button class="inline-block cursor-pointer"><strong>chat with us</strong></open-chatbox-button></p>
      </div>
      
    </div>
  </li>
  `;
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
  onChange(shadowRoot, productData) {
    const form = shadowRoot.querySelector("form");
    console.log("ON CHAGE", productData);
    if (!form)
      return;
    form.addEventListener("change", (evt) => {
      this.updateOptions(shadowRoot);
      this.getCurrentVariant(productData);
      this.updateImage(shadowRoot);
      this.updateProductId(shadowRoot);
      this.updateAvailability(shadowRoot);
    });
  }
  updateAvailability(shadowRoot) {
    const addToCartButton = shadowRoot.querySelector(
      'button[id^="AddToCart-"]'
    );
    console.log("UPDATE AVAIL", this.currentVariant);
    if (this.currentVariant.available === false) {
      addToCartButton.textContent = "Sold out";
      addToCartButton.disabled = true;
    } else {
      addToCartButton.textContent = "Add to Cart";
      addToCartButton.disabled = false;
    }
  }
  updateOptions(shadowRoot) {
    const fieldsets = Array.from(shadowRoot.querySelectorAll("fieldset"));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value;
    });
    console.log("updateoptions", this.options);
    return this.options;
  }
  getCurrentVariant(productData) {
    console.log("getcurrentvariant", productData);
    this.currentVariant = productData.variants.find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
    console.log("getCurrentVariant()", this.currentVariant);
  }
  updateImage(shadowRoot) {
    console.log("updateImage", this.currentVariant);
    if (!this.currentVariant.featured_image)
      return;
    const image = shadowRoot.querySelector("img");
    const imageSrc = `${this.currentVariant.featured_image.src}&width=350`;
    image.src = imageSrc;
  }
  addToCart(shadowRoot) {
    const addToCartButton = shadowRoot.querySelector(
      'button[id^="AddToCart-"]'
    );
    let productID = parseInt(addToCartButton.getAttribute("product-id"));
    addToCartButton.addEventListener("click", (evt) => {
      this.postToCart(shadowRoot, productID);
    });
  }
  postToCart(shadowRoot, productID) {
    const addToCartButton = shadowRoot.querySelector(
      'button[id^="AddToCart-"]'
    );
    productID = parseInt(addToCartButton.getAttribute("product-id"));
    const form = shadowRoot.querySelector("form");
    this.cart = document.querySelector("cart-notification") || document.querySelector("cart-drawer");
    if (document.querySelector("cart-drawer"))
      addToCartButton.setAttribute("aria-haspopup", "dialog");
    console.log("addToCart() ====>", productID);
    console.log("themeVariables.routes.cart_add_url", productID);
    let formData = {
      items: [
        {
          id: productID,
          quantity: 1
        }
      ],
      sections: "cart-drawer,cart-icon-bubble"
    };
    if (this.cart) {
      this.cart.setActiveElement(document.activeElement);
    }
    console.log("formData", formData);
    fetch(`${themeVariables.routes.cart_add_url}.js`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
      // body: formData
    }).then((response) => response.json()).then((data) => {
      console.log("Product added to cart:", data);
      this.handleStatus(shadowRoot, data);
      this.cart.renderContents(data);
    }).catch((error) => {
      console.error("Error adding product to cart:", error);
    });
  }
  handleStatus(shadowRoot, data) {
    const statusMsg = shadowRoot.querySelector(
      "span[id^=ProductCardFavorites-Status]"
    );
    console.log("statusMsg", data);
    if (data.status === 422) {
      statusMsg.textContent = data.description;
    }
    statusMsg.textContent = `${data.items[0].title} added to cart`;
  }
  updateProductId(shadowRoot) {
    const addToCartButton = shadowRoot.querySelector(
      'button[id^="AddToCart-"]'
    );
    const productCard = shadowRoot.querySelector(".product-card-favorites");
    console.log("productCard", productCard);
    productCard.setAttribute("product-id", this.currentVariant.id);
    addToCartButton.setAttribute("product-id", this.currentVariant.id);
  }
  removeProduct(shadowRoot) {
    const productCard = shadowRoot;
    const removeButton = shadowRoot.querySelector(
      'button[id^="ProductCardFavorites-Remove"]'
    );
    const productID = removeButton.getAttribute("product-id");
    console.log("productCard", productCard);
    removeButton.addEventListener("click", (evt) => {
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      if (favorites.some(
        (obj) => Object.entries(obj).some(
          ([key, value]) => key === "id" && value === productID
        )
      )) {
        console.log("remove from favorites", productID);
        favorites = favorites.filter(
          (obj) => !Object.entries(obj).some(
            ([key, value]) => key === "id" && value === productID
          )
        );
        localStorage.setItem("favorites", JSON.stringify(favorites));
        this.remove();
      }
    });
  }
};
window.customElements.define("product-card-favorites", ProductCardFavorites);

// _src/scripts/components/favorites-listing.js
var FavoritesListing = class extends HTMLElement {
  constructor() {
    super();
    console.log("getFavorites()", this.getFavorites());
    this.renderProductCards();
  }
  getFavorites() {
    return JSON.parse(localStorage.getItem("favorites"));
  }
  renderProductCards() {
    const listEl = this.querySelector("ul");
    if (this.getFavorites() !== null && this.getFavorites().length < 1) {
      const favoritesEmptyCard = document.createElement("li");
      const favoritesEmptyCardH2 = document.createElement("h2");
      favoritesEmptyCardH2.classList.add("text-3xl");
      favoritesEmptyCardH2.classList.add("mb-2");
      favoritesEmptyCardH2.textContent = "You haven\u2019t saved any products yet";
      const favoritesEmptyCardP = document.createElement("p");
      favoritesEmptyCardP.textContent = "You can save items for later in case you want to come back to it or share with your friends and family!";
      favoritesEmptyCardP.classList.add("mb-6");
      const favoritesEmptyCardBtn = document.createElement("a");
      favoritesEmptyCardBtn.href = "/collections/shop";
      favoritesEmptyCardBtn.classList.add("btn-primary");
      favoritesEmptyCardBtn.textContent = "SHOP NOW";
      favoritesEmptyCard.appendChild(favoritesEmptyCardH2);
      favoritesEmptyCard.appendChild(favoritesEmptyCardP);
      favoritesEmptyCard.appendChild(favoritesEmptyCardBtn);
      listEl.appendChild(favoritesEmptyCard);
      return;
    }
    if (this.getFavorites() !== null && this.getFavorites().length > 0) {
      let favorites = this.getFavorites();
      const stylesheetURL = this.getAttribute("stylesheet-url");
      favorites.map((favorite) => {
        const productCard = document.createElement("product-card-favorites");
        productCard.setAttribute("favorite", JSON.stringify(favorite));
        productCard.setAttribute("stylesheet-url", stylesheetURL);
        listEl.appendChild(productCard);
      });
    }
  }
  intialRender() {
    if (this.getFavorites() !== null && this.getFavorites().length > 0) {
      let favorites = this.getFavorites();
      this.renderHTML(favorites);
      const fieldsets = this.querySelectorAll("ul");
      fieldsets.forEach((fieldset) => {
        fieldset.addEventListener("change", () => {
          console.log("change");
        });
      });
    }
  }
  renderHTML(favorites) {
    const listEl = this.querySelector("ul");
    const html = favorites.map(
      (item) => `
      <li>
        <prouduct-card-favorites class="product-card-favorites">
          <a href='${item.url}' class="product-card-favorites__image">
            <img src="${item.featured_image}" loading="lazy" class="">
          </a>

          <div class="product-card-favorites__main">
            <span class="product-card-favorites__main-shop-name">${item.shop_name}</span>
            <p class="product-card-favorites__main-product-title">${item.title}</p>
            <span class="product-card-favorites__main-product-price">${item.price}</span>

            <fieldset class="flex gap-x-3 mt-4">
              ${item.variants ? item.variants.map(
        (variant) => `
                <label for="FavoritesCard-${item.handle}-${variant.title}" class="cursor-pointer">
                  <input type="radio" id="FavoritesCard-${item.handle}-${variant.title}" name="${item.handle}-color" value="${variant.title}" title="${variant.title}" class="sr-only peer"/>
                  <span
                    class="relative inline-block w-3 h-3 rounded-full overflow-hidden border border-neutral-500 outline outline-1 outline-transparent outline-offset-4 peer-checked:outline peer-checked:outline-neutral-500 "
                    style="background-color: ${variant.title}"
                  >
                  
                    <span class="sr-only">
                      ${variant.title}
                    </span>
                  </span>
                </label>
              `
      ).join("") : ""}
            </fieldset>
          </div>

          <div class="product-card-favorites__actions">
            <button id="AddToCart-${item.handle}" type="button" class="btn-primary" product-id="${item.id}">Add to cart</button>

            <div class="product-card-favorites__actions-middle">
              <a href='${item.url}' class="">View item</a>
              <button type="button" product-id="${item.id}"  class="">remove</button>
            </div>

            <p>Need help? Call <a href="tel:${window.themeVariables.phone_number}">${window.themeVariables.phone_number}</a> or <strong>chat with us</strong></p>
          </div>
          
        </prouduct-card-favorites>
      </li>
    `
    ).join("");
    listEl.innerHTML = html;
  }
};
window.customElements.define("favorites-listing", FavoritesListing);

// _src/scripts/components/compare-products-button.js
var CompareProductsButton = class extends HTMLElement {
  constructor() {
    super();
    this.button = this.querySelector("button");
    this.productData = JSON.parse(this.button.getAttribute("product-json"));
    let comparisons = JSON.parse(localStorage.getItem("comparisons")) || [];
    this.display(comparisons);
  }
  connectedCallback() {
    this.toggleAddRemove();
    this.comparisonRemovedFromBar();
  }
  getComparisons() {
    return JSON.parse(localStorage.getItem("comparisons")) || [];
  }
  toggleAddRemove() {
    this.button.addEventListener("click", (evt) => {
      let comparisons = JSON.parse(localStorage.getItem("comparisons")) || [];
      console.log("comparisons", comparisons);
      console.log("this.productData", this.productData);
      if (comparisons.some(
        (obj) => Object.entries(obj).some(
          ([key, value]) => key === "id" && value === this.productData.id
        )
      )) {
        console.log("remove from comparisons", this.productData.id);
        comparisons = comparisons.filter(
          (obj) => !Object.entries(obj).some(
            ([key, value]) => key === "id" && value === this.productData.id
          )
        );
        localStorage.setItem("comparisons", JSON.stringify(comparisons));
        this.button.classList.remove("is-active");
      } else {
        console.log("add to comparisons", this.productData.id);
        comparisons.push(this.productData);
        localStorage.setItem("comparisons", JSON.stringify(comparisons));
        this.button.classList.add("is-active");
      }
      this.button.dispatchEvent(
        new CustomEvent("comparisons-updated", {
          bubbles: true,
          detail: { message: "Comparisons have been updated" }
        })
      );
    });
  }
  display(comparisons) {
    if (comparisons !== null && comparisons.some(
      (obj) => Object.entries(obj).some(
        ([key, value]) => key === "id" && value === this.productData.id
      )
    )) {
      this.button.classList.add("is-active");
    } else {
      this.button.classList.remove("is-active");
    }
  }
  comparisonRemovedFromBar() {
    document.addEventListener("comparisons-updated", (evt) => {
      console.log("evt", evt.detail);
      let comparisons = this.getComparisons();
      this.display(comparisons);
    });
  }
};
window.customElements.define("compare-products-button", CompareProductsButton);

// _src/scripts/components/comparisons-bar.js
var ComparisonsBar = class extends HTMLElement {
  constructor() {
    super();
    this.expandBtn = this.querySelector("button[expand-bar-btn]");
    this.classes = this.classList;
    this.compareCount = this.querySelector("[compare-count]");
    this.content = this.querySelector("aside");
    this.heading = this.querySelector("[heading]");
    console.log("this,ehading", this.heading);
    console.log("GET COMPARISONS", this.getComparisons());
    this.getHeight();
    this.initialRender();
    this.clearAll();
  }
  connectedCallback() {
    this.onChange();
    this.expandBtn.addEventListener("click", () => this.toggleExpand());
    window.addEventListener("resize", () => this.getHeight());
  }
  getHeight() {
    if (window.innerWidth > 1024) {
      this.contentHeight = this.content.clientHeight + "px";
    } else {
      this.contentHeight = this.heading.clientHeight + this.expandBtn.clientHeight + "px";
    }
    console.log("this.contentHeight", this.contentHeight);
    document.documentElement.style.setProperty("--comparisons-bar-height", this.contentHeight);
  }
  toggleExpand() {
    console.log("ehllo", this.classes);
    if (!this.classList.contains("is-active"))
      return;
    if (this.classList.contains("is-expanded")) {
      this.classList.remove("is-expanded");
      this.expandBtn.querySelector("svg").classList.remove("rotate-180");
    } else {
      this.classList.add("is-expanded");
      this.expandBtn.querySelector("svg").classList.add("rotate-180");
    }
  }
  getComparisons() {
    return JSON.parse(localStorage.getItem("comparisons"));
  }
  initialRender() {
    if (this.getComparisons() !== null && this.getComparisons().length > 0) {
      let updatedComparisonsArray = this.getComparisons();
      this.classList.add("is-active");
      this.renderHtml(updatedComparisonsArray);
      this.compareCount.textContent = this.getComparisons().length;
    } else
      this.classList.remove("is-active");
    if (!this.classList.contains("is-expanded"))
      return;
    this.classList.remove("is-expanded");
    if (!this.expandBtn.querySelector("svg").contains("rotate-180"))
      return;
    this.expandBtn.querySelector("svg").classList.remove("rotate-180");
  }
  onChange() {
    document.addEventListener("comparisons-updated", (evt) => {
      console.log("comparisons updated event", evt.detail.message);
      let updatedComparisonsArray = this.getComparisons();
      console.log("updatedComparisonsArray", updatedComparisonsArray);
      if (this.getComparisons().length > 0) {
        this.classList.add("is-active");
        this.renderHtml(updatedComparisonsArray);
        this.updateCount();
      } else {
        this.classList.remove("is-active");
        if (!this.classList.contains("is-expanded"))
          return;
        this.classList.remove("is-expanded");
        if (!this.expandBtn.querySelector("svg").classList.contains("rotate-180"))
          return;
        this.expandBtn.querySelector("svg").classList.remove("rotate-180");
        console.log("TEST");
      }
    });
  }
  updateCount() {
    console.log("count", this.getComparisons().length);
    this.compareCount.textContent = this.getComparisons().length;
  }
  renderHtml(updatedComparisonsArray) {
    console.log("render html", updatedComparisonsArray);
    const listEl = this.querySelector("ul");
    const html = updatedComparisonsArray.map(
      (item) => `
      <li>
        <button remove-item product-id='${item.id}'><img src='https://cdn.shopify.com/s/files/1/0548/9265/8743/files/clear-btn.svg' /></button>
        <img class='comparisons-bar__product-img' src='${item.featured_image}&width=100' />
        <p>${item.title}</p>
      </li>`
    ).join("");
    listEl.innerHTML = html;
    this.removeItem(updatedComparisonsArray);
  }
  removeItem(updatedComparisonsArray) {
    const removeItemButtons = this.querySelectorAll("[remove-item]");
    console.log("removeItemButtons", removeItemButtons);
    removeItemButtons.forEach((btn) => {
      const btnProductId = btn.getAttribute("product-id");
      btn.addEventListener("click", (evt) => {
        if (updatedComparisonsArray.some(
          (obj) => Object.entries(obj).some(
            ([key, value]) => key === "id" && value === btnProductId
          )
        )) {
          console.log("remove from comparisons", btnProductId);
          updatedComparisonsArray = updatedComparisonsArray.filter(
            (obj) => !Object.entries(obj).some(
              ([key, value]) => key === "id" && value === btnProductId
            )
          );
          localStorage.setItem(
            "comparisons",
            JSON.stringify(updatedComparisonsArray)
          );
          btn.dispatchEvent(
            new CustomEvent("comparisons-updated", {
              bubbles: true,
              detail: {
                message: `Comparison bar item removed ${btnProductId}`,
                productId: btnProductId
              }
            })
          );
        }
        this.renderHtml(updatedComparisonsArray);
      });
    });
  }
  clearAll() {
    const clearAllButton = this.querySelector("button[clear-all]");
    console.log("clearAllButton", clearAllButton);
    clearAllButton.addEventListener("click", (evt) => {
      console.log("click");
      let updatedComparisonsArray = [];
      localStorage.setItem(
        "comparisons",
        JSON.stringify(updatedComparisonsArray)
      );
      clearAllButton.dispatchEvent(
        new CustomEvent("comparisons-updated", {
          bubbles: true,
          detail: { message: "Comparisons cleared" }
        })
      );
      this.onChange();
    });
  }
};
window.customElements.define("comparisons-bar", ComparisonsBar);

// _src/scripts/components/filters-compare-button.js
var FiltersCompareButton = class extends HTMLElement {
  constructor() {
    super();
    this.count = this.querySelector("[count]");
  }
  connectedCallback() {
    this.render();
    this.onchange();
  }
  disconnectedCallback() {
  }
  render() {
    if (this.getComparisons() !== null && this.getComparisons().length > 0) {
      this.classList.remove("hidden");
      this.classList.add("block");
      this.count.textContent = this.getComparisons().length;
    } else {
      this.classList.add("hidden");
    }
  }
  onchange() {
    document.addEventListener("comparisons-updated", (evt) => {
      this.render();
    });
  }
  getComparisons() {
    return JSON.parse(localStorage.getItem("comparisons"));
  }
};
window.customElements.define("filters-compare-button", FiltersCompareButton);

// _src/scripts/components/support-sticky-nav.js
var SupportStickyNav = class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const triggers = this.querySelectorAll("button");
    const sections = document.querySelector("#SupportPage-Main").querySelectorAll("h3");
    this.scrollIntoView();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target;
        console.log("target", target);
        if (entry.isIntersecting) {
          console.log("is intersectiong", entry.target);
          triggers.forEach((trigger) => {
            trigger.classList.remove("is-active");
            if (trigger.textContent.trim() === entry.target.textContent.trim()) {
              console.log("SDFSDFSDFSD TRIGGER", trigger);
              trigger.classList.add("is-active");
            }
          });
        }
      });
    }, { rootMargin: "0% 0% -95% 0%" });
    sections.forEach((section) => {
      observer.observe(section);
    });
  }
  scrollIntoView() {
    const triggers = this.querySelectorAll("button");
    const sections = document.querySelector("#SupportPage-Main").querySelectorAll("h3");
    console.log("sections", sections);
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        sections.forEach((section) => {
          console.log("trigger.textContent", trigger.textContent.trim());
          if (section.textContent.trim() === trigger.textContent.trim()) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        });
      });
    });
  }
};
window.customElements.define("support-sticky-nav", SupportStickyNav);

// _src/scripts/components/compare-listing.js
var CompareListing = class extends HTMLElement {
  constructor() {
    super();
    this.productCardList = this.querySelector("[compare-product-card-listing]");
    this.specsList = this.querySelector("[compare-specs-listing]");
    console.log("COMPARE LISTING", this.getComparisons());
    this.renderHTML();
  }
  connectedCallback() {
  }
  getComparisons() {
    return JSON.parse(localStorage.getItem("comparisons"));
  }
  renderHTML() {
    console.log("this.productCardList", this.productCardList);
    this.renderProductCards();
    this.renderSpecs();
  }
  renderProductCards() {
    if (this.getComparisons() !== null && this.getComparisons().length > 0) {
      const html = this.getComparisons().map(
        (product, idx) => `
        <th class="text-center p-4" >
          <div class="flex flex-col justify-start" style="width:350px">
            <div class="aspect-square bg-neutral-100 p-8 mb-4 mx-auto" >
              <img src="${product.featured_image}&width=300" loading="lazy" class="w-full"  style="width: 350px">
            </div>
            <p class="mb-4"><a href="${product.url}" class="text-xl">${product.title}</a></p>
           
            <p class="font-normal text-lg">${product.price}</p>
          </div>
        </th>
      `
      ).join("");
      this.productCardList.innerHTML = html;
      const firstTh = document.createElement("th");
      firstTh.classList.add("py-8", "pr-4", "max-w-full", "w-72");
      if (this.productCardList.hasChildNodes()) {
        this.productCardList.insertBefore(
          firstTh,
          this.productCardList.firstChild
        );
      }
    }
  }
  // renderSpecs() {
  //   if (this.getComparisons() !== null && this.getComparisons().length > 0) {
  //     // Array to store unique spec names
  //     const specNames = [];
  //     // Iterate over each product in the comparisons array to get all unique spec names
  //     this.getComparisons().forEach((product) => {
  //       console.log("renderSpecs product", product)
  //       if ( product.specs) {
  //         product.specs.forEach((spec) => {
  //           if (!specNames.includes(spec.name)) {
  //             specNames.push(spec.name);
  //           }
  //         });
  //       }
  //     });
  //     // // Sort the spec names alphabetically
  //     // specNames.sort();
  //     console.log("SpecNames", specNames)
  //     const specsListEl = this.querySelector('[compare-specs-listing]')
  //     let specListHTML = ``
  //     // specNames.forEach((name, idx) => {
  //     //   specListHTML += `
  //     //     <tr class='${idx % 2 === 0 ? 'bg-neutral-100' : '' } whitespace-nowrap'>
  //     //       <td class='py-4 px-4 font-medium border-b border-gray-200 max-w-full w-72'>${name}</td>
  //     //     </tr>
  //     //   `
  //     // })
  //     //Render Specs HTML adding a table cell for each unique spec name
  //     this.getComparisons().forEach((product) => {
  //       // const specTitle = document.createElement('td')
  //       // specTitle.classList.add('px-4', 'pr-4', 'font-medium', 'border-b', 'border-gray-200', 'max-w-full', 'w-72')
  //       // specListHTML += `<td class="py-4 pr-4 font-medium border-b border-gray-200 max-w-full w-72">title</td>`
  //         specNames.forEach((name, idx) => {
  //           if(product.specs) {
  //             const spec = product.specs.find((s) => s.name === name)
  //             const value = spec ? spec.value : "—";
  //             specListHTML += `
  //             <tr class='${idx % 2 === 0 ? 'bg-neutral-100' : '' } whitespace-nowrap'>
  //               <td class='py-4 px-4 font-medium border-b border-gray-200 max-w-full w-72'>${name}</td>
  //               <td class="px-4 py-4 text-center border-b border-gray-200">${value}</td>
  //             </tr>
  //           `
  //           }
  //           // let specRowHTML =  `<td class="px-4 py-4 text-center border-b border-gray-200">${value}</td>`
  //           // console.log("spec name + value ==== ", spec.name + ', ' + value)
  //           // specListHTML += `<td class="px-4 py-4 text-center border-b border-gray-200">${value}</td>`
  //           // const specTitle = document.createElement('td')
  //           // specTitle.classList.add('px-4', 'pr-4', 'font-medium', 'border-b', 'border-gray-200')
  //           // specListHTML += `<td class="px-4 py-4 text-center border-b border-gray-200">${value}</td>`
  //         //  `<td class="px-4 py-4 text-center border-b border-gray-200">${value}</td>`
  //         })
  //     })
  //     // specListHTML += `</tr>`
  //     specsListEl.innerHTML = specListHTML
  //   }
  // }
  renderSpecs() {
    const specNames = [
      ...new Set(
        this.getComparisons().flatMap((c2) => c2.specs.map((s2) => s2.name))
      )
    ];
    const specValues = specNames.map((name) => {
      const valuesArray = this.getComparisons().flatMap((c2) => {
        const spec = c2.specs.find((s2) => s2.name === name);
        return spec ? spec.value : "\u2014";
      });
      return { name, values: valuesArray };
    });
    console.log("specvalues", specValues);
    let html = `
      
    `;
    specValues.forEach((item, idx) => {
      console.log("item", item);
      html += `<tr class='${idx % 2 === 0 ? "bg-neutral-100" : ""} '>`;
      html += `<td class='py-4 px-4 font-medium border-b border-gray-200 max-w-full w-72 whitespace-nowrap'>${item.name}</td>`;
      item.values.forEach((value, idx2) => {
        html += `<td class="px-4 py-4 text-center border-b border-gray-200"><div style="width: 350px">${value}</div></td>`;
      });
      html += `</tr>`;
    });
    console.log("html", html);
    this.specsList.innerHTML = html;
  }
};
window.customElements.define("compare-listing", CompareListing);

// _src/scripts/components/lazy-slide-video.js
var LazySlideVideo = class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.video = this.querySelector("video");
    this.soundButton = this.querySelector("button[sound-button]");
    this.iconSoundOn = this.querySelector("span[icon-sound-on]");
    this.iconSoundOff = this.querySelector("span[icon-sound-off]");
    this.toggleSound();
  }
  toggleSound() {
    this.soundButton.addEventListener("click", () => {
      this.video.muted = !this.video.muted;
      if (this.video.muted) {
        this.iconSoundOff.classList.add("hidden");
        this.iconSoundOn.classList.remove("hidden");
      } else {
        this.iconSoundOn.classList.add("hidden");
        this.iconSoundOff.classList.remove("hidden");
      }
    });
  }
  play() {
    console.log("play");
    this.video.play();
  }
  pause() {
    console.log("pause");
    this.video.pause();
  }
  static get observedAttributes() {
    return ["is-active"];
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "is-active") {
      if (this.hasAttribute("is-active")) {
        console.log("The is-active attribute exists");
        this.play();
      } else {
        console.log("The is-active attribute does not exist");
        this.pause();
      }
    }
  }
};
window.customElements.define("lazy-slide-video", LazySlideVideo);

// _src/scripts/components/pagination-component.js
var PaginationComponent = class extends HTMLElement {
  constructor() {
    super();
    this.isLoading = false;
    this.button = this.querySelector("button");
  }
  connectedCallback() {
    this.button.addEventListener("click", this.loadMore.bind(this));
  }
  async loadMore() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.button.disabled = true;
    const path = this.getAttribute("url");
    if (!path)
      return;
    console.log("PATH =====>", path);
    try {
      const response = await fetch(`${path}&section_id=main-collection-product-grid`);
      const data = await response.text();
      this.button.disabled = false;
      this.isLoading = false;
      const productListHTML = new DOMParser().parseFromString(data, "text/html").querySelector("#product-grid").innerHTML;
      const productGrid = document.querySelector("#product-grid");
      productGrid.insertAdjacentHTML("beforeend", productListHTML);
      const paginationURL = new DOMParser().parseFromString(data, "text/html").querySelector("pagination-component");
      console.log("paginationURL", paginationURL);
      if (!paginationURL) {
        this.remove();
        return;
      }
      this.setAttribute("url", paginationURL.getAttribute("url"));
    } catch (err) {
      console.error(err);
      this.button.disabled = false;
      this.isLoading = false;
    }
  }
};
window.customElements.define("pagination-component", PaginationComponent);

// _src/scripts/components/user-manuals-section.js
var UserManualsSection = class extends HTMLElement {
  constructor() {
    super();
    this.mainProductList = this.querySelector("div[product-list]");
    this.fieldset = this.querySelector("fieldset[button-group]");
    console.log("this.fieldset", this.fieldset);
    this.cachedResults = {};
    this.searchInput = this.querySelector('input[type="search"]');
    this.searchForm = this.querySelector("form[search-form]");
  }
  connectedCallback() {
    this.onChange();
    this.setupSearchEventlisteners();
  }
  setupSearchEventlisteners() {
    this.searchForm.addEventListener("submit", this.onSearchFormSubmit.bind(this));
    this.searchInput.addEventListener("input", debounce((event2) => {
      this.searchOnChange(event2);
    }, 300).bind(this));
    this.searchInput.addEventListener("focus", this.searchOnFocus.bind(this));
  }
  getSearchQuery() {
    return this.searchInput.value.trim();
  }
  onSearchFormSubmit(event2) {
    if (!this.getSearchQuery().length || this.querySelector('[aria-selected="true"] a'))
      event2.preventDefault();
  }
  searchOnChange() {
    const searchTerm = this.getSearchQuery();
    if (!searchTerm.length) {
      return;
    }
    this.getSearchResults(searchTerm);
  }
  searchOnFocus() {
    const searchTerm = this.getSearchQuery();
    if (!searchTerm.length)
      return;
    if (this.getAttribute("results") === "true") {
    } else {
      this.getSearchResults(searchTerm);
    }
  }
  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(" ", "-").toLowerCase();
    this.setLiveRegionLoadingState();
    const limit = this.getAttribute("limit");
    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      return;
    }
    fetch(`${window.themeVariables.routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&${encodeURIComponent("resources[type]")}=product&${encodeURIComponent("resources[limit]")}=${limit}&resources[options][fields]=title,product_type,tag&&section_id=manuals-search-results`).then((response) => {
      if (!response.ok) {
        var error = new Error(response.status);
        console.log("error", error);
        throw error;
      }
      return response.text();
    }).then((text) => {
      const resultsMarkup = new DOMParser().parseFromString(text, "text/html").querySelector("#shopify-section-manuals-search-results").innerHTML;
      this.cachedResults[queryKey] = resultsMarkup;
      this.renderSearchResults(resultsMarkup);
    }).catch((error) => {
      console.log("catch error", error);
      throw error;
    });
  }
  renderSearchResults(resultsMarkup) {
    this.mainProductList.innerHTML = resultsMarkup;
    this.setAttribute("results", true);
    this.setLiveRegionResults();
  }
  setLiveRegionResults() {
    this.removeAttribute("loading");
    this.setLiveRegionText(this.querySelector("[data-predictive-search-live-region-count-value]").textContent);
  }
  setLiveRegionLoadingState() {
    this.statusElement = this.statusElement || this.querySelector(".predictive-search-status");
    this.loadingText = this.loadingText || this.getAttribute("data-loading-text");
    this.setLiveRegionText(this.loadingText);
    this.setAttribute("loading", true);
  }
  setLiveRegionText(statusText) {
    this.statusElement.setAttribute("aria-hidden", "false");
    this.statusElement.textContent = statusText;
    setTimeout(() => {
      this.statusElement.setAttribute("aria-hidden", "true");
    }, 1e3);
  }
  onChange() {
    this.fieldset.addEventListener("change", (evt) => {
      console.log("evt", evt.target.value);
      this.addQueryParamterToURL(evt);
      this.renderSection(evt);
    });
  }
  addQueryParamterToURL(evt) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("collection", evt.target.value);
    history.pushState(null, "", currentUrl.toString());
  }
  renderSection(evt) {
    const path = `/collections/${evt.target.value}`;
    let request = new XMLHttpRequest();
    console.log("path", path);
    request.open(
      "GET",
      `${path}?section_id=manuals-product-grid&collection=air-fryers`,
      true
    );
    request.onload = () => {
      if (request.readyState === request.DONE) {
        if (request.status === 200) {
          console.log("request", request);
          const responseHTML = new DOMParser().parseFromString(request.responseText, "text/html").querySelector(".shopify-section").innerHTML;
          console.log("responseHTML", responseHTML);
          this.mainProductList.innerHTML = responseHTML;
        }
      }
    };
    request.send(null);
  }
};
window.customElements.define("user-manuals-section", UserManualsSection);

// _src/scripts/components/lazy-video.js
var LazyVideo = class extends HTMLElement {
  constructor() {
    super();
    this.video = this.querySelector("video");
    this.desktop_src = this.getAttribute("data-src");
    this.desktop_poster = this.getAttribute("poster");
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!this.video.querySelector("source")) {
            this.source = document.createElement("source");
            this.source.src = this.desktop_src;
            this.video.appendChild(this.source);
          }
          this.video.play();
          console.log("play");
        } else {
          this.video.pause();
          console.log("pause");
        }
      },
      { rootMargin: "0px 0px -30px 0px" }
    );
    this.observer.observe(this);
  }
};
window.customElements.define("lazy-video", LazyVideo);

// _src/scripts/components/lazy-video-sources.js
var LazyVideoSources = class extends HTMLElement {
  constructor() {
    super();
    this.lazyload = this.hasAttribute("lazyload");
    this.video = this.querySelector("video");
    this.desktop_src = this.getAttribute("desktop-src");
    this.desktop_mime = this.getAttribute("desktop-mime");
    this.desktop_poster = this.getAttribute("desktop-poster");
    this.mobile_src = this.getAttribute("mobile-src");
    this.mobile_mime = this.getAttribute("mobile-mime");
    this.mobile_poster = this.getAttribute("mobile-poster");
    this.mq_tablet_up = window.matchMedia("(min-width: 768px)");
    this.soundButton = this.querySelector("button[sound-button]");
    this.iconSoundOn = this.querySelector("span[icon-sound-on]");
    this.iconSoundOff = this.querySelector("span[icon-sound-off]");
    this.DESKTOP_VIDEO_LOADED = false;
    this.MOBILE_VIDEO_LOADED = false;
  }
  connectedCallback() {
    if (!this.lazyload)
      this.loadVideo();
    if (this.lazyload)
      this.initIntersectionObserver();
    if (this.mobile_src || this.mobile_src.trim() !== "") {
      this.mq_tablet_up.addEventListener(
        "change",
        this.handleMediaQueryChange.bind(this)
      );
    }
    this.toggleSound();
  }
  disconnectedCallback() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
  toggleSound() {
    if (!this.soundButton)
      return;
    this.soundButton.addEventListener("click", () => {
      this.video.muted = !this.video.muted;
      if (this.video.muted) {
        this.iconSoundOff.classList.add("hidden");
        this.iconSoundOn.classList.remove("hidden");
      } else {
        this.iconSoundOn.classList.add("hidden");
        this.iconSoundOff.classList.remove("hidden");
      }
    });
  }
  initIntersectionObserver() {
    const options = {
      root: null,
      //use the viewport as the root element
      rootMargin: "0px 0px -30px 0px"
      // % or px - offsets added to each side of the intersection
    };
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!this.video.querySelector("source")) {
            this.loadVideo();
          } else {
            this.video.play();
          }
          console.log("lazy-video-sources play");
        } else {
          this.video.pause();
          console.log("lazy-video-sources pause");
        }
      });
    }, options);
    this.observer.observe(this);
  }
  loadVideo() {
    if (!this.mobile_src || this.mobile_src.trim() === "") {
      console.log("one video source is provided");
      this.video.poster = this.desktop_poster;
      this.source = document.createElement("source");
      this.source.src = this.desktop_src;
      this.poster = document.createElement("img");
      this.poster.src = this.desktop_poster;
      this.video.appendChild(this.source);
      this.video.appendChild(this.poster);
      this.video.setAttribute("autoplay", "");
      this.video.setAttribute("playsinline", "");
      this.video.play();
    } else {
      if (!this.mq_tablet_up.matches) {
        console.log("Media query does not match");
        this.video.poster = this.mobile_poster;
        this.source = document.createElement("source");
        this.source.src = this.mobile_src;
        this.poster = document.createElement("img");
        this.poster.src = this.mobile_poster;
        this.video.appendChild(this.source);
        this.video.appendChild(this.poster);
        this.video.setAttribute("autoplay", "");
        this.video.setAttribute("playsinline", "");
        this.video.play();
      }
      if (this.mq_tablet_up.matches) {
        console.log("Media query matches");
        this.video.poster = this.desktop_poster;
        this.source = document.createElement("source");
        this.source.src = this.desktop_src;
        this.poster = document.createElement("img");
        this.poster.src = this.desktop_poster;
        this.video.appendChild(this.source);
        this.video.appendChild(this.poster);
        this.video.setAttribute("autoplay", "");
        this.video.setAttribute("playsinline", "");
        this.video.play();
      }
    }
  }
  handleMediaQueryChange(event2) {
    if (event2.matches) {
      console.log("Media query matches", this.desktop_src);
      this.video.querySelector("img").src = this.desktop_poster;
      this.video.querySelector("source").src = this.desktop_src;
      this.video.load();
    } else {
      console.log("Media query does not match", this.mobile_src);
      this.video.querySelector("img").src = this.mobile_poster;
      this.video.querySelector("source").src = this.mobile_src;
      this.video.load();
    }
  }
};
window.customElements.define("lazy-video-sources", LazyVideoSources);

// _src/scripts/components/quick-add-to-cart.js
var QuickAddToCart = class extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector("form");
    if (document.querySelector("cart-drawer"))
      this.submitButton = this.querySelector('[type="submit"]');
    this.submitButton.setAttribute("aria-haspopup", "dialog");
    this.cart = document.querySelector("cart-notification") || document.querySelector("cart-drawer");
  }
  connectedCallback() {
    this.addEventListener("change", this.onVariantChange);
    this.addEventListener("submit", (evt) => this.onSubmit(evt));
  }
  onSubmit(evt) {
    evt.preventDefault();
    const config = fetchConfig2("javascript");
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    delete config.headers["Content-Type"];
    const formData = new FormData(this.form);
    if (this.cart) {
      formData.append(
        "sections",
        this.cart.getSectionsToRender().map((section) => section.id)
      );
      formData.append("sections_url", window.location.pathname);
      this.cart.setActiveElement(document.activeElement);
    }
    config.body = formData;
    console.log(
      "this.cart.getSectionsToRender().map((section) => section.id)",
      this.cart.getSectionsToRender().map((section) => section.id)
    );
    fetch(`${themeVariables.routes.cart_add_url}`, config).then((response) => response.json()).then((response) => {
      console.log("response", response);
      if (response.status) {
        this.handleErrorMessage(response.description);
        const soldOutMessage = this.submitButton.querySelector(".sold-out-message");
        if (!soldOutMessage)
          return;
        this.submitButton.setAttribute("aria-disabled", true);
        this.submitButton.textContent = "Sold out";
        this.error = true;
        return;
      } else if (!this.cart) {
        window.location = window.themeVariables.routes.cart_url;
        return;
      }
      this.error = false;
      const quickAddModal = this.closest("quick-add-modal");
      if (!quickAddModal) {
        this.cart.renderContents(response);
        console.log("this,cart res", response);
      }
    }).catch((e2) => console.error("ProductForm E", e2)).finally((e2) => {
      this.submitButton.classList.remove("is-loading");
      if (this.cart && this.cart.classList.contains("is-empty"))
        this.cart.classList.remove("is-empty");
      if (!this.error)
        this.submitButton.removeAttribute("aria-disabled");
    });
  }
  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, "", false);
    console.log("THIS CURRENT VARIANT", this.currentVariant);
    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateVariantInput();
      this.renderProductInfo();
    }
  }
  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value;
    });
  }
  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }
  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = this.querySelector("form");
    if (!productForm)
      return;
    const addButton = productForm.querySelector('button[name="add"]');
    if (!addButton)
      return;
    if (disable) {
      addButton.setAttribute("disabled", "disabled");
      if (text)
        addButton.textContent = text;
    } else {
      addButton.removeAttribute("disabled");
      addButton.textContent = window.themeVariables.strings.addToCart;
    }
    if (!modifyClass)
      return;
  }
  setUnavailable() {
    const addButton = this.querySelector('[name="add"]');
    if (!addButton)
      return;
    addButton.textContent = window.variantStrings.unavailable;
  }
  updateMedia() {
    const colorFieldset = this.querySelector("fieldset[color-variant]");
    if (!colorFieldset)
      return;
    console.log("colorFieldset", colorFieldset);
    colorFieldset.dispatchEvent(
      new CustomEvent("color-variant:changed", {
        bubbles: true,
        detail: this.currentVariant
      })
    );
  }
  updateVariantInput() {
    const input = this.querySelector("form").querySelector('input[name="id"]');
    input.value = this.currentVariant.id;
  }
  renderProductInfo() {
    this.toggleAddButton(
      !this.currentVariant.available,
      window.themeVariables.strings.soldOut
    );
    if (!this.currentVariant.featured_image)
      return;
    this.productImage = this.querySelector("img");
    this.productImage.src = this.currentVariant.featured_image.src + "&width=500";
  }
};
window.customElements.define("quick-add-to-cart", QuickAddToCart);

// _src/scripts/components/quick-add-to-cart-sticky.js
var QuickAddToCartSticky = class extends HTMLElement {
  constructor() {
    super();
    this.aside = this.querySelector("aside");
    this.asideHeight = this.aside.offsetHeight;
  }
  connectedCallback() {
    var prevScrollPos = window.pageYOffset;
    window.addEventListener("scroll", () => {
      var currentScrollPos = window.pageYOffset;
      if (currentScrollPos > this.asideHeight) {
        this.aside.classList.add("is-active");
      } else {
        this.aside.classList.remove("is-active");
      }
      prevScrollPos = currentScrollPos;
    });
  }
  disconnectedCallback() {
  }
  attributeChangedCallback(name, oldVal, newVal) {
  }
  adoptedCallback() {
  }
};
window.customElements.define("quick-add-to-cart-sticky", QuickAddToCartSticky);

// _src/scripts/components/modal-component.js
var ModalComponent = class extends HTMLElement {
  constructor() {
    super();
    this.details = this.querySelector("details");
    this.summary = this.querySelector("summary");
    this.aside = this.querySelector("aside");
    this.closeButton = this.querySelector("button[close-button]");
  }
  connectedCallback() {
    this.summary.addEventListener("click", this.onClick.bind(this));
    this.details.addEventListener(
      "keyup",
      (event2) => event2.code.toUpperCase() === "ESCAPE" && this.close()
    );
    this.closeButton.addEventListener("click", () => this.close());
  }
  onClick(event2) {
    event2.preventDefault();
    event2.target.closest("details").hasAttribute("open") ? this.close() : this.open(event2);
  }
  isOpen() {
    return this.details.hasAttribute("open");
  }
  // onBodyClick(event) {
  //   if (!this.contains(event.target) || event.target.classList.contains('modal-overlay')) this.close(false);
  // }
  open(event2) {
    event2.target.closest("details").setAttribute("open", true);
    document.body.classList.add("overflow-hidden");
    trapFocus2(this.aside);
  }
  close(focusToggle = true) {
    removeTrapFocus2(focusToggle ? this.summary : null);
    this.details.removeAttribute("open");
    document.body.classList.remove("overflow-hidden");
  }
};
window.customElements.define("modal-component", ModalComponent);

// _src/scripts/components/defer-embed-video.js
var DeferEmbedVideo = class extends HTMLElement {
  constructor() {
    super();
    this.video = this.querySelector("iframe");
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.video.src = this.video.dataset.src;
          this.observer.unobserve(this);
        }
      },
      { rootMargin: "0px 0px -30px 0px" }
    );
    this.observer.observe(this);
  }
};
window.customElements.define("defer-embed-video", DeferEmbedVideo);

// _src/scripts/components/blog-filter.js
var BlogFilter = class extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector("form");
    this.inputs = this.form.querySelectorAll("input");
    this.currentPath = window.location.pathname;
    this.relativePath = this.currentPath.split("/tagged/")[0];
    this.checkForActiveValues();
  }
  connectedCallback() {
    this.form.addEventListener("change", (evt) => {
      console.log("change", evt.target.value);
      this.onChange(evt);
    });
  }
  checkForActiveValues() {
    if (!this.currentPath.includes("/tagged"))
      return;
    this.activeTags = this.currentPath.split("tagged/")[1];
    console.log("this.activeTags", this.activeTags);
    this.activeTagsArray = this.activeTags.split("+");
    console.log("this.activeTagsArray", this.activeTagsArray);
    this.matchingInputs = Array.from(this.inputs).filter((input) => this.activeTagsArray.includes(input.value));
    console.log("this.matchingInputs", this.matchingInputs);
    this.matchingInputs.forEach((input) => {
      input.checked = true;
      input.closest("details").open = true;
    });
  }
  onChange(evt) {
    console.log("current path", window.location.pathname);
    if (!this.currentPath.includes("/tagged")) {
      console.log("doesnt include tagged");
      window.location.href = window.location.origin + this.currentPath + "/tagged/" + evt.target.value;
    }
    if (this.currentPath.includes("/tagged")) {
      console.log("includes tagged");
      if (this.currentPath.includes(evt.target.value)) {
        console.log("includes evt target value");
        this.activeTagsArray = this.activeTagsArray.filter((value) => value !== evt.target.value);
        console.log("UPDATED this.activeTagsArray", this.activeTagsArray);
        this.activeTagsString = this.activeTagsArray.join("+");
        console.log("this.activeTagsString", this.activeTagsString);
        if (this.activeTagsArray.length > 0) {
          window.location.href = window.location.origin + this.relativePath + "/tagged/" + this.activeTagsString;
        } else {
          window.location.href = window.location.origin + this.relativePath + this.activeTagsString;
        }
        console.log("this.relativePath ", this.relativePath);
      } else {
        console.log("doesnt includes evt target value");
        window.location.href = this.currentPath + "+" + evt.target.value;
      }
    }
  }
};
window.customElements.define("blog-filter", BlogFilter);

// _src/scripts/components/blog-filter-drawer.js
var BlogFilterDrawer = class extends HTMLElement {
  constructor() {
    super();
    this.details = this.querySelector("details");
    this.summary = this.querySelector("summary");
    this.closeBtn = this.querySelector("button[close]");
  }
  connectedCallback() {
    this.closeBtn.addEventListener("click", (evt) => {
      this.details.removeAttribute("open");
      this.summary.setAttribute("aria-expanded", false);
    });
  }
};
window.customElements.define("blog-filter-drawer", BlogFilterDrawer);

// _src/scripts/components/card-product-quick-add.js
var CardProductQuickAdd = class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.variantPicker = this.querySelector("[variant-picker]");
    this.addButton = this.querySelector('button[name="add"]');
    this.addButtonText = this.addButton.querySelector("span");
    this.masterId = this.querySelector('input[name="id"]');
    this.price = this.querySelector("[price]");
    this.productImage = this.querySelector("img[product-image]");
    this.form = this.querySelector("form");
    this.cart = document.querySelector("cart-notification") || document.querySelector("cart-drawer");
    this.closeBtns = this.querySelectorAll("[variant-selector-close]");
    this.masterId.disabled = false;
    this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
    if (!this.variantPicker)
      return;
    this.addEventListener("change", (evt) => this.onVariantChange(evt));
    this.closeBtns.forEach((btn) => {
      btn.addEventListener(
        "click",
        (evt) => this.closeVariantSelectorPopup(evt)
      );
    });
    this.addButton.addEventListener("click", (evt) => {
      this.onSubmitHandler(evt);
    });
  }
  closeVariantSelectorPopup(evt) {
    evt.target.closest("details").removeAttribute("open");
  }
  onSubmitHandler(evt) {
    evt.preventDefault();
    if (this.addButton.getAttribute("aria-disabled") === "true")
      return;
    this.addButton.setAttribute("aria-disabled", true);
    const config = fetchConfig2("javascript");
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    delete config.headers["Content-Type"];
    const formData = new FormData(this.form);
    if (this.cart) {
      formData.append(
        "sections",
        this.cart.getSectionsToRender().map((section) => section.id)
      );
      formData.append("sections_url", window.location.pathname);
      this.cart.setActiveElement(document.activeElement);
    }
    config.body = formData;
    console.log(
      "this.cart.getSectionsToRender().map((section) => section.id)",
      this.cart.getSectionsToRender().map((section) => section.id)
    );
    fetch(`${themeVariables.routes.cart_add_url}`, config).then((response) => response.json()).then((response) => {
      console.log("response", response);
      if (response.status) {
        this.handleErrorMessage(response.description);
        const soldOutMessage = this.addButton.querySelector(".sold-out-message");
        if (!soldOutMessage)
          return;
        this.addButton.setAttribute("aria-disabled", true);
        this.addButton.querySelector("span").classList.add("hidden");
        soldOutMessage.classList.remove("hidden");
        this.error = true;
        return;
      } else if (!this.cart) {
        window.location = window.themeVariables.routes.cart_url;
        return;
      }
      this.error = false;
      const quickAddModal = this.closest("quick-add-modal");
      if (quickAddModal) {
      } else {
        this.cart.renderContents(response);
        console.log("this,cart res", response);
      }
    }).catch((e2) => console.error("ProductForm E", e2)).finally((e2) => {
      this.addButton.classList.remove("is-loading");
      if (this.cart && this.cart.classList.contains("is-empty"))
        this.cart.classList.remove("is-empty");
      if (!this.error)
        this.addButton.removeAttribute("aria-disabled");
    });
  }
  handleErrorMessage(errorMessage = false) {
    this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector("[error-msg]");
    if (!this.errorMessageWrapper)
      return;
    this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector(".product-form__error-message");
    this.errorMessageWrapper.classList.toggle("hidden", !errorMessage);
    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }
  onVariantChange(evt) {
    this.updateOptions();
    this.updateMasterId();
    this.closeOnVariantChange(evt);
    console.log("THIS CURRENT VARIANT", this.currentVariant);
    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    }
    if (this.currentVariant) {
      this.updateProductInfo();
      this.updateMedia();
      this.updateProductId();
    }
  }
  closeOnVariantChange(evt) {
    if (!evt.target.closest("details"))
      return;
    evt.target.closest("details").removeAttribute("open");
  }
  updateProductInfo() {
    if (!this.currentVariant)
      return;
    if (!this.currentVariant.available) {
      this.addButton.disabled = true;
      this.addButtonText.textContent = window.themeVariables.strings.soldOut;
    } else {
      this.addButton.disabled = false;
      this.addButtonText.textContent = window.themeVariables.strings.addToCart;
    }
  }
  updateMedia() {
    if (!this.currentVariant.featured_image)
      return;
    this.productImage.src = `${this.currentVariant.featured_image.src}&width=500`;
  }
  updateProductId() {
    this.masterId.value = this.currentVariant.id;
  }
  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value;
    });
  }
  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }
  toggleAddButton(disable = true, text, modifyClass = true) {
    if (!this.addButton)
      return;
    if (disable) {
      this.addButton.setAttribute("disabled", "disabled");
      if (text)
        this.addButtonText.textContent = text;
    } else {
      this.addButton.removeAttribute("disabled");
      this.addButtonText.textContent = window.themeVariables.strings.addToCart;
    }
    if (!modifyClass)
      return;
  }
  setUnavailable() {
    if (!this.addButton)
      return;
    this.addButtonText.textContent = window.variantStrings.unavailable;
    if (this.price)
      this.price.classList.add("sr-only");
  }
};
window.customElements.define("card-product-quick-add", CardProductQuickAdd);

// _src/scripts/components/open-chatbox-button.js
var OpenChatboxButton = class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.addEventListener("click", () => {
      Forethought("widget", "open");
    });
  }
};
window.customElements.define("open-chatbox-button", OpenChatboxButton);

// _src/scripts/components/toggle-element.js
var ToggleElement = class extends HTMLElement {
  constructor() {
    super();
    this.label = this.querySelector("label");
    this.input = this.querySelector('input[type="checkbox"]');
  }
  connectedCallback() {
    this.handleToggle();
  }
  disconnectedCallback() {
  }
  handleToggle() {
    this.label.addEventListener("click", () => {
      this.input.checked = !this.input.checked;
      console.log("checked!");
    });
  }
  attributeChangedCallback(name, oldVal, newVal) {
  }
  adoptedCallback() {
  }
};
window.customElements.define("toggle-element", ToggleElement);

// _src/scripts/components/accordion-component.js
var AccordionComponent = class extends HTMLElement {
  constructor() {
    super();
    this.accordions = this.querySelectorAll("details");
  }
  connectedCallback() {
    this.addEventListener("toggle", this.accordionHandler.bind(this), true);
  }
  disconnectedCallback() {
  }
  accordionHandler(event2) {
    event2.target.classList.toggle("open");
    if (!event2.target.hasAttribute("open"))
      return;
    console.log("toggle", event2.target);
    this.opened = this.querySelectorAll("details[open]");
    for (let accordion of this.accordions) {
      if (accordion === event2.target)
        continue;
      accordion.removeAttribute("open");
    }
  }
  attributeChangedCallback(name, oldVal, newVal) {
  }
  adoptedCallback() {
  }
};
window.customElements.define("accordion-component", AccordionComponent);

// _src/scripts/components/sticky-nav-anchor-links.js
var StickyNavAnchorLinks = class extends HTMLElement {
  constructor() {
    super();
    this.height = this.offsetHeight;
    this.scrollThreshold = this.getBoundingClientRect().top;
    this.links = this.querySelectorAll("button");
    console.log("this.scrollThreshold", this.scrollThreshold);
    console.log("this.height", this.height);
    if (this.scrollThreshold < 0)
      this.scrollThreshold = 100;
  }
  connectedCallback() {
    document.addEventListener("DOMContentLoaded", this.handleScroll.bind(this));
    window.addEventListener("scroll", this.handleScroll.bind(this));
    this.links.forEach((link) => {
      const section = document.getElementById(link.getAttribute("data-target"));
      if (!section)
        return;
      section.style.scrollMarginTop = "80px";
      link.addEventListener("click", (e2) => this.handleClick.bind(this)(e2));
    });
  }
  disconnectedCallback() {
    window.removeEventListener("scroll", this.handleScroll.bind(this));
  }
  handleScroll() {
    if (window.scrollY >= this.scrollThreshold) {
      this.classList.add("is-active");
    } else {
      this.classList.remove("is-active");
    }
  }
  handleClick(e2) {
    console.log("click", e2.target);
    console.log("click", this);
    this.links.forEach((link) => link.classList.remove("is-active"));
    e2.target.classList.add("is-active");
    const target = document.getElementById(e2.target.dataset.target);
    console.log("targetr", target);
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        offset: "100px"
      });
    }
  }
  // highlightOnScroll(section) {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.target === section) {
  //           if (entry.isIntersecting) {
  //             let section_id = section.getAttribute("id");
  //             section.classList.add("is-active");
  //             console.log("target is intersecting", section);
  //             console.log("entry", entry);
  //             this.links.forEach((link) => link.classList.remove("is-active"));
  //             this.querySelector(`[data-target="${section_id}"]`).classList.add(
  //               "is-active"
  //             );
  //           } else {
  //             section.classList.remove("is-active");
  //             console.log("target is not intersecting", section);
  //           }
  //         }
  //       });
  //     },
  //     // { rootMargin: `0px 0px ${section.offsetHeight}px 0px` }
  //     {
  //       root: null,
  //       rootMargin: "-100% 0px -100px 0px",
  //     }
  //   );
  //   observer.observe(section);
  // }
};
window.customElements.define("sticky-nav-anchor-links", StickyNavAnchorLinks);

// _src/scripts/essential/product/variant-selects.js
var VariantSelects = class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onVariantChange);
  }
  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, "", false);
    this.updatePickupAvailability();
    this.removeErrorMessage();
    console.log("THIS CURRENT VARIANT", this.currentVariant);
    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
    }
  }
  updateOptions() {
    this.options = Array.from(this.querySelectorAll("input[checked]"), (checked) => checked.value);
  }
  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }
  updateMedia() {
    const colorFieldset = this.querySelector("fieldset[color-variant]");
    if (!colorFieldset)
      return;
    console.log("colorFieldset", colorFieldset);
    colorFieldset.dispatchEvent(new CustomEvent("color-variant:changed", { bubbles: true, detail: this.currentVariant }));
  }
  // updateMedia() {
  //   if (!this.currentVariant) return;
  //   if (!this.currentVariant.featured_media) return;
  //   const mediaGalleries = document.querySelectorAll(`[id^="MediaGallery-${this.dataset.section}"]`);
  //   mediaGalleries.forEach(mediaGallery => mediaGallery.setActiveMedia(`${this.dataset.section}-${this.currentVariant.featured_media.id}`, true));
  //   const modalContent = document.querySelector(`#ProductModal-${this.dataset.section} .product-media-modal__content`);
  //   if (!modalContent) return;
  //   const newMediaModal = modalContent.querySelector( `[data-media-id="${this.currentVariant.featured_media.id}"]`);
  //   modalContent.prepend(newMediaModal);
  // }
  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === "false")
      return;
    window.history.replaceState({}, "", `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }
  updateShareUrl() {
    const shareButton = document.getElementById(`Share-${this.dataset.section}`);
    if (!shareButton || !shareButton.updateUrl)
      return;
    shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
  }
  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }
  renderProductInfo() {
    fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`).then((response) => response.text()).then((responseText) => {
      const html = new DOMParser().parseFromString(responseText, "text/html");
      const destination = document.getElementById(`price-${this.dataset.section}`);
      const source = html.getElementById(`price-${this.dataset.originalSection ? this.dataset.originalSection : this.dataset.section}`);
      if (source && destination)
        destination.innerHTML = source.innerHTML;
      const price = document.getElementById(`price-${this.dataset.section}`);
      if (price)
        price.classList.remove("sr-only");
      this.toggleAddButton(!this.currentVariant.available, window.themeVariables.strings.soldOut);
    });
  }
  removeErrorMessage() {
    const section = this.closest("section");
    if (!section)
      return;
    const productForm = section.querySelector("product-form");
    if (productForm)
      productForm.handleErrorMessage();
  }
  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector("pickup-availability");
    if (!pickUpAvailability)
      return;
    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute("available");
      pickUpAvailability.innerHTML = "";
    }
  }
  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.section}`);
    if (!productForm)
      return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (!addButton)
      return;
    if (disable) {
      addButton.setAttribute("disabled", "disabled");
      if (text)
        addButtonText.textContent = text;
    } else {
      addButton.removeAttribute("disabled");
      addButtonText.textContent = window.themeVariables.strings.addToCart;
    }
    if (!modifyClass)
      return;
  }
  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.section}`);
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    if (!addButton)
      return;
    addButtonText.textContent = window.variantStrings.unavailable;
    if (price)
      price.classList.add("sr-only");
  }
  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
};
window.customElements.define("variant-selects", VariantSelects);
var VariantRadios = class extends VariantSelects {
  constructor() {
    super();
  }
  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find((radio) => radio.checked).value;
    });
  }
};
window.customElements.define("variant-radios", VariantRadios);

// _src/scripts/essential/product/product-form.js
var ProductForm = class extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector("form");
    this.form.querySelector("[name=id]").disabled = false;
    this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
    this.cart = document.querySelector("cart-notification") || document.querySelector("cart-drawer");
    this.submitButton = this.querySelector('[type="submit"]');
    if (document.querySelector("cart-drawer"))
      this.submitButton.setAttribute("aria-haspopup", "dialog");
  }
  onSubmitHandler(evt) {
    evt.preventDefault();
    if (this.submitButton.getAttribute("aria-disabled") === "true")
      return;
    this.submitButton.setAttribute("aria-disabled", true);
    this.submitButton.classList.add("is-loading");
    this.querySelector(".loader-spinner").classList.remove("hidden");
    const config = fetchConfig2("javascript");
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    delete config.headers["Content-Type"];
    const formData = new FormData(this.form);
    if (this.cart) {
      formData.append("sections", this.cart.getSectionsToRender().map((section) => section.id));
      formData.append("sections_url", window.location.pathname);
      this.cart.setActiveElement(document.activeElement);
    }
    config.body = formData;
    console.log("this.cart.getSectionsToRender().map((section) => section.id)", this.cart.getSectionsToRender().map((section) => section.id));
    fetch(`${themeVariables.routes.cart_add_url}`, config).then((response) => response.json()).then((response) => {
      console.log("response", response);
      if (response.status) {
        this.handleErrorMessage(response.description);
        const soldOutMessage = this.submitButton.querySelector(".sold-out-message");
        if (!soldOutMessage)
          return;
        this.submitButton.setAttribute("aria-disabled", true);
        this.submitButton.querySelector("span").classList.add("hidden");
        soldOutMessage.classList.remove("hidden");
        this.error = true;
        return;
      } else if (!this.cart) {
        window.location = window.themeVariables.routes.cart_url;
        return;
      }
      this.error = false;
      const quickAddModal = this.closest("quick-add-modal");
      if (quickAddModal) {
      } else {
        this.cart.renderContents(response);
        console.log("this,cart res", response);
      }
    }).catch((e2) => console.error("ProductForm E", e2)).finally((e2) => {
      this.submitButton.classList.remove("is-loading");
      if (this.cart && this.cart.classList.contains("is-empty"))
        this.cart.classList.remove("is-empty");
      if (!this.error)
        this.submitButton.removeAttribute("aria-disabled");
      this.querySelector(".loader-spinner").classList.add("hidden");
    });
  }
  handleErrorMessage(errorMessage = false) {
    this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector(".product-form__error-message-wrapper");
    if (!this.errorMessageWrapper)
      return;
    this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector(".product-form__error-message");
    this.errorMessageWrapper.classList.toggle("hidden", !errorMessage);
    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }
};
window.customElements.define("product-form", ProductForm);

// _src/scripts/essential/product/quantity-input.js
var QuantityInput = class extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector("input");
    this.changeEvent = new Event("change", { bubbles: true });
    this.querySelectorAll("button").forEach(
      (button) => button.addEventListener("click", this.onButtonClick.bind(this))
    );
  }
  onButtonClick(event2) {
    event2.preventDefault();
    const previousValue = this.input.value;
    event2.target.name === "plus" ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent);
  }
};
window.customElements.define("quantity-input", QuantityInput);

// _src/scripts/essential/product/product-gallery-slider.js
var ProductGallerySlider = class extends BaseSwiper {
  constructor() {
    super();
    this.swiperEl = this.querySelector("#ProductGallerySlider-Main");
    this.thumbsEl = this.querySelector("#ProductGallerySlider-Thumbs");
    this.getConfig = JSON.parse(this.getAttribute("slider-config"));
    this.getThumbsConfig = JSON.parse(this.getAttribute("thumbs-config"));
    this.zoomGallery = document.querySelector("pdp-zoom-gallery");
    this.config = {
      modules: [Navigation, Pagination, A11y, Scrollbar, Thumb, Keyboard],
      ...this.getConfig,
      thumbs: {
        swiper: this.thumbsEl
      },
      navigation: {
        nextEl: "[swiper-button-next]",
        prevEl: "[swiper-button-prev]"
      },
      pagination: {
        el: "[swiper-pagination]",
        type: "fraction"
      },
      keyboard: {
        enabled: true
      },
      loop: true,
      on: {
        // click: function() {
        //           //
        //  this.zoomGallery.dataset.realIndex = this.swiper.realIndex;
        // }.bind(this),
        slideChange: function() {
          this.activeSlide = this.swiper.slides[this.swiper.activeIndex];
          this.swiper.slides.forEach((slide2) => {
            slide2.removeAttribute("is-active");
            if (slide2.querySelector("lazy-slide-video")) {
              slide2.querySelector("lazy-slide-video").removeAttribute("is-active");
            }
          });
          this.activeSlide.setAttribute("is-active", "");
          if (this.activeSlide.querySelector("lazy-slide-video")) {
            this.activeSlide.querySelector("lazy-slide-video").setAttribute("is-active", "");
          }
        }.bind(this)
      }
    };
    this.thumbsConfig = {
      ...this.getThumbsConfig
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.handleVariantChange();
    this.handleZoom();
  }
  disconnectedCallback() {
    this.swiper.destroy();
    this.thumbs.destroy();
  }
  init() {
    this.swiper = new Swiper(this.swiperEl, this.config);
    this.thumbs = new Swiper(this.thumbsEl, this.thumbsConfig);
  }
  handleVariantChange() {
    document.addEventListener("color-variant:changed", (evt) => {
      if (!evt.detail.featured_media)
        return;
      console.log(
        "PRODUCT GALLERY SLIDER MEDIA.id",
        evt.detail.featured_media.id
      );
      const currentSlideEl = this.swiper.el.querySelector(
        `[media-id="${evt.detail.featured_media.id}"]`
      );
      const currentSlideIdx = parseInt(
        currentSlideEl.getAttribute("media-index")
      );
      this.swiper.slideTo(currentSlideIdx);
    });
  }
  handleZoom() {
    this.swiper.slides.forEach((slide2, index) => {
      if (slide2.querySelector("img"))
        slide2.querySelector("img").addEventListener(
          "click",
          () => this.zoomGallery.dataset.realIndex = this.swiper.realIndex
        );
      if (slide2.querySelector("video"))
        slide2.querySelector("video").addEventListener(
          "click",
          () => this.zoomGallery.dataset.realIndex = this.swiper.realIndex
        );
    });
  }
};
window.customElements.define("product-gallery-slider", ProductGallerySlider);

// _src/scripts/essential/product/pdp-zoom-gallery.js
var PdpZoomGallery = class extends BaseSwiper {
  constructor() {
    super();
    this.trigger = document.querySelector("[pdp-zoom-gallery-trigger]");
    this.IS_ZOOMED = false;
    this.INDEX = this.getAttribute("data-real-index");
    this.closeBtn = this.querySelector("[close-button]");
    this.getConfig = JSON.parse(this.getAttribute("slider-config"));
    this.config = {
      modules: [Navigation, Pagination, A11y, Scrollbar, Zoom, Keyboard],
      ...this.getConfig,
      // initialSlide: this.ACTIVE_INDEX,
      scrollbar: {
        el: ".swiper-scrollbar",
        hide: false
      },
      zoom: true,
      navigation: {
        nextEl: "[swiper-button-next]",
        prevEl: "[swiper-button-prev]"
      },
      pagination: {
        el: "[swiper-pagination]",
        type: "fraction"
      },
      keyboard: {
        enabled: false
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "Previous slide",
        nextSlideMessage: "Next slide",
        firstSlideMessage: "This is the first slide",
        lastSlideMessage: "This is the last slide",
        paginationBulletMessage: "Go to slide {{index}}"
      },
      on: {
        click: function() {
          if (!this.IS_ZOOMED) {
            this.zoom.in();
            this.IS_ZOOMED = true;
          } else {
            this.zoom.out();
            this.IS_ZOOMED = false;
          }
        }
      }
    };
    console.log("this.closeBtn", this.closeBtn);
    this.firstFocusableElement = this;
    this.lastFocusableElement = this;
  }
  connectedCallback() {
    this.IS_ZOOMED = false;
    this.init();
    this.closeBtn.addEventListener("click", () => {
      this.close.bind(this)();
    });
  }
  disconnectedCallback() {
    if (this.swiper)
      this.swiper.destroy();
  }
  show() {
    console.log("Show()", this);
    this.classList.add("is-active");
    document.body.classList.add("overflow-hidden");
    this.swiper.keyboard.enable();
    this.swiper.on("keyPress", (swiper, eventKey) => {
      switch (eventKey) {
        case 27:
          console.log("KEYPRESS ESC");
          this.close();
      }
    });
  }
  // onKeyUpEscape() {
  //   this.addEventListener("keyup", (evt) => {
  //     console.log("KEYUP");
  //     if (evt.code.toUpperCase() !== "ESCAPE") return;
  //     console.log("ESC");
  //     this.close();
  //   });
  // }
  close() {
    trapFocus2(document.querySelector("product-gallery-slider"));
    this.IS_ZOOMED = false;
    this.swiper.zoom.out();
    this.swiper.keyboard.disable();
    this.classList.remove("is-active");
    document.body.classList.remove("overflow-hidden");
    console.log("ZOOM SWIPER CLOSE()", this.swiper);
  }
  init() {
    super.init();
    console.log("ZOOM Slider INIT()", this.swiper);
    this.activeSlide = this.swiper.slides[this.swiper.activeIndex];
    console.log("====> ACTIVE SLIDE", this.activeSlide);
    this.activeSlide.setAttribute("is-active", "");
    if (this.activeSlide.querySelector("lazy-slide-video")) {
      this.activeSlide.querySelector("lazy-slide-video").setAttribute("is-active", "");
    }
    this.onSlideChange();
  }
  onSlideChange() {
    this.swiper.on("slideChange", () => {
      console.log("slidechanged", this.swiper);
      this.activeSlide = this.swiper.slides[this.swiper.activeIndex];
      console.log(" ====> SLIDE CHANGED ACTIVE SLIDE", this.activeSlide);
      this.swiper.slides.forEach((slide2) => {
        slide2.removeAttribute("is-active");
        if (slide2.querySelector("lazy-slide-video")) {
          slide2.querySelector("lazy-slide-video").removeAttribute("is-active");
        }
      });
      this.activeSlide.setAttribute("is-active", "");
      if (this.activeSlide.querySelector("lazy-slide-video")) {
        this.activeSlide.querySelector("lazy-slide-video").setAttribute("is-active", "");
      }
    });
  }
  static get observedAttributes() {
    return ["data-real-index"];
  }
  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "data-real-index") {
      console.log("CHANGED", newVal);
      this.INDEX = newVal;
      this.swiper.activeIndex = this.INDEX;
      this.swiper.update();
      console.log("attributeChangedCallback", this.swiper);
      this.show();
    }
  }
};
window.customElements.define("pdp-zoom-gallery", PdpZoomGallery);

// _src/scripts/essential/product/card-product.js
var CardProduct = class extends HTMLElement {
  constructor() {
    super();
    this.productMediaArr = this.getAttribute("product-media").split(", ");
  }
  connectedCallback() {
    const fieldset = this.querySelector("fieldset");
    if (!fieldset)
      return;
    this.addEventListener("change", this.onVariantChange);
  }
  switchImage() {
    const fieldset = this.querySelector("fieldset");
    if (!fieldset)
      return;
    this.secondaryImagePosition = this.currentVariant.featured_image.position;
    const featuredImage = this.querySelector("#CardProduct-Image1").querySelector("img");
    const secondaryImage = this.querySelector("#CardProduct-Image2").querySelector("img");
    featuredImage.src = `${this.currentVariant.featured_image.src}&width=600`;
    featuredImage.srcset = `${this.currentVariant.featured_image.src}&width=600 320w, ${this.currentVariant.featured_image.src}&width=600 768w, ${this.currentVariant.featured_image.src}&width=600 1280w`;
    if (!secondaryImage)
      return;
    secondaryImage.src = `${this.getSecondaryImage()}&width=600`;
    secondaryImage.srcset = `${this.getSecondaryImage()}&width=600 320w, ${this.getSecondaryImage()}&width=600 768w, ${this.getSecondaryImage()}&width=600 1280w`;
  }
  getSecondaryImage() {
    return this.productMediaArr[this.secondaryImagePosition];
  }
  onVariantChange() {
    console.log("card product change");
    this.updateOptions();
    this.getCurrentVariant();
    this.updateURL();
    this.updateCardID();
    this.updateFavoritesButtonID();
    this.switchImage();
  }
  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find((radio) => radio.checked).value;
    });
    console.log("this.options", this.options);
  }
  getCurrentVariant() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        console.log("getCurrentVariant this.options", this.options[index]);
        return this.options[index] === option;
      }).includes(false);
    });
    console.log("CRAD this.currentVariant", this.currentVariant);
  }
  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    console.log("this.variantData card-product", this.variantData);
    return this.variantData;
  }
  updateURL() {
    if (!this.currentVariant)
      return;
    const links = this.querySelectorAll("a");
    links.forEach((link) => {
      link.href = `${this.dataset.url}?variant=${this.currentVariant.id}`;
    });
  }
  updateCardID() {
    if (!this.currentVariant)
      return;
    this.setAttribute("variant-id", this.currentVariant.id);
  }
  updateFavoritesButtonID() {
    const favoriteButton = this.querySelector("add-to-favorites");
    favoriteButton.setAttribute("variant-id", this.currentVariant.id);
    favoriteButton.setAttribute("variant-color", this.currentVariant.title);
  }
};
window.customElements.define("card-product", CardProduct);

// _src/scripts/essential/product/product-recommendations.js
var ProductRecommendations = class extends BaseSwiper {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
  }
  handleObserver(entries, observer) {
    if (!entries[0].isIntersecting)
      return;
    observer.unobserve(this);
    fetch(this.dataset.url).then((response) => response.text()).then((text) => {
      const html = document.createElement("div");
      html.innerHTML = text;
      const recommendations = html.querySelector("product-recommendations");
      if (recommendations && recommendations.innerHTML.trim().length) {
        this.innerHTML = recommendations.innerHTML;
        this.swiperEl = this.querySelector(".swiper");
        this.getConfig = JSON.parse(this.getAttribute("slider-config"));
        this.config = {
          modules: [Navigation, Pagination, A11y],
          a11y: {
            enabled: true,
            prevSlideMessage: "Previous slide",
            nextSlideMessage: "Next slide",
            firstSlideMessage: "This is the first slide",
            lastSlideMessage: "This is the last slide",
            paginationBulletMessage: "Go to slide {{index}}"
          },
          navigation: {
            nextEl: this.querySelector("[swiper-button-next]"),
            prevEl: this.querySelector("[swiper-button-prev]")
          },
          pagination: {
            el: this.querySelector("[swiper-pagination]"),
            type: "fraction"
          },
          ...this.getConfig
        };
        console.log("HELLO ------ SIPWER EL", this.swiper);
        this.init();
      }
    }).catch((e2) => {
      console.error(e2);
    });
  }
  observer() {
    super.observer();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  init() {
    super.init();
    console.log("PRODUCTREC SWIPER", this.swiper);
  }
};
customElements.define("product-recommendations", ProductRecommendations);

// _src/scripts/essential/collection/facet-filters-form.js
var FacetFiltersForm = class _FacetFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);
    this.debouncedOnSubmit = debounce((event2) => {
      this.onSubmitHandler(event2);
    }, 500);
    const facetForm = this.querySelector("form");
    console.log("facetform", facetForm);
    facetForm.addEventListener("input", this.debouncedOnSubmit.bind(this));
    const facetWrapper = this.querySelector("#FacetsWrapperDesktop");
    if (facetWrapper)
      facetWrapper.addEventListener("keyup", onKeyUpEscape2);
  }
  static setListeners() {
    const onHistoryChange = (event2) => {
      const searchParams = event2.state ? event2.state.searchParams : _FacetFiltersForm.searchParamsInitial;
      if (searchParams === _FacetFiltersForm.searchParamsPrev)
        return;
      _FacetFiltersForm.renderPage(searchParams, null, false);
    };
    window.addEventListener("popstate", onHistoryChange);
  }
  static toggleActiveFacets(disable = true) {
    document.querySelectorAll(".js-facet-remove").forEach((element) => {
      element.classList.toggle("disabled", disable);
    });
  }
  static renderPage(searchParams, event2, updateURLHash = true) {
    _FacetFiltersForm.searchParamsPrev = searchParams;
    const sections = _FacetFiltersForm.getSections();
    const countContainer = document.getElementById("ProductCount");
    const countContainerDesktop = document.getElementById("ProductCountDesktop");
    document.getElementById("ProductGridContainer").querySelector(".collection").classList.add("loading");
    if (countContainer) {
      countContainer.classList.add("loading");
    }
    if (countContainerDesktop) {
      countContainerDesktop.classList.add("loading");
    }
    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = (element) => element.url === url;
      _FacetFiltersForm.filterData.some(filterDataUrl) ? _FacetFiltersForm.renderSectionFromCache(filterDataUrl, event2) : _FacetFiltersForm.renderSectionFromFetch(url, event2);
    });
    if (updateURLHash)
      _FacetFiltersForm.updateURLHash(searchParams);
  }
  static renderSectionFromFetch(url, event2) {
    fetch(url).then((response) => response.text()).then((responseText) => {
      const html = responseText;
      _FacetFiltersForm.filterData = [..._FacetFiltersForm.filterData, { html, url }];
      _FacetFiltersForm.renderFilters(html, event2);
      _FacetFiltersForm.renderProductGridContainer(html);
      _FacetFiltersForm.renderProductCount(html);
    });
  }
  static renderSectionFromCache(filterDataUrl, event2) {
    const html = _FacetFiltersForm.filterData.find(filterDataUrl).html;
    _FacetFiltersForm.renderFilters(html, event2);
    _FacetFiltersForm.renderProductGridContainer(html);
    _FacetFiltersForm.renderProductCount(html);
  }
  static renderProductGridContainer(html) {
    document.getElementById("ProductGridContainer").innerHTML = new DOMParser().parseFromString(html, "text/html").getElementById("ProductGridContainer").innerHTML;
  }
  static renderProductCount(html) {
    const count = new DOMParser().parseFromString(html, "text/html").getElementById("ProductCount").innerHTML;
    const container = document.getElementById("ProductCount");
    const containerDesktop = document.getElementById("ProductCountDesktop");
    container.innerHTML = count;
    container.classList.remove("loading");
    if (containerDesktop) {
      containerDesktop.innerHTML = count;
      containerDesktop.classList.remove("loading");
    }
  }
  static renderFilters(html, event2) {
    const parsedHTML = new DOMParser().parseFromString(html, "text/html");
    const facetDetailsElements = parsedHTML.querySelectorAll("#FacetFiltersForm .js-filter, #FacetFiltersFormMobile .js-filter, #FacetFiltersPillsForm .js-filter");
    const matchesIndex = (element) => {
      const jsFilter = event2 ? event2.target.closest(".js-filter") : void 0;
      return jsFilter ? element.dataset.index === jsFilter.dataset.index : false;
    };
    const facetsToRender = Array.from(facetDetailsElements).filter((element) => !matchesIndex(element));
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);
    facetsToRender.forEach((element) => {
      document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
    });
    _FacetFiltersForm.renderActiveFacets(parsedHTML);
    _FacetFiltersForm.renderAdditionalElements(parsedHTML);
    if (countsToRender)
      _FacetFiltersForm.renderCounts(countsToRender, event2.target.closest(".js-filter"));
  }
  static renderActiveFacets(html) {
    const activeFacetElementSelectors = [".active-facets-mobile", ".active-facets-desktop"];
    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement)
        return;
      document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
    });
    _FacetFiltersForm.toggleActiveFacets(false);
  }
  static renderAdditionalElements(html) {
    const mobileElementSelectors = [".mobile-facets__open", ".mobile-facets__count", ".sorting"];
    mobileElementSelectors.forEach((selector) => {
      if (!html.querySelector(selector))
        return;
      document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
    });
    document.getElementById("FacetFiltersFormMobile").closest("filter-drawer").bindEvents();
  }
  static renderCounts(source, target) {
    const targetElement = target.querySelector(".facets__selected");
    const sourceElement = source.querySelector(".facets__selected");
    const targetElementAccessibility = target.querySelector(".facets__summary");
    const sourceElementAccessibility = source.querySelector(".facets__summary");
    if (sourceElement && targetElement) {
      target.querySelector(".facets__selected").outerHTML = source.querySelector(".facets__selected").outerHTML;
    }
    if (targetElementAccessibility && sourceElementAccessibility) {
      target.querySelector(".facets__summary").outerHTML = source.querySelector(".facets__summary").outerHTML;
    }
  }
  static updateURLHash(searchParams) {
    history.pushState({ searchParams }, "", `${window.location.pathname}${searchParams && "?".concat(searchParams)}`);
  }
  static getSections() {
    return [
      {
        section: document.getElementById("product-grid").dataset.id
      }
    ];
  }
  createSearchParams(form) {
    const formData = new FormData(form);
    return new URLSearchParams(formData).toString();
  }
  onSubmitForm(searchParams, event2) {
    _FacetFiltersForm.renderPage(searchParams, event2);
  }
  onSubmitHandler(event2) {
    event2.preventDefault();
    const sortFilterForms = document.querySelectorAll("facet-filters-form form");
    if (event2.srcElement.className == "mobile-facets__checkbox") {
      const searchParams = this.createSearchParams(event2.target.closest("form"));
      this.onSubmitForm(searchParams, event2);
    } else {
      const forms = [];
      const isMobile = event2.target.closest("form").id === "FacetFiltersFormMobile";
      sortFilterForms.forEach((form) => {
        if (!isMobile) {
          if (form.id === "FacetSortForm" || form.id === "FacetFiltersForm" || form.id === "FacetSortDrawerForm") {
            const noJsElements = document.querySelectorAll(".no-js-list");
            noJsElements.forEach((el) => el.remove());
            forms.push(this.createSearchParams(form));
          }
        } else if (form.id === "FacetFiltersFormMobile") {
          forms.push(this.createSearchParams(form));
        }
      });
      this.onSubmitForm(forms.join("&"), event2);
    }
  }
  onActiveFilterClick(event2) {
    event2.preventDefault();
    _FacetFiltersForm.toggleActiveFacets();
    const url = event2.currentTarget.href.indexOf("?") == -1 ? "" : event2.currentTarget.href.slice(event2.currentTarget.href.indexOf("?") + 1);
    _FacetFiltersForm.renderPage(url);
  }
};
FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define("facet-filters-form", FacetFiltersForm);
FacetFiltersForm.setListeners();

// _src/scripts/essential/collection/price-range.js
var PriceRange = class extends HTMLElement {
  constructor() {
    super();
    const rangeSliderFrom = this.querySelector(".range-group-slider input:first-child");
    const rangeSliderTo = this.querySelector(".range-group-slider input:last-child");
    const inputFrom = this.querySelector(".range-group-input .range-input:first-child input");
    const inputTo = this.querySelector(".range-group-input .range-input:last-child input");
    inputFrom.addEventListener("input", (event2) => {
      console.log("event", event2.target.value);
      event2.target.value = Math.max(Math.min(parseInt(event2.target.value), parseInt(inputTo.value || event2.target.max) - 1), event2.target.min);
      rangeSliderFrom.value = event2.target.value;
      rangeSliderFrom.parentElement.style.setProperty("--range-min", `${parseInt(rangeSliderFrom.value) / parseInt(rangeSliderFrom.max) * 100}%`);
    });
    inputTo.addEventListener("input", (event2) => {
      event2.target.value = Math.min(Math.max(parseInt(event2.target.value), parseInt(inputFrom.value || event2.target.min) + 1), event2.target.max);
      rangeSliderTo.value = event2.target.value;
      rangeSliderTo.parentElement.style.setProperty("--range-max", `${parseInt(rangeSliderTo.value) / parseInt(rangeSliderTo.max) * 100}%`);
    });
    rangeSliderFrom.addEventListener("change", (event2) => {
      inputFrom.value = event2.target.value;
    });
    rangeSliderTo.addEventListener("change", (event2) => {
      inputTo.value = event2.target.value;
    });
    rangeSliderFrom.addEventListener("input", (event2) => {
      event2.target.value = Math.min(parseInt(event2.target.value), parseInt(inputTo.value || event2.target.max) - 1);
      inputFrom.value = event2.target.value;
      event2.target.parentElement.style.setProperty("--range-min", `${parseInt(event2.target.value) / parseInt(event2.target.max) * 100}%`);
    });
    rangeSliderTo.addEventListener("input", (event2) => {
      event2.target.value = Math.max(parseInt(event2.target.value), parseInt(inputFrom.value || event2.target.min) + 1);
      inputTo.value = event2.target.value;
      event2.target.parentElement.style.setProperty("--range-max", `${parseInt(event2.target.value) / parseInt(event2.target.max) * 100}%`);
    });
  }
};
window.customElements.define("price-range", PriceRange);

// _src/scripts/essential/collection/facet-remove.js
var FacetRemove = class extends HTMLElement {
  constructor() {
    super();
    const facetLink = this.querySelector("a");
    facetLink.setAttribute("role", "button");
    facetLink.addEventListener("click", this.closeFilter.bind(this));
    facetLink.addEventListener("keyup", (event2) => {
      event2.preventDefault();
      if (event2.code.toUpperCase() === "SPACE")
        this.closeFilter(event2);
    });
  }
  closeFilter(event2) {
    event2.preventDefault();
    const form = this.closest("facet-filters-form") || document.querySelector("facet-filters-form");
    form.onActiveFilterClick(event2);
  }
};
customElements.define("facet-remove", FacetRemove);

// _src/scripts/essential/cart/cart-remove.js
var CartRemove = class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", (event2) => {
      event2.preventDefault();
      const cartItems = this.closest("cart-items") || this.closest("cart-drawer-items");
      cartItems.updateQuantity(this.dataset.index, 0);
      console.log("cartItems", cartItems);
      console.log("this.dataset.index, 0", this.dataset.index, 0);
    });
  }
};
window.customElements.define("cart-remove", CartRemove);

// _src/scripts/essential/cart/cart-items.js
var CartItems = class extends HTMLElement {
  constructor() {
    super();
    this.lineItemStatusElement = document.getElementById("shopping-cart-line-item-status") || document.getElementById("CartDrawer-LineItemStatus");
    this.currentItemCount = Array.from(
      this.querySelectorAll('[name="updates[]"]')
    ).reduce(
      (total, quantityInput) => total + parseInt(quantityInput.value),
      0
    );
    this.debouncedOnChange = debounce((event2) => {
      this.onChange(event2);
    }, 300);
    this.addEventListener("change", this.debouncedOnChange.bind(this));
  }
  onChange(event2) {
    this.updateQuantity(event2.target.dataset.index, event2.target.value, document.activeElement.getAttribute("name"));
  }
  getSectionsToRender() {
    return [
      {
        id: "main-cart-items",
        section: document.getElementById("main-cart-items").dataset.id,
        selector: ".js-contents"
      },
      // {
      //   id: 'main-cart-summary',
      //   section: document.getElementById('main-cart-summary').dataset.id,
      //   selector: '.js-cart-summary'
      // },
      // {
      //   id: 'cart-drawer',
      //   selector: '#CartDrawer'
      // },
      {
        id: "cart-icon-bubble",
        section: "cart-icon-bubble",
        selector: ".shopify-section"
      },
      {
        id: "cart-live-region-text",
        section: "cart-live-region-text",
        selector: ".shopify-section"
      }
      // {
      //   id: 'main-cart-summary',
      //   section: `main-cart-summary-${document.getElementById('main-cart-items').dataset.id}`,
      //   // section: 'cart-summary',
      //   selector: '.js-cart-summary'
      // },
    ];
  }
  updateQuantity(line, quantity, name) {
    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    });
    fetch(`${themeVariables.routes.cart_change_url}`, { ...fetchConfig2(), ...{ body } }).then((response) => {
      return response.text();
    }).then((state) => {
      const parsedState = JSON.parse(state);
      console.log("parsedState", parsedState);
      this.classList.toggle("is-empty", parsedState.item_count === 0);
      const cartSummary = document.getElementById("main-cart-summary");
      console.log("cartSummary", cartSummary);
      if (cartSummary)
        cartSummary.classList.toggle("is-empty", parsedState.item_count === 0);
      const cartLayout = document.getElementById("main-cart-layout");
      if (cartLayout)
        cartLayout.classList.toggle("is-empty", parsedState.item_count === 0);
      this.getSectionsToRender().forEach((section) => {
        console.log("section", section);
        const elementToReplace = document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
        console.log("elementToReplace", elementToReplace);
        elementToReplace.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);
      });
      this.updateLiveRegions(line, parsedState.item_count);
      const lineItem = document.getElementById(`CartItem-${line}`) || document.getElementById(`CartDrawer-Item-${line}`);
    }).catch((e2) => {
      console.log("cartItems error", e2);
      const errors = document.getElementById("cart-errors") || document.getElementById("CartDrawer-CartErrors");
      errors.textContent = window.themeVariables.cartStrings.error;
    });
  }
  updateLiveRegions(line, itemCount) {
    if (this.currentItemCount === itemCount) {
      const lineItemError = document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
      const quantityElement = document.getElementById(`Quantity-${line}`) || document.getElementById(`Drawer-quantity-${line}`);
      lineItemError.classList.remove("hidden");
      console.log("lineitem error", lineItemError);
      lineItemError.querySelector(".cart-item__error-text").innerHTML = window.themeVariables.cartStrings.quantityError.replace(
        "[quantity]",
        quantityElement.value
      );
    }
    this.currentItemCount = itemCount;
    this.lineItemStatusElement.setAttribute("aria-hidden", true);
    const cartStatus = document.getElementById("cart-live-region-text") || document.getElementById("CartDrawer-LiveRegionText");
    cartStatus.setAttribute("aria-hidden", false);
    setTimeout(() => {
      cartStatus.setAttribute("aria-hidden", true);
    }, 1e3);
  }
  getSectionInnerHTML(html, selector) {
    return new DOMParser().parseFromString(html, "text/html").querySelector(selector).innerHTML;
  }
};
window.customElements.define("cart-items", CartItems);
var CartDrawerItems = class extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: "CartDrawer",
        section: "cart-drawer",
        selector: ".cart-drawer__main"
      },
      {
        id: "cart-icon-bubble",
        section: "cart-icon-bubble",
        selector: ".shopify-section"
      }
      // {
      //   id: "cart-live-region-text",
      //   section: "cart-live-region-text",
      //   selector: ".shopify-section",
      // },
    ];
  }
};
customElements.define("cart-drawer-items", CartDrawerItems);

// _src/scripts/essential/cart/cart-note.js
var CartNote = class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", debounce((event2) => {
      const body = JSON.stringify({ note: event2.target.value });
      console.log("carnote", body);
      fetch(`${themeVariables.routes.cart_update_url}`, { ...fetchConfig(), ...{ body } });
    }, 300));
  }
};
window.customElements.define("cart-note", CartNote);

// _src/scripts/essential/cart/cart-drawer.js
var CartDrawer = class extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("keyup", (evt) => evt.code === "Escape" && this.close());
    this.querySelector("#CartDrawer-Overlay").addEventListener("click", this.close.bind(this));
    this.querySelector(".drawer__close").addEventListener("click", this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }
  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector("#cart-icon-bubble");
    cartLink.setAttribute("role", "button");
    cartLink.setAttribute("aria-haspopup", "dialog");
    cartLink.addEventListener("click", (event2) => {
      event2.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener("keydown", (event2) => {
      if (event2.code.toUpperCase() === "SPACE") {
        event2.preventDefault();
        this.open(cartLink);
      }
    });
  }
  open(triggeredBy) {
    if (triggeredBy)
      this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute("role"))
      this.setSummaryAccessibility(cartDrawerNote);
    setTimeout(() => {
      this.classList.add("animate", "active");
    });
    this.addEventListener("transitionend", () => {
      const containerToTrapFocusOn = this.classList.contains("is-empty") ? this.querySelector(".drawer__inner-empty") : document.getElementById("CartDrawer");
      const focusElement = this.querySelector(".drawer__inner") || this.querySelector(".drawer__close");
      trapFocus2(containerToTrapFocusOn, focusElement);
    }, { once: true });
    document.body.classList.add("overflow-hidden");
  }
  close() {
    this.classList.remove("active");
    removeTrapFocus2(this.activeElement);
    document.body.classList.remove("overflow-hidden");
  }
  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute("role", "button");
    cartDrawerNote.setAttribute("aria-expanded", "false");
    if (cartDrawerNote.nextElementSibling.getAttribute("id")) {
      cartDrawerNote.setAttribute("aria-controls", cartDrawerNote.nextElementSibling.id);
    }
    cartDrawerNote.addEventListener("click", (event2) => {
      event2.currentTarget.setAttribute("aria-expanded", !event2.currentTarget.closest("details").hasAttribute("open"));
    });
    cartDrawerNote.parentElement.addEventListener("keyup", onKeyUpEscape);
  }
  renderContents(parsedState) {
    this.querySelector(".cart-drawer__main").classList.contains("is-empty") && this.querySelector(".cart-drawer__main").classList.remove("is-empty");
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector ? document.querySelector(section.selector) : document.getElementById(section.id);
      sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    });
    setTimeout(() => {
      this.querySelector("#CartDrawer-Overlay").addEventListener("click", this.close.bind(this));
      this.open();
    });
  }
  getSectionInnerHTML(html, selector = ".shopify-section") {
    return new DOMParser().parseFromString(html, "text/html").querySelector(selector).innerHTML;
  }
  getSectionsToRender() {
    return [
      {
        id: "cart-drawer",
        selector: "#CartDrawer"
      },
      {
        id: "cart-icon-bubble"
      }
    ];
  }
  getSectionDOM(html, selector = ".shopify-section") {
    return new DOMParser().parseFromString(html, "text/html").querySelector(selector);
  }
  setActiveElement(element) {
    this.activeElement = element;
  }
};
window.customElements.define("cart-drawer", CartDrawer);

// _src/scripts/essential/cart/cart-notification.js
var CartNotification = class extends HTMLElement {
  constructor() {
    super();
    this.notification = document.getElementById("cart-notification");
    this.header = document.querySelector("store-header");
    this.onBodyClick = this.handleBodyClick.bind(this);
    this.notification.addEventListener("keyup", (evt) => evt.code === "Escape" && this.close());
    this.querySelectorAll('button[type="button"]').forEach(
      (closeButton) => closeButton.addEventListener("click", this.close.bind(this))
    );
    this.addEventListener("mouseenter", this.stopTimer.bind(this));
    this.addEventListener("mouseleave", this.startTimer.bind(this));
  }
  startTimer() {
    console.log("startTimer");
    this.timeout = setTimeout(() => {
      this.close();
    }, 3e3);
  }
  stopTimer() {
    console.log("stopTimer");
    clearTimeout(this.timeout);
  }
  open() {
    console.log("open");
    this.notification.classList.add("animate", "is-active");
    this.notification.addEventListener("transitionend", () => {
      this.notification.focus();
    }, { once: true });
    document.body.addEventListener("click", this.onBodyClick);
    this.startTimer();
  }
  close() {
    this.notification.classList.remove("is-active");
    document.body.removeEventListener("click", this.onBodyClick);
  }
  renderContents(parsedState) {
    console.log("notification parsedState", parsedState.key);
    this.cartItemKey = parsedState.key;
    this.getSectionsToRender().forEach((section) => {
      console.log("section", section);
      document.getElementById(section.id).innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    });
    this.open();
  }
  getSectionsToRender() {
    return [
      {
        id: "cart-notification-product",
        selector: `[id="cart-notification-product-${this.cartItemKey}"]`
      },
      // {
      //   id: 'cart-notification-button'
      // },
      {
        id: "cart-icon-bubble"
      }
    ];
  }
  getSectionInnerHTML(html, selector = ".shopify-section") {
    return new DOMParser().parseFromString(html, "text/html").querySelector(selector).innerHTML;
  }
  handleBodyClick(evt) {
    const target = evt.target;
    if (target !== this.notification && !target.closest("cart-notification")) {
      const disclosure = target.closest("details-disclosure, header-menu");
      this.activeElement = disclosure ? disclosure.querySelector("summary") : null;
      this.close();
    }
  }
  setActiveElement(element) {
    this.activeElement = element;
  }
};
window.customElements.define("cart-notification", CartNotification);

// _src/scripts/essential/accounts/main-login.js
var MainLogin = class extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.recoveryTrigger = this.querySelector("#recovery-trigger");
    this.loginTrigger = this.querySelector("#login-trigger");
    this.loginForm = this.querySelector("#main-login");
    this.recoveryForm = this.querySelector("#main-login-recovery");
    this.recoverySuccess = this.getAttribute("recovery-success");
    console.log("this.recoverySuccess", this.recoverySuccess);
    this.recoveryTrigger.addEventListener("click", () => {
      this.switchForm();
    });
    this.loginTrigger.addEventListener("click", () => {
      this.switchForm();
    });
  }
  switchForm() {
    console.log("toggle");
    if (this.recoverySuccess === "true") {
      this.loginForm.classList.toggle("hidden");
      this.recoveryForm.classList.toggle("hidden");
      alert("hi");
    } else {
      this.loginForm.classList.toggle("hidden");
      this.recoveryForm.classList.toggle("hidden");
      alert("bye");
    }
  }
};
window.customElements.define("main-login", MainLogin);

// _src/scripts/essential/accounts/add-address-drawer.js
var AddAddressDrawer = class extends HTMLElement {
  constructor() {
    super();
    this.detailsContainer = this.querySelector("details");
    this.summaryToggle = this.querySelector("summary");
    this.closeButton = this.querySelector('button[type="button"]');
    this.modalOverlay = this.querySelector(".modal-overlay");
    this.drawerContent = this.querySelector("#drawer-content");
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.detailsContainer.addEventListener(
      "keyup",
      (event2) => event2.code.toUpperCase() === "ESCAPE" && this.close()
    );
    this.summaryToggle.addEventListener(
      "click",
      this.onSummaryClick.bind(this)
    );
    this.closeButton.addEventListener("click", this.close.bind(this));
    this.modalOverlay.addEventListener("click", this.close.bind(this));
    this.summaryToggle.setAttribute("role", "button");
  }
  onSummaryClick(event2) {
    event2.preventDefault();
    event2.target.closest("details").hasAttribute("open") ? this.close() : this.open(event2);
  }
  onBodyClick(event2) {
    if (!this.contains(event2.target) || event2.target.classList.contains("modal-overlay"))
      this.close(false);
  }
  open(event2) {
    this.onBodyClick = this.onBodyClickEvent || this.onBodyClick.bind(this);
    event2.target.closest("details").setAttribute("open", "");
    document.body.addEventListener("click", this.onBodyClickEvent);
    document.body.classList.add("overflow-hidden");
    window.requestAnimationFrame(() => this.openAnimation());
  }
  openAnimation() {
    this.isExpanding = true;
    if (this.animation)
      this.animation.cancel();
    this.animation = this.drawerContent.animate({
      transform: ["translateX(-100%)", "translateX(0)"]
    }, {
      duration: 300,
      easing: "ease-in-out"
    });
    this.animation.oncancel = () => this.isExpanding = false;
  }
  close(focusToggle = true) {
    window.requestAnimationFrame(() => this.closeAnimation());
  }
  closeAnimation() {
    this.isClosing = true;
    this.animation = this.drawerContent.animate({
      transform: ["translateX(0)", "translateX(-100%)"]
    }, {
      duration: 300,
      easing: "ease-out"
    });
    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => this.isClosing = false;
  }
  onAnimationFinish(open) {
    this.detailsContainer.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    if (!open) {
      document.body.removeEventListener("click", this.onBodyClickEvent);
      document.body.classList.remove("overflow-hidden");
    }
  }
};
window.customElements.define("add-address", AddAddressDrawer);
