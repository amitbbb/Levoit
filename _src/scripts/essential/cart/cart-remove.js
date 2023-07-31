class CartRemove extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('click', (event) => {
      event.preventDefault();
      const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
      cartItems.updateQuantity(this.dataset.index, 0);
      console.log("cartItems", cartItems)
      console.log("this.dataset.index, 0", this.dataset.index, 0)
    });
  }
}

window.customElements.define('cart-remove', CartRemove);