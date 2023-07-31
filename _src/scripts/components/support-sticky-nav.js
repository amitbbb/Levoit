class SupportStickyNav extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const triggers = this.querySelectorAll('button')
    const sections = document.querySelector("#SupportPage-Main").querySelectorAll("h3")

    // triggers[0].classList.add("is-active")
    this.scrollIntoView()

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const target = entry.target
        console.log("target", target)
        if (entry.isIntersecting) {
          console.log("is intersectiong", entry.target)
          triggers.forEach(trigger => {
            trigger.classList.remove('is-active')
            if (trigger.textContent.trim() === entry.target.textContent.trim()) {
              console.log("SDFSDFSDFSD TRIGGER", trigger)

              trigger.classList.add('is-active')
            }
          });
        } 
        // else {
        //   console.log("isnt intersectiong", entry.target)
        //   triggers.forEach(trigger => {
        //     if (trigger.textContent === entry.target.textContent) {
        //       trigger.classList.remove('is-active')
        //     }
        //   });

        // }
      })
    }, {rootMargin: "0% 0% -95% 0%"})
    // }, {rootMargin: "-20% 0% -80% 0%"})

    sections.forEach((section) => {
      observer.observe(section);
     
    });
  }

  scrollIntoView() {
    const triggers = this.querySelectorAll('button')
    const sections = document.querySelector("#SupportPage-Main").querySelectorAll("h3")

    console.log("sections", sections)

    triggers.forEach(trigger => {
      trigger.addEventListener('click', ()=> {
        sections.forEach(section => {
          console.log("trigger.textContent", trigger.textContent.trim())
          if(section.textContent.trim() === trigger.textContent.trim()) {
            section.scrollIntoView({behavior: 'smooth'})
          }
        });
      })
    });
  }
}

window.customElements.define('support-sticky-nav', SupportStickyNav);