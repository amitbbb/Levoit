class ToggleElement extends HTMLElement {
  constructor() {
    super();
    this.label = this.querySelector("label");
    this.input = this.querySelector('input[type="checkbox"]')
  }

  connectedCallback() {
    this.handleToggle();
  }

  disconnectedCallback() {
    //implementation
  }

  handleToggle() {
    this.label.addEventListener("click", () => {
      this.input.checked = !this.input.checked;
      console.log("checked!")
    });
  }

  attributeChangedCallback(name, oldVal, newVal) {
    //implementation
  }

  adoptedCallback() {
    //implementation
  }
}

window.customElements.define("toggle-element", ToggleElement);
