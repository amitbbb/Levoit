import { debounce } from "../base/global";

class MegaMenu extends HTMLElement {
  constructor() {
    super();
    //implementation
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    const header = this.closest('#shopify-section-header')

    const detail = this.querySelector('details')
    
    
    var delay = 150;
    var timeoutId;

    this.querySelector('details').addEventListener('mouseenter', () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.open()
      }, delay)
    })
    this.querySelector('details').addEventListener('mouseleave', () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.close()
      }, delay)
    })

 

        
    // this.querySelector('details').addEventListener('mouseenter', () => {
    //   interval = setTimeout(() => {
    //     console.log("mouseenter", this.querySelector('details'))
    //     this.open()
    //   }, 300 );
    // })

    // this.querySelector('details').addEventListener('mouseleave', () => {
    //   interval = setTimeout(() => {
    //     console.log('mouseleave')
    //     this.close()  
    //   }, 300);
      
    // })

       // document.addEventListener('mousemove', debounce((event) => {
    //   console.log("mousemove")
    // }, 300))

    // this.querySelector('details').addEventListener('mouseenter', debounce((event) => {
    //   console.log('mousenter')
    //   clearTimeout(interval)
    //   this.open()
    // }), 300)
    
    // this.querySelector('details').addEventListener('mouseenter', () => {
    //   setTimeout(() => {
    //     console.log("mouseenter", this.querySelector('details'))
    //     this.open()
    //   }, 0);
      
    // })

    // this.querySelector('details').addEventListener('mouseleave', () => {
    //   setTimeout(() => {
    //     console.log("mouseleave", this.querySelector('details'))
    //     this.close()
    //   }, 0);
    // })
    


  }

  open() {
    const detail = this.querySelector('details')
    detail.setAttribute('open', '')
    setTimeout(() => {this.classList.add('is-open')});
    window.requestAnimationFrame(() => this.openAnimation());
    
  }

  close() {
    const detail = this.querySelector('details')
    detail.removeAttribute('open')
    // this.classList.remove('active', 'animate');
    setTimeout(() => {
      this.classList.remove('is-open')
      window.requestAnimationFrame(() => this.closeAnimation());
    });
  }

  openAnimation() {
    // this.isExpanding = true;
    // if (this.animation) this.animation.cancel();

    // this.animation = this.querySelector('.mega-menu__main').animate({
    //   // transform: ['translateY(-100%)', 'translateY(0)'],
    //   visbility: "visible",
    //   opacity: [0,1]
    // }, {
    //   duration: 300,
    //   easing: 'ease-out'
    // })
    // // this.animation.onfinish = () => this.onAnimationFinish(true);
    // this.animation.oncancel = () => this.isExpanding = false;
  }
  
  closeAnimation() {
    // this.isClosing = true

    // if (this.animation) this.animation.cancel()

    // this.animation = this.querySelector('.mega-menu__main').animate({
    //   opacity: [1, 0],
    //   // visbility: "hidden",
    // }, {
    //   duration: 300,
    //   easing: 'ease-out'
    // })

    // this.animation.onfinish = () => this.onAnimationFinish(false);
    // this.animation.oncancel = () => this.isClosing = false;
  }

  onAnimationFinish(open) {
    // this.details.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;

    if (!open) {
      // this.detailsContainer.removeAttribute('open')
      // document.body.removeEventListener('click', this.onBodyClickEvent)
      // document.body.classList.remove('overflow-hidden')
    }
  }
}

window.customElements.define('mega-menu', MegaMenu);
