
class AccordionComponent extends HTMLElement {
  constructor() {
    super();
    //implementation
    this.accordions = this.querySelectorAll('details');
  }

  connectedCallback() {
    
    this.addEventListener('toggle', this.accordionHandler.bind(this), true)
  }

  disconnectedCallback() {
    //implementation
  }
  
  accordionHandler(event) {
// event.preventDefault();
    event.target.classList.toggle("open")

    if (!event.target.hasAttribute('open')) return;

    console.log("toggle", event.target);

    // event.target.classList.toggle("open");

    // this.accordions.forEach(accordion => {
      
    // });
    

    this.opened = this.querySelectorAll('details[open]');

    // event.target.classList.toggle("open");

    for (let accordion of this.accordions) {
      if (accordion === event.target) continue;
      accordion.removeAttribute('open')
    }

    // this.accordions.forEach(accordion => {
    //   if (accordion !== event.target) {
    //     accordion.removeAttribute('open');
    //   }
    // } )

  }

  attributeChangedCallback(name, oldVal, newVal) {
    //implementation
  }

  adoptedCallback() {
    //implementation
  }

}

window.customElements.define('accordion-component', AccordionComponent);