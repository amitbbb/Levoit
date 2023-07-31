export class ProductCardFavorites extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.isloading = true;

    // document.addEventListener('DOMContentLoaded', (evt) => {
    const favorite = JSON.parse(this.getAttribute("favorite"));
    console.log("product-card-favorites loaded", favorite);

    console.log("product_options", favorite.product_options);

    const productHandle = favorite.handle;

    const stylesheetURL = this.getAttribute("stylesheet-url");

    const linkElem = document.createElement("link");
    linkElem.setAttribute("rel", "stylesheet");
    linkElem.setAttribute("href", stylesheetURL);

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(linkElem);

    this.getProductData(productHandle, shadowRoot);
    // })

    // this.onChange(shadowRoot)
    // this.addToCart(shadowRoot)
  }

  async getProductData(productHandle, shadowRoot) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "no-cors",
    };
    try {
      this.isLoading = true;
      const response = await fetch(`/products/${productHandle}.js`, options);
      // const response = await fetch(`/products/${productHandle}.js`, options)
      if (!response.ok) throw new Error("Network response was not ok");

      const productData = await response.json();
      console.log("product data", productData);

      this.renderHTML(productData, shadowRoot);
      this.removeProduct(shadowRoot);
      this.onChange(shadowRoot, productData);
      this.addToCart(shadowRoot);
    } catch (error) {
      console.error(error);
    }
  }

  renderHTML(productData, shadowRoot) {
    this.isLoading = false;

    console.log("window.themeVariables.color", window.themeVariables.colors);

    console.log("RENDERHTML data", productData);
    // Create a template element and set its content
    const template = document.createElement("template");
    template.innerHTML = this.isLoading
      ? `loading`
      : `
    <li class="h-full">
    <div class="product-card-favorites" product-id="${productData.id}">
      <div class="product-card-favorites__image">
        <a href='${productData.url}' class="product-card-favorites__image-link">
          <img src="${
            productData.featured_image
          }&width=350" loading="lazy" class="product-card-favorites__image-img">
        </a>
      </div>
      

      <div class="product-card-favorites__main">
        <span class="product-card-favorites__main-shop-name">${
          productData.vendor
        }</span>
        <p class="product-card-favorites__main-product-title">${
          productData.title
        }</p>
        <span class="product-card-favorites__main-product-price">$${
          (productData.price / 100).toFixed(2)
        }</span>

        ${
          productData.options[0].name !== "Title"
            ? `
          <form>
          ${productData.options
            .map((option, index) =>
              option.name === "Color"
                ? `
                <fieldset class="flex gap-x-3 mt-4">
                  ${option.values
                    .map(
                      (value, index) => `
                    <label for="FavoritesCard-${productData.id}-${
                        option.position
                      }-${index}" class="cursor-pointer">
                      <input type="radio" id="FavoritesCard-${productData.id}-${
                        option.position
                      }-${index}" name="${
                        option.name
                      }" value="${value}" title="${value}" class="sr-only peer" ${
                        index === 0 ? "checked" : ""
                      }/>
                      <span
                        class="relative inline-block w-3 h-3 rounded-full overflow-hidden border border-neutral-500 outline outline-1 outline-transparent outline-offset-4 peer-checked:outline peer-checked:outline-neutral-500 "
                        style="background-color: ${
                          window.themeVariables.colors.find(
                            (color) => color.name === value.toLowerCase().trim()
                          )
                            ? window.themeVariables.colors.find(
                                (color) =>
                                  color.name === value.toLowerCase().trim()
                              ).hex
                            : value.toLowerCase().trim()
                        }"
                      >
                        <span class="sr-only">${value
                          .toLowerCase()
                          .trim()}</span>
                      </span>
                    </label>
                  `
                    )
                    .join("")}
                </fieldset>  
              `
                : `
                <fieldset class="flex gap-x-3 mt-4">
                  ${option.values
                    .map(
                      (value, index) => `
                    <label for="FavoritesCard-${productData.id}-${
                        option.position
                      }-${index}" class="cursor-pointer">
                      <input type="radio" id="FavoritesCard-${productData.id}-${
                        option.position
                      }-${index}" name="${
                        option.name
                      }" value="${value}" title="${value}" class="sr-only peer" ${
                        index === 0 ? "checked" : ""
                      } />

                    <span
                        class="favorites-card-fieldset-input-span"
                      >
                      ${value}
                      </span>
                    </label>
                  `
                    )
                    .join("")}
                </fieldset>
              `
            )
            .join("")}
        
        </form>
        `
            : ""
        }
       
       

        <span id="ProductCardFavorites-Status-${
          productData.id
        }" class=""></span>
      </div>

      <div class="product-card-favorites__actions">
        <button id="AddToCart-${
          productData.handle
        }" type="button" class="btn-primary" product-id="${
          productData.variants[0].id
        }" ${productData.variants[0].available === false ? "disabled" : ""}>${
          productData.variants[0].available === false
            ? "Sold out"
            : "Add to cart"
        }</button>

        <div class="product-card-favorites__actions-middle">
          <a href='${productData.url}' class="">View item</a>
          <button id='ProductCardFavorites-Remove-${
            productData.id
          }' type="button" product-id="${
          productData.id
        }"  class="">Remove</button>
        </div>

        <p class="text-center">Need help? Call <a href="tel:${
          window.themeVariables.phone_number
        }">${
          window.themeVariables.phone_number
        }</a> or <open-chatbox-button class="inline-block cursor-pointer"><strong>chat with us</strong></open-chatbox-button></p>
      </div>
      
    </div>
  </li>
  `;

    // Append the template content to the shadow root
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  onChange(shadowRoot, productData) {
    // const fieldset = shadowRoot.querySelector("fieldset");
    const form = shadowRoot.querySelector("form");
    console.log("ON CHAGE", productData);

    if (!form) return;

    form.addEventListener("change", (evt) => {
      this.updateOptions(shadowRoot);
      this.getCurrentVariant(productData);
      this.updateImage(shadowRoot);
      this.updateProductId(shadowRoot);
      this.updateAvailability(shadowRoot);
    });
  }

  updateAvailability(shadowRoot) {
    const addToCartButton = shadowRoot.querySelector(
      'button[id^="AddToCart-"]'
    );
    console.log("UPDATE AVAIL", this.currentVariant);

    if (this.currentVariant.available === false) {
      addToCartButton.textContent = "Sold out";
      addToCartButton.disabled = true;
    } else {
      addToCartButton.textContent = "Add to Cart";
      addToCartButton.disabled = false;
    }
  }

  updateOptions(shadowRoot) {
    const fieldsets = Array.from(shadowRoot.querySelectorAll("fieldset"));

    // this.options = Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value;
    });
    console.log("updateoptions", this.options);

    return this.options;
  }

  getCurrentVariant(productData) {
    console.log("getcurrentvariant", productData);
    this.currentVariant = productData.variants.find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });

    console.log("getCurrentVariant()", this.currentVariant);
  }

  updateImage(shadowRoot) {
    console.log("updateImage", this.currentVariant);

    if (!this.currentVariant.featured_image) return;
    const image = shadowRoot.querySelector("img");
    const imageSrc = `${this.currentVariant.featured_image.src}&width=350`;

    image.src = imageSrc;
  }

  addToCart(shadowRoot) {
    const addToCartButton = shadowRoot.querySelector(
      'button[id^="AddToCart-"]'
    );
    let productID = parseInt(addToCartButton.getAttribute("product-id"));

    addToCartButton.addEventListener("click", (evt) => {
      this.postToCart(shadowRoot, productID);
    });
  }

  postToCart(shadowRoot, productID) {
    const addToCartButton = shadowRoot.querySelector(
      'button[id^="AddToCart-"]'
    );
    productID = parseInt(addToCartButton.getAttribute("product-id"));
    const form = shadowRoot.querySelector("form");

    this.cart =
      document.querySelector("cart-notification") ||
      document.querySelector("cart-drawer");

    if (document.querySelector("cart-drawer"))
      addToCartButton.setAttribute("aria-haspopup", "dialog");

    console.log("addToCart() ====>", productID);

    console.log("themeVariables.routes.cart_add_url", productID);
    // const formData = new FormData(this.form);
    let formData = {
      items: [
        {
          id: productID,
          quantity: 1,
        },
      ],
      sections: "cart-drawer,cart-icon-bubble",
    };

    if (this.cart) {
      // formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
      // formData.append('sections_url', window.location.pathname);
      this.cart.setActiveElement(document.activeElement);
    }

    console.log("formData", formData);

    fetch(`${themeVariables.routes.cart_add_url}.js`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      // body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Product added to cart:", data);

        this.handleStatus(shadowRoot, data);
        this.cart.renderContents(data);
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
      });
  }

  handleStatus(shadowRoot, data) {
    const statusMsg = shadowRoot.querySelector(
      "span[id^=ProductCardFavorites-Status]"
    );
    console.log("statusMsg", data);

    if (data.status === 422) {
      statusMsg.textContent = data.description;
    }

    statusMsg.textContent = `${data.items[0].title} added to cart`;
  }

  updateProductId(shadowRoot) {
    const addToCartButton = shadowRoot.querySelector(
      'button[id^="AddToCart-"]'
    );
    const productCard = shadowRoot.querySelector(".product-card-favorites");
    console.log("productCard", productCard);
    productCard.setAttribute("product-id", this.currentVariant.id);
    addToCartButton.setAttribute("product-id", this.currentVariant.id);
  }

  removeProduct(shadowRoot) {
    const productCard = shadowRoot;
    const removeButton = shadowRoot.querySelector(
      'button[id^="ProductCardFavorites-Remove"]'
    );
    const productID = removeButton.getAttribute("product-id");
    console.log("productCard", productCard);

    removeButton.addEventListener("click", (evt) => {
      // Get current favorites items from local storage or create empty array if none exists
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      // if existing comparisons array in localStorage contains key value pair
      if (
        favorites.some((obj) =>
          Object.entries(obj).some(
            ([key, value]) => key === "id" && value === productID
          )
        )
      ) {
        console.log("remove from favorites", productID);

        // Create a new array that removes object in existing favorites array if key value pair exists
        favorites = favorites.filter(
          (obj) =>
            !Object.entries(obj).some(
              ([key, value]) => key === "id" && value === productID
            )
        );

        // Push new array to localStorage and remove active class on button
        localStorage.setItem("favorites", JSON.stringify(favorites));

        this.remove();
      }
    });
  }
}

window.customElements.define("product-card-favorites", ProductCardFavorites);
