class QuickAddToCartSticky extends HTMLElement {
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
        // Scrolling up
        this.aside.classList.add("is-active");
      } else {
        // Scrolling down
        this.aside.classList.remove("is-active");
      }

      prevScrollPos = currentScrollPos;
    });
  }

  disconnectedCallback() {
    //implementation
  }

  attributeChangedCallback(name, oldVal, newVal) {
    //implementation
  }

  adoptedCallback() {
    //implementation
  }
}

window.customElements.define("quick-add-to-cart-sticky", QuickAddToCartSticky);
