class PaginationComponent extends HTMLElement {
  constructor() {
    super();
    this.isLoading = false
    this.button = this.querySelector('button')
  }

  connectedCallback() {
    // console.log("this.button ====>", this.button)
    this.button.addEventListener('click', this.loadMore.bind(this))
  }


  async loadMore() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.button.disabled = true;

    const path = this.getAttribute('url')

    if (!path) return;

    console.log("PATH =====>", path)

    try {
      const response = await fetch(`${path}&section_id=main-collection-product-grid`)
      const data = await response.text();

      this.button.disabled = false;
      this.isLoading = false;

      // Get the HTML for the productlist
      const productListHTML = new DOMParser()
      .parseFromString(data, "text/html")
      .querySelector("#product-grid").innerHTML;

      // console.log("productListHTML",productListHTML)

      const productGrid = document.querySelector('#product-grid')

      productGrid.insertAdjacentHTML('beforeend', productListHTML)

      // Get the URL for the pagination
      const paginationURL = new DOMParser()
      .parseFromString(data, "text/html")
      .querySelector("pagination-component")

      console.log("paginationURL",paginationURL)


      if (!paginationURL) {
        this.remove()

        return
      }


      this.setAttribute('url', paginationURL.getAttribute('url'))

    } catch(err) {
      console.error(err)
      this.button.disabled = false;
      this.isLoading = false;
    }

    
  }
}

window.customElements.define('pagination-component', PaginationComponent);
