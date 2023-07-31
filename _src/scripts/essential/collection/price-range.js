class PriceRange extends HTMLElement {
  constructor() {
    super();
    //implementation
    const rangeSliderFrom = this.querySelector('.range-group-slider input:first-child')
    const rangeSliderTo = this.querySelector('.range-group-slider input:last-child')
    const inputFrom = this.querySelector('.range-group-input .range-input:first-child input')
    const inputTo = this.querySelector('.range-group-input .range-input:last-child input')

    inputFrom.addEventListener('input', (event) => {
      console.log("event", event.target.value)
      event.target.value = Math.max(Math.min(parseInt(event.target.value), parseInt(inputTo.value || event.target.max) - 1), event.target.min);
      rangeSliderFrom.value = event.target.value
      rangeSliderFrom.parentElement.style.setProperty('--range-min', `${parseInt(rangeSliderFrom.value) / parseInt(rangeSliderFrom.max) * 100}%`)
    })

    inputTo.addEventListener('input', (event) => {
      event.target.value = Math.min(Math.max(parseInt(event.target.value), parseInt(inputFrom.value || event.target.min) + 1), event.target.max);
      rangeSliderTo.value = event.target.value;
      rangeSliderTo.parentElement.style.setProperty('--range-max', `${parseInt(rangeSliderTo.value) / parseInt(rangeSliderTo.max) * 100}%`)
    })

    rangeSliderFrom.addEventListener('change', (event) => {
      inputFrom.value = event.target.value
    })
    rangeSliderTo.addEventListener('change', (event) => {
      inputTo.value = event.target.value
    })

    rangeSliderFrom.addEventListener('input', (event) => {
      event.target.value = Math.min(parseInt(event.target.value), parseInt(inputTo.value || event.target.max) -1)
      inputFrom.value = event.target.value
      event.target.parentElement.style.setProperty("--range-min", `${parseInt(event.target.value) / parseInt(event.target.max) * 100}%`);
    })

    rangeSliderTo.addEventListener('input', (event) => {
      event.target.value = Math.max(parseInt(event.target.value), parseInt(inputFrom.value || event.target.min) + 1)
      inputTo.value = event.target.value
      event.target.parentElement.style.setProperty('--range-max', `${parseInt(event.target.value) / parseInt(event.target.max) * 100}%`)
    })
  }

}

window.customElements.define('price-range', PriceRange);