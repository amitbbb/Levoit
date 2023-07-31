import { trapFocus, removeTrapFocus } from "../base/global";

class ModalComponent extends HTMLElement {
  constructor() {
    super();
    this.details = this.querySelector("details");
    this.summary = this.querySelector("summary");
    this.aside = this.querySelector("aside");
    this.closeButton = this.querySelector("button[close-button]");
  }

  connectedCallback() {
    this.summary.addEventListener("click", this.onClick.bind(this));
    this.details.addEventListener(
      "keyup",
      (event) => event.code.toUpperCase() === "ESCAPE" && this.close()
    );
    this.closeButton.addEventListener("click", () => this.close());
  }

  onClick(event) {
    event.preventDefault();

    event.target.closest("details").hasAttribute("open")
      ? this.close()
      : this.open(event);
  }

  isOpen() {
    return this.details.hasAttribute("open");
  }

  // onBodyClick(event) {
  //   if (!this.contains(event.target) || event.target.classList.contains('modal-overlay')) this.close(false);
  // }

  open(event) {
    // this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
    event.target.closest("details").setAttribute("open", true);
    document.body.classList.add("overflow-hidden");

    trapFocus(this.aside);
  }

  close(focusToggle = true) {
    removeTrapFocus(focusToggle ? this.summary : null);
    this.details.removeAttribute("open");
    // document.body.removeEventListener('click', this.onBodyClickEvent);
    document.body.classList.remove("overflow-hidden");
  }
}

window.customElements.define("modal-component", ModalComponent);
