class AddToFavorites extends HTMLElement {
  constructor() {
    super();
    // fetch(
    //   "https://cosori-stage.myshopify.com/products/smart-7-0-quart-air-fryer-oven-af701-cs.js?preview_theme_id=122184597559"
    // )
    //   .then((response) => response.text())
    //   .then((data) => console.log("ajax api data", data))
    //   .catch((error) => console.error("ajax api error", error));
  }

  connectedCallback() {
    const button = this.querySelector("button");
    const productJSON = JSON.parse(this.getAttribute("product-json"));

    // Get current compare items from local storage or create empty array if none exists
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    button.addEventListener("click", (evt) => {
      this.toggleAddToFavorites(productJSON);
    });

    this.display(favorites, button, productJSON);
  }

  display(favorites, button, productJSON) {
    // If the object with key value pair is present in favorites array in localStorage

    if (
      favorites !== null &&
      favorites.some((obj) =>
        Object.entries(obj).some(
          ([key, value]) =>
            key === "id" && value === productJSON.id
        )
      )
    ) {
      button.classList.add("is-active");
    }
  }

  toggleAddToFavorites(productJSON) {
    const button = this.querySelector("button");

    // Get current compare items from local storage or create empty array if none exists
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // if existing favorites array in localStorage contains key value pair

    if (
      favorites.some((obj) =>
        Object.entries(obj).some(
          ([key, value]) => key === "id" && value === productJSON.id
        )
      )
    ) {
      console.log("remove from favorites", productJSON.id);

      // Create a new array that removes object in existing favorites array if key value pair exists
      let newFavoritesArray = favorites.filter(
        (obj) =>
          !Object.entries(obj).some(
            ([key, value]) => key === "id" && value === productJSON.id
          )
      );

      // Push new array to localStorage and remove active class on button
      localStorage.setItem("favorites", JSON.stringify(newFavoritesArray));
      button.classList.remove("is-active");
    } else {
      console.log("add to favorites", productJSON.id);
      favorites.push(productJSON);

      // Store updated favorites in local storage
      localStorage.setItem("favorites", JSON.stringify(favorites));

      button.classList.add("is-active");
    }
  }

  getProductJSON() {
    return JSON.parse(this.getAttribute("product-json"));
  }
}

window.customElements.define('add-to-favorites', AddToFavorites);


// class AddToFavorites extends HTMLElement {
//   constructor() {
//     super();
//     const button = this.querySelector("button")
//     const product = this.querySelector("button").getAttribute('variant-id');


//     // Get current wishlist items from local storage or create empty array if none exists
//     let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

//     button.addEventListener('click', (evt) => {
//       this.addToFavorites()

//     })

//     // Update favorites on the page
//     this.displayFavorites(favorites, product, button)

//     // Console log current wishlist items
//     console.log('current favorites', favorites)

   
//   }


//   displayFavorites(favorites, product, button) {
//     if (favorites !== null && favorites.includes(product)) {

//      // The array is present in localStorage
//       var index = favorites.indexOf(product);
//       if (index !== -1) {
//         button.classList.add('is-active')
//       }

//     } 
//   }

//   addToFavorites() {
//     const button = this.querySelector("button")
//     const product = this.querySelector("button").getAttribute('variant-id');


//     // Get current wishlist items from local storage or create empty array if none exists
//     let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    
//     if (favorites.includes(product)) {
//       console.log("remove from favorites prodcut", product)
//       console.log("removed from favorites")
//      // The array is present in localStorage
//       var index = favorites.indexOf(product);
//       if (index !== -1) {
//         // The value is present in the array
//         // Remove it using the splice() method
//         favorites.splice(index, 1);
//         // Store the updated array back to localStorage
//         localStorage.setItem("favorites", JSON.stringify(favorites));
//         button.classList.remove('is-active')
//       }

//     } else {
//       console.log("added to favorites", product)
//       // Add new item to wishlist
//       favorites.push(product);

//       // Store updated wishlist in local storage
//       localStorage.setItem('favorites', JSON.stringify(favorites));

//       button.classList.add('is-active')
//     }

   

//   }

//   // displayFavorites() {
//   //   const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

//   //   const favoritesElement = document.getElementById('favorites');
//   //   favoritesElement.innerHTML = '';

//   //   favorites.forEach(product => {
//   //     const li = document.createElement('li')
//   //     li.textContent = product
//   //     favoritesElement.appendChild('li')
//   //   });
//   // }
// }

// window.customElements.define("add-to-favorites", AddToFavorites);
