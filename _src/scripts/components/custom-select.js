class CustomSelect extends HTMLElement {
  constructor() {
    super();
      const selectedLabel = this.querySelector('.selected-label')
      const selectedValue = this.querySelector('input:checked')
      const radios = this.querySelectorAll('input')
      const detail = this.querySelector('details')

      document.addEventListener("click", (event) => {
        const isClickInside = detail.contains(event.target)

        if (!isClickInside) {
          detail.removeAttribute('open')
        }
      })

      radios.forEach((radio, index) => {
        radio.addEventListener('click', () => {
          selectedLabel.textContent = radio.getAttribute('title')
          detail.removeAttribute('open')
        })
      })
    }

}

window.customElements.define('custom-select', CustomSelect);