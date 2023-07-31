import { debounce, fetchConfig } from "../../base/global";

class CartItems extends HTMLElement {
  constructor() {
    super();

    this.lineItemStatusElement =
      document.getElementById("shopping-cart-line-item-status") ||
      document.getElementById("CartDrawer-LineItemStatus");

    this.currentItemCount = Array.from(
      this.querySelectorAll('[name="updates[]"]')
    ).reduce(
      (total, quantityInput) => total + parseInt(quantityInput.value),
      0
    );

    this.debouncedOnChange = debounce((event) => {
      this.onChange(event);
    }, 300);

    this.addEventListener("change", this.debouncedOnChange.bind(this));
  }

  onChange(event) {
    this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
  }

  getSectionsToRender() {
    return [
      {
        id: 'main-cart-items',
        section: document.getElementById('main-cart-items').dataset.id,
        selector: '.js-contents'
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
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section'
      },
      {
        id: 'cart-live-region-text',
        section: 'cart-live-region-text',
        selector: '.shopify-section'
      },
      // {
      //   id: 'main-cart-summary',
      //   section: `main-cart-summary-${document.getElementById('main-cart-items').dataset.id}`,
      //   // section: 'cart-summary',
      //   selector: '.js-cart-summary'
      // },
    ];
  }

  updateQuantity(line, quantity, name) {
    // this.enableLoading(line)

    const body = JSON.stringify({
      line,
      quantity,
      sections: this.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname
    })
    

    fetch(`${themeVariables.routes.cart_change_url}`, { ...fetchConfig(), ...{ body } })
      .then((response) => {
        return response.text()
      })
      .then((state) => {
        const parsedState = JSON.parse(state)
        console.log("parsedState", parsedState)

        this.classList.toggle('is-empty', parsedState.item_count === 0);

        const cartSummary = document.getElementById('main-cart-summary');
        console.log("cartSummary", cartSummary)
        if (cartSummary) cartSummary.classList.toggle('is-empty', parsedState.item_count === 0);


        const cartLayout = document.getElementById('main-cart-layout');
        if (cartLayout) cartLayout.classList.toggle('is-empty', parsedState.item_count === 0);

        this.getSectionsToRender().forEach((section => {
          console.log("section", section)

          const elementToReplace =
            document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);
          console.log("elementToReplace", elementToReplace)
            
            
          elementToReplace.innerHTML =
            this.getSectionInnerHTML(parsedState.sections[section.section], section.selector);

            // console.log("elementToReplace.innerHTML", elementToReplace.innerHTML)
        }));

        this.updateLiveRegions(line, parsedState.item_count);
        const lineItem = document.getElementById(`CartItem-${line}`) || document.getElementById(`CartDrawer-Item-${line}`);
        // console.log("lineItem", lineItem)
        // console.log("lineItemQS", lineItem.querySelector(`[name="${name}"]`))
        


      })
      .catch((e) => {
        console.log("cartItems error", e)
        const errors = document.getElementById('cart-errors') || document.getElementById('CartDrawer-CartErrors');
        errors.textContent = window.themeVariables.cartStrings.error;
      })
  }

  updateLiveRegions(line, itemCount) {
    if (this.currentItemCount === itemCount) {
      const lineItemError = document.getElementById(`Line-item-error-${line}`) || document.getElementById(`CartDrawer-LineItemError-${line}`);
      const quantityElement = document.getElementById(`Quantity-${line}`) || document.getElementById(`Drawer-quantity-${line}`);

      // lineItemError.classList.remove("hidden")

      lineItemError.classList.remove("hidden")

      console.log("lineitem error", lineItemError)
      lineItemError
        .querySelector('.cart-item__error-text')
        .innerHTML = window.themeVariables.cartStrings.quantityError.replace(
          '[quantity]',
          quantityElement.value
        );
    }

    this.currentItemCount = itemCount;
    this.lineItemStatusElement.setAttribute('aria-hidden', true);

    const cartStatus = document.getElementById('cart-live-region-text') || document.getElementById('CartDrawer-LiveRegionText');
    cartStatus.setAttribute('aria-hidden', false);

    setTimeout(() => {
      cartStatus.setAttribute('aria-hidden', true);
    }, 1000);
  }

  getSectionInnerHTML(html, selector) {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

}
window.customElements.define('cart-items', CartItems);


class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: "CartDrawer",
        section: "cart-drawer",
        selector: ".cart-drawer__main",
      },
      {
        id: "cart-icon-bubble",
        section: "cart-icon-bubble",
        selector: ".shopify-section",
      },
      // {
      //   id: "cart-live-region-text",
      //   section: "cart-live-region-text",
      //   selector: ".shopify-section",
      // },
    ];
  }
}
customElements.define('cart-drawer-items', CartDrawerItems);