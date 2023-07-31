import { debounce } from "../base/global";

class DropdownMenu extends HTMLElement {
  constructor() {
    super();
    const details = this.querySelector('details')

    var delay = 150;
    var timeoutId;

    details.addEventListener('mouseenter', () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.open()
      }, delay)
    })
    details.addEventListener('mouseleave', () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.close()
      }, delay)
    })


    // details.addEventListener('mouseenter', () => {
    //   console.log("mouseenter")
    //   this.open()
    // })

    // details.addEventListener('mouseleave', () => {
    //   console.log("mouseleave")
    //   this.close()
    // })
  }

  open() {
    const details = this.querySelector('details')

    details.setAttribute('open', '')
    details.classList.add('is-opening')
    
    
  }
  close() {
    const details = this.querySelector('details')
    details.removeAttribute('open')
    details.classList.remove('is-opening')
   
    
  }

  
}

window.customElements.define('dropdown-menu', DropdownMenu);