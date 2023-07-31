class BlogFilterDrawer extends HTMLElement {
  constructor() {
    super();
    this.details = this.querySelector('details')
    this.summary = this.querySelector('summary')
    this.closeBtn = this.querySelector('button[close]')
  }

  connectedCallback() {
    this.closeBtn.addEventListener('click', (evt) => {
      this.details.removeAttribute('open')
      this.summary.setAttribute('aria-expanded', false)
    })
  }

  
}

window.customElements.define('blog-filter-drawer', BlogFilterDrawer);