import { debounce } from "../base/global";

class UserManualsSection extends HTMLElement {
  constructor() {
    super();
    this.mainProductList = this.querySelector("div[product-list]");
    this.fieldset = this.querySelector("fieldset[button-group]");
    console.log("this.fieldset", this.fieldset);

    //search 
    this.cachedResults = {}
    this.searchInput = this.querySelector('input[type="search"]') 
    this.searchForm = this.querySelector('form[search-form]')
  }

  connectedCallback() {
    // For Radio Buttons Select
    this.onChange();

    // For Predictive Search
    this.setupSearchEventlisteners()
  }

  setupSearchEventlisteners() {
    this.searchForm.addEventListener('submit', this.onSearchFormSubmit.bind(this))

    this.searchInput.addEventListener('input', debounce((event) => {
      this.searchOnChange(event);
    }, 300).bind(this));

    this.searchInput.addEventListener('focus', this.searchOnFocus.bind(this));
  }

  getSearchQuery() {
    return this.searchInput.value.trim();
  }

  onSearchFormSubmit(event) {
    if (!this.getSearchQuery().length || this.querySelector('[aria-selected="true"] a')) event.preventDefault();
  }

  searchOnChange() {
    const searchTerm = this.getSearchQuery();

    if (!searchTerm.length) {
      // this.close(true);
      return;
    }

    this.getSearchResults(searchTerm);
  }

  searchOnFocus() {
    const searchTerm = this.getSearchQuery();

    if (!searchTerm.length) return;

    if (this.getAttribute('results') === 'true') {
      // this.open();
    } else {
      this.getSearchResults(searchTerm);
    }
  }


  getSearchResults(searchTerm) {
    const queryKey = searchTerm.replace(" ", "-").toLowerCase();
    this.setLiveRegionLoadingState();
    
    const limit = this.getAttribute('limit')
    if (this.cachedResults[queryKey]) {
      this.renderSearchResults(this.cachedResults[queryKey]);
      return;
    }

    fetch(`${window.themeVariables.routes.predictive_search_url}?q=${encodeURIComponent(searchTerm)}&${encodeURIComponent('resources[type]')}=product&${encodeURIComponent('resources[limit]')}=${limit}&resources[options][fields]=title,product_type,tag&&section_id=manuals-search-results`)
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          // this.close();
          console.log("error", error)
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-manuals-search-results').innerHTML;
        this.cachedResults[queryKey] = resultsMarkup;
        this.renderSearchResults(resultsMarkup);
      })
      .catch((error) => {
        console.log("catch error", error)
        // this.close();
        throw error;
      });
  }

  renderSearchResults(resultsMarkup) {
    this.mainProductList.innerHTML = resultsMarkup;
    this.setAttribute('results', true);

    this.setLiveRegionResults();
    // this.open();
  }

  setLiveRegionResults() {
    this.removeAttribute('loading');
    this.setLiveRegionText(this.querySelector('[data-predictive-search-live-region-count-value]').textContent);
  }

  setLiveRegionLoadingState() {
    this.statusElement = this.statusElement || this.querySelector('.predictive-search-status');
    this.loadingText = this.loadingText || this.getAttribute('data-loading-text');

    this.setLiveRegionText(this.loadingText);
    this.setAttribute('loading', true);
  }

  setLiveRegionText(statusText) {
    this.statusElement.setAttribute('aria-hidden', 'false');
    // this.statusElement.classList.remove('hidden')
    this.statusElement.textContent = statusText;

    setTimeout(() => {
      this.statusElement.setAttribute('aria-hidden', 'true');
      // this.statusElement.classList.add('')
    }, 1000);
  }

  onChange() {
    this.fieldset.addEventListener("change", (evt) => {
      console.log("evt", evt.target.value);
      this.addQueryParamterToURL(evt)
      this.renderSection(evt);
    });
  }

  addQueryParamterToURL(evt) {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('collection', evt.target.value)

    // Update the URL in the browser history
    history.pushState(null, '', currentUrl.toString());
  }

  renderSection(evt) {
    // console.log("HI")
    // const path = `${window.location.pathname}`;
    const path = `/collections/${evt.target.value}`
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
          // console.log("this",this)

          // Get the HTML for the section
          const responseHTML = new DOMParser()
            .parseFromString(request.responseText, "text/html")
            .querySelector(".shopify-section").innerHTML;

          console.log("responseHTML", responseHTML);

          // // Parse the JSON data for the products
          // const productsJSON = request.responseText.match(/"products":\s*(\[.*?\])/s)[1];
          // const productsData = JSON.parse(productsJSON);

          this.mainProductList.innerHTML = responseHTML;
          // this.initSliders();
        }
      }
    };

    request.send(null);
  }
}

window.customElements.define("user-manuals-section", UserManualsSection);
