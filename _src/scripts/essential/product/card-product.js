class CardProduct extends HTMLElement {
  constructor() {
    super();
    this.productMediaArr = this.getAttribute('product-media').split(', ')
  }

  connectedCallback() {
    const fieldset = this.querySelector('fieldset')
    if (!fieldset) return;

    this.addEventListener('change', this.onVariantChange)

  }


  switchImage() {
    const fieldset = this.querySelector('fieldset')
    if (!fieldset) return;
    this.secondaryImagePosition = this.currentVariant.featured_image.position
    // const colorSwatches = fieldset.querySelectorAll('input[type="radio"]')
    const featuredImage = this.querySelector('#CardProduct-Image1').querySelector('img')
    const secondaryImage = this.querySelector('#CardProduct-Image2').querySelector('img')
      

    featuredImage.src = `${this.currentVariant.featured_image.src}&width=600`
    featuredImage.srcset = `${this.currentVariant.featured_image.src}&width=600 320w, ${this.currentVariant.featured_image.src}&width=600 768w, ${this.currentVariant.featured_image.src}&width=600 1280w`

    if (!secondaryImage) return;
    secondaryImage.src = `${this.getSecondaryImage()}&width=600`
    secondaryImage.srcset = `${this.getSecondaryImage()}&width=600 320w, ${this.getSecondaryImage()}&width=600 768w, ${this.getSecondaryImage()}&width=600 1280w`
       
  }

  getSecondaryImage() {
    return this.productMediaArr[this.secondaryImagePosition]
  }

  onVariantChange() {
   console.log("card product change")
   this.updateOptions();
   this.getCurrentVariant()

   this.updateURL()
   this.updateCardID()
   this.updateFavoritesButtonID()
   this.switchImage()
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'))
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value
    })

    console.log("this.options",this.options)
  }

  getCurrentVariant() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        console.log("getCurrentVariant this.options",this.options[index])
        return this.options[index] === option
      }).includes(false)
    })
    console.log("CRAD this.currentVariant", this.currentVariant)
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent)

    console.log("this.variantData card-product",this.variantData)

    return this.variantData;
  }

  updateURL() {
    if (!this.currentVariant) return;

    const links = this.querySelectorAll('a')

    links.forEach(link => {
      link.href = `${this.dataset.url}?variant=${this.currentVariant.id}`   
    });
  }

  updateCardID() {
    if (!this.currentVariant) return;
      this.setAttribute("variant-id", this.currentVariant.id);
  }

  updateFavoritesButtonID() {
    const favoriteButton = this.querySelector('add-to-favorites')
    favoriteButton.setAttribute('variant-id', this.currentVariant.id)
    favoriteButton.setAttribute('variant-color', this.currentVariant.title)
  }

}

window.customElements.define('card-product', CardProduct);