class TabsComponent extends HTMLElement {
  constructor() {
    super();
    //implementation
    this.tabTriggers = this.querySelectorAll('button[role="tab"]');
    this.details = this.querySelectorAll("details");
    this.settings = this.getAttribute("data-settings");

    this.OPENED;
    this.BREAKPOINT = window.matchMedia("(min-width: 768px)");
    this.PREV_ACTIVE_TAB_TRIGGER = this.querySelector(
      "nav button[role='tab'].is-active"
    );
    console.log("this.PREV_ACTIVE_TAB_TRIGGER", this.PREV_ACTIVE_TAB_TRIGGER);

    console.log("this.settings", this.settings);
  }

  connectedCallback() {
    //implementation
    this.handleSettings();
  }

  handleSettings() {
    if (this.settings === "tab") {
      this.handleTabs();
      return;
    }

    if (this.settings === "accordion") {
      this.handleAccordion();
      return;
    }

    if (this.settings === "mixed") {
      this.handleMixed();
      return;
    }
  }

  handleTabs() {
    console.log("handleTabs");
    this.tabTriggers.forEach((tabTrigger) => {
      tabTrigger.addEventListener("click", (event) => {
        if (this.PREV_ACTIVE_TAB_TRIGGER) {
          this.PREV_ACTIVE_TAB_TRIGGER.classList.remove("is-active");
          this.querySelector(
            `#${this.PREV_ACTIVE_TAB_TRIGGER.getAttribute("aria-controls")}`
          ).removeAttribute("open");
          console.log(
            "panel",
            this.querySelector(
              `#${this.PREV_ACTIVE_TAB_TRIGGER.getAttribute("aria-controls")}`
            )
          );
        }
        console.log("tabTrigger", event.target);
        

        event.target.classList.add("is-active");
        this.querySelector(
          `#${event.target.getAttribute("aria-controls")}`
        ).setAttribute("open", "");
        
        this.PREV_ACTIVE_TAB_TRIGGER = event.target;
        // this.OPENED = this.querySelector("details[open]");
        // this.OPENED.removeAttribute("open");
        // this.querySelector(`#${event.target.getAttribute('aria-controls')}`).setAttribute('open', '')
      });
    });
  }

  handleAccordion() {
    console.log("handleAccordion");
    this.addEventListener(
      "toggle",
      (event) => {
        console.log("toggle", event.target);

        event.target.classList.toggle("open");
        if (!event.target.hasAttribute("open")) return;

        this.OPENED = this.querySelectorAll("details[open]");
        console.log("This.opened", this.OPENED);

        this.OPENED.forEach((detail) => {
          if (detail === event.target) return;
          detail.removeAttribute("open");
        });
      },
      true
    );
  }

  handleMixed() {
    console.log("handleMixed");
    this.handleMixedBreakpoint();

    // this.BREAKPOINT.addEventListener('change', event => {
    //   console.log('event', event) // MediaQueryListEvent
    //   console.log('event.matches', event.matches) // true or false
    //   if (event.matches) {
    //     alert('matches')
    //   } else {
    //     alert('does not match')
    //   }
    // })
    this.BREAKPOINT.addEventListener(
      "change",
      this.handleMixedBreakpoint.bind(this)
    );
  }

  handleMixedBreakpoint() {
    if (this.BREAKPOINT.matches) {
      this.handleTabs();
    } else {
      this.handleAccordion();
    }
  }

  // handleMixedChange(event) {
  //   console.log("event", event); // MediaQueryListEvent
  //   console.log("event.matches", event.matches); // true or false
  //   if (event.matches) {
  //     alert("matches");
  //   } else {
  //     alert("does not match");
  //   }
  // }

  attributeChangedCallback(name, oldVal, newVal) {
    //implementation
  }

  adoptedCallback() {
    //implementation
  }
}

window.customElements.define("tabs-component", TabsComponent);
