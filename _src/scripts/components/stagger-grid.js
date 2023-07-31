class StaggerGrid extends HTMLElement {
  constructor() {
    super();
    //implementation

    const targets = [...this.querySelectorAll('[stagger-item]')]
    console.log("targets", targets)
    
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const duration = reducedMotion ? .01 : 400
    const stagger = reducedMotion ? 0 : 50

    const observer = new IntersectionObserver((entries, observer, index) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {

          console.log("entrytraget", entry.target)


          entry.target.animate(
            {
              transform: ["translateY(1rem)", "translateY(0)"],
              opacity: [0, 1],
              easing: "ease-out",
            },
            {
              duration: 500,
              fill: "both",
              delay: duration * 0.5 + index * stagger,
            }
          );
          entry.target.classList.add('animated')

          observer.unobserve(entry.target);
        }
      })
    }, {rootMargin: `0px 0px -100px 0px`})
    

    targets.forEach((target, index) => {
      console.log("target", target)
      observer.observe(target, index);
    })



  
    
    // targets.forEach((target, index) => {
    //   console.log("target", target)
    //   target.animate({
    //     transform: ['translateY(1rem)', 'translateY(0)'],
    //     opacity: [0, 1],
    //     easing: 'ease-out',
    //   }, {
    //     duration: 500,
    //     fill: 'both',
    //     delay: 400 * .5 + index * 50,
    //   })
    // });

  }


}

window.customElements.define('stagger-grid', StaggerGrid);