class StoreHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // this.header = document.getElementById('shopify-section-header');
    this.header = this
    this.headerBounds = {};
    this.currentScrollTop = 0;
    this.preventReveal = false;
    // this.predictiveSearch = this.querySelector('predictive-search');
    this.onScrollHandler = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScrollHandler, false);
    this.createObserver();
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this.onScrollHandler);
  }

  createObserver() {
    let observer = new IntersectionObserver((entries, observer) => {
      this.headerBounds = entries[0].intersectionRect;
      observer.disconnect();
    });
    observer.observe(this.header);
  }

  onScroll() {
    const scrollTop =  document.documentElement.scrollTop;
    // if (this.predictiveSearch && this.predictiveSearch.isOpen) return;
    const logoPrimary = this.querySelector('#LogoPrimary')
    const logoSecondary = this.querySelector('#LogoSecondary')

    if (scrollTop ) { 
      if (this.preventHide) return;
        requestAnimationFrame(this.fillColor.bind(this));
    } else {
      requestAnimationFrame(this.removeFillColor.bind(this));
    }
    // if (scrollTop > this.headerBounds.bottom) { 
    //   if (this.preventHide) return;
    //     requestAnimationFrame(this.fillColor.bind(this));
    // } else {
    //   requestAnimationFrame(this.removeFillColor.bind(this));
    // }


  }

  fillColor() {
    this.header.classList.add('is-filled');
    this.header.closest('header').classList.add('is-filled')
  }

  removeFillColor() {
    this.header.classList.remove('is-filled');
    this.header.closest('header').classList.remove('is-filled')
  }

}

window.customElements.define('store-header', StoreHeader);