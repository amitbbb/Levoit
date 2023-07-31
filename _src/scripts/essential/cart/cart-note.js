import { debounce, trapFocus } from "../../base/global";

class CartNote extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', debounce((event) => {
      const body = JSON.stringify({ note: event.target.value });
      console.log("carnote", body)
      fetch(`${themeVariables.routes.cart_update_url}`, { ...fetchConfig(), ...{ body } });
    }, 300))
  }
}

window.customElements.define('cart-note', CartNote);