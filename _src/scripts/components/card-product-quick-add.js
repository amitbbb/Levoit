import { fetchConfig } from "../base/global";

class CardProductQuickAdd extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.variantPicker = this.querySelector("[variant-picker]");
    this.addButton = this.querySelector('button[name="add"]');
    this.addButtonText = this.addButton.querySelector("span");
    this.masterId = this.querySelector('input[name="id"]')
    this.price = this.querySelector("[price]");
    this.productImage = this.querySelector("img[product-image]");
    this.form = this.querySelector("form");
    this.cart =
      document.querySelector("cart-notification") ||
      document.querySelector("cart-drawer");
    this.closeBtns = this.querySelectorAll('[variant-selector-close]')

    this.masterId.disabled = false
    this.form.addEventListener("submit", this.onSubmitHandler.bind(this));

    //return if no variants
    if (!this.variantPicker) return;

    this.addEventListener("change", (evt) => this.onVariantChange(evt));
    
    this.closeBtns.forEach((btn) => {
      btn.addEventListener("click", (evt) =>
        this.closeVariantSelectorPopup(evt)
      );
    });

    this.addButton.addEventListener("click", (evt) => { 
      this.onSubmitHandler(evt);
    });
  }
  
  closeVariantSelectorPopup(evt) {
    evt.target.closest("details").removeAttribute("open");
  }


  onSubmitHandler(evt) {
    evt.preventDefault();

    if (this.addButton.getAttribute("aria-disabled") === "true") return;

    this.addButton.setAttribute("aria-disabled", true);

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
            this.addButton.querySelector(".sold-out-message");
          if (!soldOutMessage) return;

          this.addButton.setAttribute("aria-disabled", true);
          this.addButton.querySelector("span").classList.add("hidden");
          soldOutMessage.classList.remove("hidden");
          this.error = true;
          return;
        } else if (!this.cart) {
          window.location = window.themeVariables.routes.cart_url;
          return;
        }

        this.error = false;

        const quickAddModal = this.closest("quick-add-modal");
        if (quickAddModal) {
          // document.body.addEventListener('modalClosed', () => {
          //   setTimeout(() => { this.cart.renderContents(response) });
          // }, { once: true });
          // quickAddModal.hide(true);
        } else {
          // cart notification
          this.cart.renderContents(response);
          console.log("this,cart res", response);
        }
      })
      .catch((e) => console.error("ProductForm E", e))
      .finally((e) => {
        this.addButton.classList.remove("is-loading");
        if (this.cart && this.cart.classList.contains("is-empty"))
          this.cart.classList.remove("is-empty");
        if (!this.error) this.addButton.removeAttribute("aria-disabled");
      });
  }

  handleErrorMessage(errorMessage = false) {
    this.errorMessageWrapper =
      this.errorMessageWrapper ||
      this.querySelector("[error-msg]");
    if (!this.errorMessageWrapper) return;
    this.errorMessage =
      this.errorMessage ||
      this.errorMessageWrapper.querySelector(".product-form__error-message");

    // this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);
    this.errorMessageWrapper.classList.toggle("hidden", !errorMessage);

    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }

  onVariantChange(evt) {
    this.updateOptions();
    this.updateMasterId();
    this.closeOnVariantChange(evt);

    console.log("THIS CURRENT VARIANT", this.currentVariant);

    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    }

    if (this.currentVariant) {
      this.updateProductInfo();
      this.updateMedia();
      this.updateProductId();
    }
  }

  closeOnVariantChange(evt) {
    if (!evt.target.closest('details')) return;

    evt.target.closest('details').removeAttribute('open')
  }

  updateProductInfo() {
    if (!this.currentVariant) return;

    if (!this.currentVariant.available) {
      this.addButton.disabled = true;
      this.addButtonText.textContent = window.themeVariables.strings.soldOut;
    } else {
      this.addButton.disabled = false;
       this.addButtonText.textContent = window.themeVariables.strings.addToCart;
    }
  }

  updateMedia() {
    if (!this.currentVariant.featured_image) return;
    this.productImage.src = `${this.currentVariant.featured_image.src}&width=500`;
  }

  updateProductId() {
    this.masterId.value = this.currentVariant.id;
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent);

    return this.variantData;
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

  toggleAddButton(disable = true, text, modifyClass = true) {
    if (!this.addButton) return;

    if (disable) {
      this.addButton.setAttribute("disabled", "disabled");
      if (text) this.addButtonText.textContent = text;
    } else {
      this.addButton.removeAttribute("disabled");
      this.addButtonText.textContent = window.themeVariables.strings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    if (!this.addButton) return;
    this.addButtonText.textContent = window.variantStrings.unavailable;
    if (this.price) this.price.classList.add("sr-only");
  }
}

window.customElements.define("card-product-quick-add", CardProductQuickAdd);
