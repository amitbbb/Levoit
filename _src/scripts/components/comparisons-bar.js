class ComparisonsBar extends HTMLElement {
  constructor() {
    super();
    this.expandBtn = this.querySelector("button[expand-bar-btn]");
    this.classes = this.classList
    this.compareCount = this.querySelector('[compare-count]')
    this.content = this.querySelector('aside')
    this.heading = this.querySelector('[heading]')
    console.log("this,ehading", this.heading)
    //implementation
    console.log("GET COMPARISONS", this.getComparisons());

    this.getHeight();
    this.initialRender();
    this.clearAll();
  }

  connectedCallback() {
    this.onChange();
    this.expandBtn.addEventListener('click', () => this.toggleExpand());
    window.addEventListener('resize', () => this.getHeight())
  }

  getHeight() {
    if (window.innerWidth > 1024 ) {
      this.contentHeight = this.content.clientHeight + "px";
    } else {
      this.contentHeight = this.heading.clientHeight + this.expandBtn.clientHeight + "px";
    }
    
    console.log("this.contentHeight", this.contentHeight)
    document.documentElement.style.setProperty('--comparisons-bar-height', this.contentHeight)
  }

  toggleExpand() {
    console.log("ehllo", this.classes);

    // return if comparisons bar isnt active
    if (!this.classList.contains('is-active')) return;

    if (this.classList.contains('is-expanded')) {
      this.classList.remove('is-expanded')
      this.expandBtn.querySelector('svg').classList.remove('rotate-180')
    } else {
      this.classList.add('is-expanded')
      this.expandBtn.querySelector("svg").classList.add("rotate-180");
    }

  }

  getComparisons() {
    return JSON.parse(localStorage.getItem("comparisons"));
  }

  initialRender() {
    if (this.getComparisons() !== null && this.getComparisons().length > 0) {
      // console.log("getComparisons full", this.getComparisons)
      let updatedComparisonsArray = this.getComparisons();
      this.classList.add("is-active");
      this.renderHtml(updatedComparisonsArray);
      this.compareCount.textContent = this.getComparisons().length;
    } else
      // console.log("getComparisons empty", this.getComparisons())
      this.classList.remove("is-active");

      if (!this.classList.contains('is-expanded')) return;
      this.classList.remove('is-expanded')

      if (!this.expandBtn.querySelector("svg").contains("rotate-180")) return
      this.expandBtn.querySelector("svg").classList.remove("rotate-180");
  }

  onChange() {
    document.addEventListener("comparisons-updated", (evt) => {
      console.log("comparisons updated event", evt.detail.message);
      let updatedComparisonsArray = this.getComparisons();

      console.log("updatedComparisonsArray", updatedComparisonsArray);

      if (this.getComparisons().length > 0) {
        this.classList.add("is-active");
        this.renderHtml(updatedComparisonsArray);
        this.updateCount()
      } else {
        this.classList.remove("is-active");

        if (!this.classList.contains("is-expanded")) return;
        this.classList.remove('is-expanded')
        // this.renderHtml(updatedComparisonsArray)

        if (!this.expandBtn.querySelector("svg").classList.contains("rotate-180")) return;
        this.expandBtn.querySelector("svg").classList.remove("rotate-180");
        console.log("TEST")
      }
    });
  }

  updateCount() {
    console.log('count', this.getComparisons().length)
    this.compareCount.textContent = this.getComparisons().length;
  }

  renderHtml(updatedComparisonsArray) {
    console.log("render html", updatedComparisonsArray);
    const listEl = this.querySelector("ul");
    const html = updatedComparisonsArray
      .map(
        (item) => `
      <li>
        <button remove-item product-id='${item.id}'><img src='https://cdn.shopify.com/s/files/1/0548/9265/8743/files/clear-btn.svg' /></button>
        <img class='comparisons-bar__product-img' src='${item.featured_image}&width=100' />
        <p>${item.title}</p>
      </li>`
      )
      .join("");
    listEl.innerHTML = html;

    this.removeItem(updatedComparisonsArray);
  }

  removeItem(updatedComparisonsArray) {
    const removeItemButtons = this.querySelectorAll("[remove-item]");
    console.log("removeItemButtons", removeItemButtons);

    removeItemButtons.forEach((btn) => {
      const btnProductId = btn.getAttribute("product-id");
      btn.addEventListener("click", (evt) => {
        if (
          updatedComparisonsArray.some((obj) =>
            Object.entries(obj).some(
              ([key, value]) => key === "id" && value === btnProductId
            )
          )
        ) {
          console.log("remove from comparisons", btnProductId);

          // Create a new array that removes object in existing comparisons array if key value pair exists
          updatedComparisonsArray = updatedComparisonsArray.filter(
            (obj) =>
              !Object.entries(obj).some(
                ([key, value]) => key === "id" && value === btnProductId
              )
          );

          // Push new array to localStorage and remove active class on button
          localStorage.setItem(
            "comparisons",
            JSON.stringify(updatedComparisonsArray)
          );

          btn.dispatchEvent(
            new CustomEvent("comparisons-updated", {
              bubbles: true,
              detail: {
                message: `Comparison bar item removed ${btnProductId}`,
                productId: btnProductId,
              },
            })
          );

          // document.querySelector('compare-products-button').querySelector(`button[product-id='${btnProductId}']`).classList.remove('is-active')

          // const compareProductsButtons = document.querySelectorAll(`compare-products-button`)

          // console.log("compareProductsButtons",compareProductsButtons)
        }

        this.renderHtml(updatedComparisonsArray);
      });
    });
  }

  clearAll() {
    const clearAllButton = this.querySelector("button[clear-all]");

    console.log("clearAllButton", clearAllButton);

    // document.addEventListener('comparisons-updated', (evt) => {
    //   // let comparisonsArray = this.getComparisons()
    //   // console.log("CLEARALL comparisons array", comparisonsArray)

    //   clearAllButton.addEventListener('click', (evt) => {
    //     comparisonsArray = []
    //     localStorage.setItem('comparisons', JSON.stringify(comparisonsArray))
    //   })
    // })
    clearAllButton.addEventListener("click", (evt) => {
      console.log("click");
      let updatedComparisonsArray = [];
      localStorage.setItem(
        "comparisons",
        JSON.stringify(updatedComparisonsArray)
      );

      clearAllButton.dispatchEvent(
        new CustomEvent("comparisons-updated", {
          bubbles: true,
          detail: { message: "Comparisons cleared" },
        })
      );
      this.onChange();
      // this.classList.remove('is-expanded')
    });
  }
}

window.customElements.define('comparisons-bar', ComparisonsBar);