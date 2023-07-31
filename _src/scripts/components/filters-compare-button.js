class FiltersCompareButton extends HTMLElement {
  constructor() {
    super();
    this.count = this.querySelector('[count]')
  }

  connectedCallback() {
    this.render()
    this.onchange();
  }

  disconnectedCallback() {
    //implementation
  }
  render() {
    if (this.getComparisons() !== null && this.getComparisons().length > 0) {
      this.classList.remove('hidden')
      this.classList.add('block')
      this.count.textContent = this.getComparisons().length
    } else {
      this.classList.add('hidden')
    }
  }

  onchange() {
    document.addEventListener("comparisons-updated", (evt) => {
      this.render()
    })
  }

  getComparisons() {
    return JSON.parse(localStorage.getItem("comparisons"));
  }
}

window.customElements.define('filters-compare-button', FiltersCompareButton);