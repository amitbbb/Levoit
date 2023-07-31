class DrawerDialog extends HTMLElement {
  constructor() {
    super();
    this.details = this.querySelector("details");
    this.summary = this.querySelector("summary");
    // this.closeButton = this.querySelector('button[is="close"]')
    this.closeButtons = this.querySelectorAll('button[is="close"]')
    this.modalOverlay = this.querySelector(".modal-overlay");
    this.drawer = this.querySelector("aside");
    // this.cancelButton = this.querySelector('button[type="reset"]')

    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;

    this.summary.setAttribute("role", "button");

    // close with escape
    this.details.addEventListener("keyup", (event) => {
      console.log("eventcode", event.code)
      if (event.code) event.code.toUpperCase() === "ESCAPE" && this.close();
    });


    // event listener on summary click
    this.summary.addEventListener("click", this.onSummaryClick.bind(this));

    // this.closeButton.addEventListener('click', this.close.bind(this))

    this.closeButtons.forEach((button) => button.addEventListener('click', this.close.bind(this)))

    this.modalOverlay.addEventListener("click", this.close.bind(this));

    if (this.cancelbutton) this.cancelbutton.addEventListener("click", this.close.bind(this));
  }

  onSummaryClick(event) {
    event.preventDefault();
    event.target.closest("details").hasAttribute("open")
      ? this.close()
      : this.open(event);
  }

  onBodyClick(event) {
    if (
      !this.contains(event.target) ||
      event.target.classList.contains("modal-overlay")
    )
      this.close(false);
  }

  open() {
    this.onBodyClick = this.onBodyClickEvent || this.onBodyClick.bind(this);
    event.target.closest("details").setAttribute("open", "");
    document.body.addEventListener("click", this.onBodyClickEvent);
    document.body.classList.add("overflow-hidden");
    window.requestAnimationFrame(() => this.openAnimation());
  }

  openAnimation() {
    this.isExpanding = true;
    if (this.animation) this.animation.cancel();

    this.animation = this.drawer.animate({
      transform: ['translateX(-100%)', 'translateX(0)']
    }, {
      duration: 300,
      easing: 'ease-out'
    })
    // this.animation.onfinish = () => this.onAnimationFinish(true);
    this.animation.oncancel = () => this.isExpanding = false;
  }

  close() {
    console.log("CLOSE")
    window.requestAnimationFrame(() => this.closeAnimation());
  }

  closeAnimation() {
    this.isClosing = true

    if (this.animation) this.animation.cancel()

    this.animation = this.drawer.animate({
      transform: ['translateX(0)', 'translateX(-100%)']
    }, {
      duration: 300,
      easing: 'ease-out'
    })

    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => this.isClosing = false;
  }

  onAnimationFinish(open) {
    this.details.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;

    if (!open) {
      // this.detailsContainer.removeAttribute('open')
      document.body.removeEventListener('click', this.onBodyClickEvent)
      document.body.classList.remove('overflow-hidden')
    }
  }
}

window.customElements.define('drawer-dialog', DrawerDialog);