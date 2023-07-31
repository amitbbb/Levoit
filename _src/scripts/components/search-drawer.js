import { DetailsDrawer } from "./details-drawer";

class SearchDrawer extends DetailsDrawer {
  constructor() {
    super();
    //implementation
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

window.customElements.define('search-drawer', SearchDrawer);