class LazyImage extends HTMLElement {
  constructor() {
    super();

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          let img = lazyImage.querySelector('img')

          if (img.dataset.src) img.src = img.dataset.src;
            

          if (img.dataset.srcset) img.srcset = img.dataset.srcset;
         
          lazyImage.classList.add("fade-in")

          observer.unobserve(lazyImage);
        }
      })
    }, {rootMargin: `0px 0px -100px 0px`})

    observer.observe(this);
  }

}

window.customElements.define('lazy-image', LazyImage);