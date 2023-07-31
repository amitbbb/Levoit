class CartNotification extends HTMLElement {
  constructor() {
    super();
    this.notification = document.getElementById("cart-notification")
    this.header = document.querySelector("store-header")
    this.onBodyClick = this.handleBodyClick.bind(this)

    this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelectorAll('button[type="button"]').forEach((closeButton) =>
      closeButton.addEventListener('click', this.close.bind(this))
    );

    this.addEventListener("mouseenter", this.stopTimer.bind(this))
    this.addEventListener("mouseleave", this.startTimer.bind(this))
  }

  startTimer() {
    console.log("startTimer")
    this.timeout = setTimeout(() => {
      this.close();
    }, 3000)
  }

  stopTimer() {
    console.log("stopTimer")
    clearTimeout(this.timeout)
  }

  open() {
    console.log("open")
    this.notification.classList.add('animate', 'is-active');

    this.notification.addEventListener('transitionend', () => {
      this.notification.focus();
      // trapFocus(this.notification);
    }, { once: true });

    document.body.addEventListener('click', this.onBodyClick);

    // setTimeout(() => {
    //   this.close();
    // }, 3000)

    this.startTimer();
  }

  close() {
    this.notification.classList.remove('is-active');
    document.body.removeEventListener('click', this.onBodyClick);
    // removeTrapFocus(this.activeElement);
  }

  renderContents(parsedState) {
    console.log("notification parsedState",parsedState.key)
    this.cartItemKey = parsedState.key;
    this.getSectionsToRender().forEach((section => {
      console.log("section", section)
      document.getElementById(section.id).innerHTML =
        this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    }));
    // if (this.header) this.header.reveal();
      this.open();
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-notification-product',
        selector: `[id="cart-notification-product-${this.cartItemKey}"]`,
      },
      // {
      //   id: 'cart-notification-button'
      // },
      {
        id: 'cart-icon-bubble'
      }
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  handleBodyClick(evt) {
    const target = evt.target;
    if (target !== this.notification && !target.closest('cart-notification')) {
      const disclosure = target.closest('details-disclosure, header-menu');
      this.activeElement = disclosure ? disclosure.querySelector('summary') : null;
      this.close();
    }
  }

  setActiveElement(element) {
    this.activeElement = element;
  }


}

window.customElements.define('cart-notification', CartNotification);