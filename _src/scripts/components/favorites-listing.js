import { ProductCardFavorites } from "./product-card-favorites";

class FavoritesListing extends HTMLElement {
  constructor() {
    super();
    console.log("getFavorites()", this.getFavorites());

    // this.intialRender()
    this.renderProductCards();
  }

  getFavorites() {
    return JSON.parse(localStorage.getItem("favorites"));
  }

  renderProductCards() {
    const listEl = this.querySelector("ul");

    if (this.getFavorites() !== null && this.getFavorites().length < 1) {
      const favoritesEmptyCard = document.createElement("li");
      // adds heading
      const favoritesEmptyCardH2 = document.createElement("h2");
      favoritesEmptyCardH2.classList.add("text-3xl");
      favoritesEmptyCardH2.classList.add("mb-2");
      favoritesEmptyCardH2.textContent = "You haven’t saved any products yet";

      // adds p
      const favoritesEmptyCardP = document.createElement("p");
      favoritesEmptyCardP.textContent =
        "You can save items for later in case you want to come back to it or share with your friends and family!";
      favoritesEmptyCardP.classList.add('mb-6')

      // adds btn
      const favoritesEmptyCardBtn = document.createElement("a");
      favoritesEmptyCardBtn.href = "/collections/shop";
      favoritesEmptyCardBtn.classList.add("btn-primary");
      favoritesEmptyCardBtn.textContent = "SHOP NOW";

      // appends all elements to card
      favoritesEmptyCard.appendChild(favoritesEmptyCardH2);
      favoritesEmptyCard.appendChild(favoritesEmptyCardP);
      favoritesEmptyCard.appendChild(favoritesEmptyCardBtn);
      listEl.appendChild(favoritesEmptyCard);

      return;
    }
    if (this.getFavorites() !== null && this.getFavorites().length > 0) {
      let favorites = this.getFavorites();
      // const listEl = this.querySelector('ul')

      const stylesheetURL = this.getAttribute("stylesheet-url");

      favorites.map((favorite) => {
        // console.log("render product card favorite", favorite)
        // Create a new instance of the other component
        const productCard = document.createElement("product-card-favorites");
        // Set parameters on the other component
        productCard.setAttribute("favorite", JSON.stringify(favorite));
        productCard.setAttribute("stylesheet-url", stylesheetURL);
        // Append the other component to the DOM
        listEl.appendChild(productCard);
      });
    }
  }

  intialRender() {
    if (this.getFavorites() !== null && this.getFavorites().length > 0) {
      let favorites = this.getFavorites();
      this.renderHTML(favorites);

      const fieldsets = this.querySelectorAll("ul");

      fieldsets.forEach((fieldset) => {
        fieldset.addEventListener("change", () => {
          console.log("change");
        });
      });
    }
  }

  renderHTML(favorites) {
    const listEl = this.querySelector("ul");
    const html = favorites
      .map(
        (item) => `
      <li>
        <prouduct-card-favorites class="product-card-favorites">
          <a href='${item.url}' class="product-card-favorites__image">
            <img src="${item.featured_image}" loading="lazy" class="">
          </a>

          <div class="product-card-favorites__main">
            <span class="product-card-favorites__main-shop-name">${
              item.shop_name
            }</span>
            <p class="product-card-favorites__main-product-title">${
              item.title
            }</p>
            <span class="product-card-favorites__main-product-price">${
              item.price
            }</span>

            <fieldset class="flex gap-x-3 mt-4">
              ${
                item.variants
                  ? item.variants
                      .map(
                        (variant) => `
                <label for="FavoritesCard-${item.handle}-${variant.title}" class="cursor-pointer">
                  <input type="radio" id="FavoritesCard-${item.handle}-${variant.title}" name="${item.handle}-color" value="${variant.title}" title="${variant.title}" class="sr-only peer"/>
                  <span
                    class="relative inline-block w-3 h-3 rounded-full overflow-hidden border border-neutral-500 outline outline-1 outline-transparent outline-offset-4 peer-checked:outline peer-checked:outline-neutral-500 "
                    style="background-color: ${variant.title}"
                  >
                  
                    <span class="sr-only">
                      ${variant.title}
                    </span>
                  </span>
                </label>
              `
                      )
                      .join("")
                  : ""
              }
            </fieldset>
          </div>

          <div class="product-card-favorites__actions">
            <button id="AddToCart-${
              item.handle
            }" type="button" class="btn-primary" product-id="${
          item.id
        }">Add to cart</button>

            <div class="product-card-favorites__actions-middle">
              <a href='${item.url}' class="">View item</a>
              <button type="button" product-id="${
                item.id
              }"  class="">remove</button>
            </div>

            <p>Need help? Call <a href="tel:${
              window.themeVariables.phone_number
            }">${
          window.themeVariables.phone_number
        }</a> or <strong>chat with us</strong></p>
          </div>
          
        </prouduct-card-favorites>
      </li>
    `
      )
      .join("");

    listEl.innerHTML = html;
  }
}

window.customElements.define("favorites-listing", FavoritesListing);
