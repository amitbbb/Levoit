// import { PredictiveSearch } from "./predictive-search";

class SearchComponent extends HTMLElement {
  constructor() {
    super();
    //implementation
    // const details = this.querySelector('details')
    // const summary = details.querySelector('summary')
    // const aside = details.querySelector('aside')
    // const form = this.querySelector('form')

    // document.addEventListener("click", (evt) => {
    //   const isClickInside = details.contains(evt.target)

    //   if (!isClickInside) {
    //     details.removeAttribute('open')
    //   } 
    // })


    // summary.addEventListener('click', (evt) => {
    //   details.setAttribute('open', '')
    // })
    
  }

  show() {

  }

  close() {

  }

  connectedCallback() {
    //implementation
  }

  disconnectedCallback() {
    //implementation
  }

  attributeChangedCallback(name, oldVal, newVal) {
    //implementation
  }

  adoptedCallback() {
    //implementation
  }

}

window.customElements.define('search-component', SearchComponent);