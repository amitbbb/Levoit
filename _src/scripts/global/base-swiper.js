// import Swiper from "swiper";
import Swiper from "swiper";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";

export default class BaseSwiper extends HTMLElement {
  constructor() {
    super();
    this.swiperEl = this.querySelector(".swiper");
    this.getConfig = JSON.parse(this.getAttribute("slider-config"));
    console.log("this.getConfig", this.getConfig);
    this.LOAD_WHEN_IN_VIEW = this.hasAttribute("load-when-in-view");
    this.DISABLE_ON_BREAKPOINT = this.hasAttribute("disable-on-breakpoint");
    this.BREAKPOINT = parseInt(this.getAttribute("disable-on-breakpoint"));
    this.LOADED = false;
    this.swiperNav = this.querySelector("[swiper-nav]");
    this.config = {
      modules: [Navigation, Pagination, A11y, Autoplay],
      a11y: {
        enabled: true,
        prevSlideMessage: "Previous slide",
        nextSlideMessage: "Next slide",
        firstSlideMessage: "This is the first slide",
        lastSlideMessage: "This is the last slide",
        paginationBulletMessage: "Go to slide {{index}}",
      },
      navigation: {
        nextEl: this.querySelector("[swiper-button-next]"),
        prevEl: this.querySelector("[swiper-button-prev]"),
      },
      pagination: {
        el: this.querySelector("[swiper-pagination]"),
        type: "fraction",
      },
      ...this.getConfig,
    };

    if (Shopify.designMode) {
      console.log("DEISNG MODE");
      document.addEventListener("shopify:section:load", () => {
        if (this.swiper) this.swiper.destroy();
        this.connectedCallback();
      });
    }
  }

  connectedCallback() {
    if (this.DISABLE_ON_BREAKPOINT) {
      this.setAttribute("disabled", "");
      this.handleResize();
      window.addEventListener("resize", this.handleResize.bind(this));
      return;
    }
    if (!this.LOAD_WHEN_IN_VIEW) this.init();
    if (this.LOAD_WHEN_IN_VIEW) this.observer();
  }

  disconnectedCallback() {
    if (this.swiper) this.swiper.destroy();
    if (this.intersectionObserver) this.intersectionObserver.disconnect();
  }

  init() {
    // this.LOADED = true;
    this.swiper = new Swiper(this.swiperEl, this.config);

    console.log("==> INIT SWIPER", this.swiper);
  }
  

  handleResize() {
    const windowWidth = window.innerWidth;

    if (windowWidth > this.BREAKPOINT && this.LOADED) {
      this.setAttribute("disabled", "");
      if (this.swiper) {
        this.swiper.destroy();
        console.log("====>this.swiper.destroy();");
        this.LOADED = false;
        this.swiperNav.classList.add('hidden')

      }
      
    }

    if (windowWidth < this.BREAKPOINT && !this.LOADED) {
      this.removeAttribute("disabled");
      // if (this.swiper) this.swiper.enable();
      this.swiperNav.classList.remove("hidden");
      this.init()
      
      this.LOADED = true;

      console.log("=======> handling breakpoints", this.LOADED, this.swiper);



    }
  }

  handleObserver(entries, observer) {
    if (!entries[0].isIntersecting) return;
    observer.unobserve(this);

    if (!entries[0].isIntersecting) return;
    observer.unobserve(this);
    this.swiperEl = this.querySelector(".swiper");
    // this.getConfig = JSON.parse(this.getAttribute("slider-config"));
    console.log("BASESWIPER handleObserver() config", this.config);
    // this.config = {
    //   modules: [Navigation, Pagination, A11y],
    //   a11y: {
    //     enabled: true,
    //     prevSlideMessage: "Previous slide",
    //     nextSlideMessage: "Next slide",
    //     firstSlideMessage: "This is the first slide",
    //     lastSlideMessage: "This is the last slide",
    //     paginationBulletMessage: "Go to slide {{index}}",
    //   },
    //   navigation: {
    //     nextEl: this.querySelector("[swiper-button-next]"),
    //     prevEl: this.querySelector("[swiper-button-prev]"),
    //   },
    //   pagination: {
    //     el: this.querySelector("[swiper-pagination]"),
    //     type: "fraction",
    //   },
    //   ...this.getConfig,
    // };
    this.init();
  }

  observer() {
    const options = {
      rootMargin: "0px 0px -30px 0px",
    };
    this.intersectionObserver = new IntersectionObserver(
      this.handleObserver.bind(this),
      options
    );
    this.intersectionObserver.observe(this);
  }
}

// window.customElements.define("init-swiper", InitSwiper);
