class AddAddressDrawer extends HTMLElement {
  constructor() {
    super();
    this.detailsContainer = this.querySelector('details')
    this.summaryToggle = this.querySelector('summary')
    this.closeButton = this.querySelector('button[type="button"]') 
    this.modalOverlay = this.querySelector('.modal-overlay')
    this.drawerContent = this.querySelector('#drawer-content')


    // animations
    this.animation = null
    this.isClosing = false
    this.isExpanding = false

    this.detailsContainer.addEventListener(
      'keyup',
      (event) => event.code.toUpperCase() === 'ESCAPE' && this.close()
    );

    this.summaryToggle.addEventListener(
      'click',
      this.onSummaryClick.bind(this)
    );

    this.closeButton.addEventListener('click', this.close.bind(this))
    this.modalOverlay.addEventListener('click', this.close.bind(this))

    this.summaryToggle.setAttribute('role', 'button');
  }

  onSummaryClick(event) {
    event.preventDefault();
    // const isOpen = detailsElement.hasAttribute('open');
    

    // if (isOpen) event.preventDefault();
    // isOpen ? this.close(event, summaryElement) : this.open(summaryElement)

    event.target.closest('details').hasAttribute('open') ? this.close() : this.open(event)
  }

  onBodyClick(event) {
    if (!this.contains(event.target) || event.target.classList.contains('modal-overlay')) this.close(false)
  }

  open(event) {
    this.onBodyClick = this.onBodyClickEvent || this.onBodyClick.bind(this);
    event.target.closest('details').setAttribute('open', "");
    document.body.addEventListener('click', this.onBodyClickEvent);
    document.body.classList.add('overflow-hidden');
    
    window.requestAnimationFrame(() => this.openAnimation());
    // trapFocus(
    //   this.detailsContainer.querySelector('[tabindex="-1"]'),
    //   this.detailsContainer.querySelector('input:not([type="hidden"])')
    // );
  }

  openAnimation() {
    this.isExpanding = true;

    if (this.animation) this.animation.cancel();

    this.animation = this.drawerContent.animate({
      transform: ['translateX(-100%)', 'translateX(0)']
    }, {
      duration: 300,
      easing: 'ease-in-out'
    })
    // this.animation.onfinish = () => this.onAnimationFinish(true);
    this.animation.oncancel = () => this.isExpanding = false;
  }

  close(focusToggle = true) {
    // this.detailsContainer.removeAttribute('open')
    // document.body.removeEventListener('click', this.onBodyClickEvent)
    // document.body.classList.remove('overflow-hidden')

    window.requestAnimationFrame(() => this.closeAnimation());
  }

  closeAnimation() {
    this.isClosing = true

    // if (this.animation) this.animation.cancel()

    this.animation = this.drawerContent.animate({
      transform: ['translateX(0)', 'translateX(-100%)']
    }, {
      duration: 300,
      easing: 'ease-out'
    })

    this.animation.onfinish = () => this.onAnimationFinish(false);
    this.animation.oncancel = () => this.isClosing = false;
  }

  onAnimationFinish(open) {
    this.detailsContainer.open = open;
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

window.customElements.define('add-address', AddAddressDrawer);