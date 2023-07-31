import { fetchConfig } from "../base/global";

class QuickAddToCart extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector("form");
    if (document.querySelector("cart-drawer"))
      this.submitButton = this.querySelector('[type="submit"]');
    this.submitButton.setAttribute("aria-haspopup", "dialog");

    this.cart =
      document.querySelector("cart-notification") ||
      document.querySelector("cart-drawer");
  }

  connectedCallback() {
    this.addEventListener("change", this.onVariantChange);
    this.addEventListener("submit", (evt) => this.onSubmit(evt));
  }

  onSubmit(evt) {
    evt.preventDefault();

    const config = fetchConfig("javascript");
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    delete config.headers["Content-Type"];

    const formData = new FormData(this.form);
    if (this.cart) {
      formData.append(
        "sections",
        this.cart.getSectionsToRender().map((section) => section.id)
      );
      formData.append("sections_url", window.location.pathname);
      this.cart.setActiveElement(document.activeElement);
    }
    config.body = formData;

    console.log(
      "this.cart.getSectionsToRender().map((section) => section.id)",
      this.cart.getSectionsToRender().map((section) => section.id)
    );

    fetch(`${themeVariables.routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
        console.log("response", response);
        if (response.status) {
          this.handleErrorMessage(response.description);

          const soldOutMessage =
            this.submitButton.querySelector(".sold-out-message");
          if (!soldOutMessage) return;

          this.submitButton.setAttribute("aria-disabled", true);
          this.submitButton.textContent = "Sold out";
          this.error = true;
          return;
        } else if (!this.cart) {
          window.location = window.themeVariables.routes.cart_url;
          return;
        }

        this.error = false;

        const quickAddModal = this.closest("quick-add-modal");
        if (!quickAddModal) {
          // cart notification
          this.cart.renderContents(response);
          console.log("this,cart res", response);
        }
      })
      .catch((e) => console.error("ProductForm E", e))
      .finally((e) => {
        this.submitButton.classList.remove("is-loading");
        if (this.cart && this.cart.classList.contains("is-empty"))
          this.cart.classList.remove("is-empty");
        if (!this.error) this.submitButton.removeAttribute("aria-disabled");
      });
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, "", false);

    console.log("THIS CURRENT VARIANT", this.currentVariant);
    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateVariantInput();
      this.renderProductInfo();
    }
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value;
    });
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = this.querySelector("form");
    if (!productForm) return;
    const addButton = productForm.querySelector('button[name="add"]');
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute("disabled", "disabled");
      if (text) addButton.textContent = text;
    } else {
      addButton.removeAttribute("disabled");
      addButton.textContent = window.themeVariables.strings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const addButton = this.querySelector('[name="add"]');

    if (!addButton) return;
    addButton.textContent = window.variantStrings.unavailable;
  }

  updateMedia() {
    const colorFieldset = this.querySelector("fieldset[color-variant]");

    if (!colorFieldset) return;
    console.log("colorFieldset", colorFieldset);
    colorFieldset.dispatchEvent(
      new CustomEvent("color-variant:changed", {
        bubbles: true,
        detail: this.currentVariant,
      })
    );
  }

  updateVariantInput() {
    const input = this.querySelector("form").querySelector('input[name="id"]');
    input.value = this.currentVariant.id;
  }

  renderProductInfo() {
    this.toggleAddButton(
      !this.currentVariant.available,
      window.themeVariables.strings.soldOut
    );

    if (!this.currentVariant.featured_image) return;
    this.productImage = this.querySelector("img");

    this.productImage.src =
      this.currentVariant.featured_image.src + "&width=500";
  }
}

window.customElements.define("quick-add-to-cart", QuickAddToCart);
