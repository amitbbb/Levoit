class CompareProductsButton extends HTMLElement {
  constructor() {
    super();
    this.button = this.querySelector("button");
    this.productData = JSON.parse(this.button.getAttribute("product-json"));

    // // Get current compare items from local storage or create empty array if none exists
    let comparisons = JSON.parse(localStorage.getItem("comparisons")) || [];

    this.display(comparisons);
  }

  connectedCallback() {
    this.toggleAddRemove();
    this.comparisonRemovedFromBar() 
  }

  getComparisons() {
    return JSON.parse(localStorage.getItem("comparisons")) || [];
  }

  toggleAddRemove() {
    this.button.addEventListener("click", (evt) => {
      // Get current compare items from local storage or create empty array if none exists
      let comparisons = JSON.parse(localStorage.getItem("comparisons")) || [];

      console.log("comparisons", comparisons);
      console.log("this.productData", this.productData);

      // if existing comparisons array in localStorage contains key value pair
      if (
        comparisons.some((obj) =>
          Object.entries(obj).some(
            ([key, value]) => key === "id" && value === this.productData.id
          )
        )
      ) {
        console.log("remove from comparisons", this.productData.id);

        // Create a new array that removes object in existing comparisons array if key value pair exists
        comparisons = comparisons.filter(
          (obj) =>
            !Object.entries(obj).some(
              ([key, value]) => key === "id" && value === this.productData.id
            )
        );

        // Push new array to localStorage and remove active class on button
        localStorage.setItem("comparisons", JSON.stringify(comparisons));
        this.button.classList.remove("is-active");
      } else {
        console.log("add to comparisons", this.productData.id);
        comparisons.push(this.productData);

        // Store updated comparisons in local storage
        localStorage.setItem("comparisons", JSON.stringify(comparisons));

        //add active class to button
        this.button.classList.add("is-active");
      }

      this.button.dispatchEvent(
        new CustomEvent("comparisons-updated", {
          bubbles: true,
          detail: { message: "Comparisons have been updated" },
        })
      );
    });
  }

  display(comparisons) {
    // If the object with key value pair is present in comparisons array in localStorage
    if (
      comparisons !== null &&
      comparisons.some((obj) =>
        Object.entries(obj).some(
          ([key, value]) =>
            key === "id" && value === this.productData.id
        )
      )
    ) {
      this.button.classList.add("is-active");
    } else {
      this.button.classList.remove("is-active")
    }
  }

  comparisonRemovedFromBar() {
    document.addEventListener('comparisons-updated', (evt) => {
      console.log("evt", evt.detail)
      let comparisons = this.getComparisons()
      this.display(comparisons)
    })
  }
}

window.customElements.define("compare-products-button", CompareProductsButton);
