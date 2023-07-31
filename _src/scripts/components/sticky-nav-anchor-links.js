class StickyNavAnchorLinks extends HTMLElement {
  constructor() {
    super();
    // Get the element's top position relative to the viewport
    this.height = this.offsetHeight;
    this.scrollThreshold = this.getBoundingClientRect().top;
    this.links = this.querySelectorAll("button");
    console.log("this.scrollThreshold", this.scrollThreshold);
    console.log("this.height", this.height);

    if (this.scrollThreshold < 0) this.scrollThreshold = 100;
  }

  connectedCallback() {
    document.addEventListener("DOMContentLoaded", this.handleScroll.bind(this));

    window.addEventListener("scroll", this.handleScroll.bind(this));

    this.links.forEach((link) => {
      const section = document.getElementById(link.getAttribute("data-target"))

      if (!section) return
      section.style.scrollMarginTop = "80px"

      link.addEventListener("click", (e) => this.handleClick.bind(this)(e));
      // this.highlightOnScroll(section);
    });
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.handleScroll.bind(this));
  }

  handleScroll() {
    if (
      window.scrollY >= this.scrollThreshold 
    ) {
      this.classList.add("is-active");
    } else {
      this.classList.remove("is-active");
    }
  }

  handleClick(e) {
    console.log("click", e.target);
    console.log("click", this);

    // remove class from all links
    this.links.forEach((link) => link.classList.remove('is-active'))

    //add class to e.target link
    e.target.classList.add('is-active')

    const target = document.getElementById(e.target.dataset.target);
    console.log("targetr", target);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        offset: "100px"
      });

      // this.highlightOnScroll(target)
    }
  }

  // highlightOnScroll(section) {

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.target === section) {
  //           if (entry.isIntersecting) {
  //             let section_id = section.getAttribute("id");
  //             section.classList.add("is-active");
  //             console.log("target is intersecting", section);
  //             console.log("entry", entry);

  //             this.links.forEach((link) => link.classList.remove("is-active"));
  //             this.querySelector(`[data-target="${section_id}"]`).classList.add(
  //               "is-active"
  //             );
  //           } else {
  //             section.classList.remove("is-active");
  //             console.log("target is not intersecting", section);
  //           }
  //         }
  //       });
  //     },
  //     // { rootMargin: `0px 0px ${section.offsetHeight}px 0px` }
  //     {
  //       root: null,
  //       rootMargin: "-100% 0px -100px 0px",
  //     }
  //   );
  //   observer.observe(section);
  // }
}

window.customElements.define("sticky-nav-anchor-links", StickyNavAnchorLinks);
