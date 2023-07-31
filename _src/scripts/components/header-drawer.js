import { MenuDrawer } from "./menu-drawer";
import { removeTrapFocus, trapFocus } from "../base/global";

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
    this.header =
      this.header || document.getElementById("shopify-section-header");
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening");
      summaryElement.setAttribute("aria-expanded", true);
      trapFocus(this.mainDetailsToggle, summaryElement);
    });
  }

  closeMenuDrawer(event, elementToFocus, summaryElement) {
    super.closeMenuDrawer(event, elementToFocus);
    // this.header.classList.remove('menu-open');
    super.querySelector('summary').setAttribute("aria-expanded", false);
  }
}

window.customElements.define("header-drawer", HeaderDrawer);
