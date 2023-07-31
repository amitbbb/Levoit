import {
  Navigation,
  Pagination,
  A11y,
  Scrollbar,
  Zoom,
  Keyboard,
} from "swiper/modules";

import BaseSwiper from "../../global/base-swiper";

import { trapFocus, removeTrapFocus } from "../../base/global";

class PdpZoomGallery extends BaseSwiper {
  constructor() {
    super();
    this.trigger = document.querySelector("[pdp-zoom-gallery-trigger]");
    this.IS_ZOOMED = false;
    this.INDEX = this.getAttribute("data-real-index");
    this.closeBtn = this.querySelector("[close-button]");
    this.getConfig = JSON.parse(this.getAttribute("slider-config"));

    this.config = {
      modules: [Navigation, Pagination, A11y, Scrollbar, Zoom, Keyboard],
      ...this.getConfig,
      // initialSlide: this.ACTIVE_INDEX,
      scrollbar: {
        el: ".swiper-scrollbar",
        hide: false,
      },
      zoom: true,
      navigation: {
        nextEl: "[swiper-button-next]",
        prevEl: "[swiper-button-prev]",
      },
      pagination: {
        el: "[swiper-pagination]",
        type: "fraction",
      },
      keyboard: {
        enabled: false,
      },
      a11y: {
        enabled: true,
        prevSlideMessage: "Previous slide",
        nextSlideMessage: "Next slide",
        firstSlideMessage: "This is the first slide",
        lastSlideMessage: "This is the last slide",
        paginationBulletMessage: "Go to slide {{index}}",
      },
      on: {
        click: function () {
          if (!this.IS_ZOOMED) {
            this.zoom.in();
            this.IS_ZOOMED = true;
          } else {
            this.zoom.out();
            this.IS_ZOOMED = false;
          }
        },
      },
    };
    console.log("this.closeBtn", this.closeBtn);

    this.firstFocusableElement = this;
    this.lastFocusableElement = this;
  }

  connectedCallback() {
    // if (this.hasAttribute("data-real-index")) {
    //   this.IS_ZOOMED = false;
    //   this.init();
    //   this.show();
    // }

    this.IS_ZOOMED = false;
    this.init();
    // this.show();

    this.closeBtn.addEventListener("click", () => {
      this.close.bind(this)();
    });
  }

  disconnectedCallback() {
    if (this.swiper) this.swiper.destroy();
  }

  show() {
    console.log("Show()", this);
    this.classList.add("is-active");
    document.body.classList.add("overflow-hidden");

    this.swiper.keyboard.enable();
    this.swiper.on("keyPress", (swiper, eventKey) => {
      switch (eventKey) {
        case 27:
          console.log("KEYPRESS ESC");
          this.close();
      }
    });
  }

  // onKeyUpEscape() {
  //   this.addEventListener("keyup", (evt) => {
  //     console.log("KEYUP");
  //     if (evt.code.toUpperCase() !== "ESCAPE") return;

  //     console.log("ESC");
  //     this.close();
  //   });
  // }

  close() {
    trapFocus(document.querySelector("product-gallery-slider"));
    // if (this.IS_ZOOMED) this.swiper.zoom.out();
    // this.IS_ZOOMED = false;
    // this.swiper.destroy();

    // removeTrapFocus(this)
    this.IS_ZOOMED = false;
    this.swiper.zoom.out();
    this.swiper.keyboard.disable();

    this.classList.remove("is-active");
    document.body.classList.remove("overflow-hidden");

    console.log("ZOOM SWIPER CLOSE()", this.swiper);
  }

  init() {
    super.init();
    console.log("ZOOM Slider INIT()", this.swiper);

    this.activeSlide = this.swiper.slides[this.swiper.activeIndex];
    console.log("====> ACTIVE SLIDE", this.activeSlide);

    // set is-active attribute to current active slide
    this.activeSlide.setAttribute("is-active", "");

    // if slide has video, set is-active attribute to video
    if (this.activeSlide.querySelector("lazy-slide-video")) {
      this.activeSlide
        .querySelector("lazy-slide-video")
        .setAttribute("is-active", "");
    }

    this.onSlideChange();
  }

  onSlideChange() {
    this.swiper.on("slideChange", () => {
      console.log("slidechanged", this.swiper);
      this.activeSlide = this.swiper.slides[this.swiper.activeIndex];
      console.log(" ====> SLIDE CHANGED ACTIVE SLIDE", this.activeSlide);
      // remove is-active attribute from all slides
      this.swiper.slides.forEach((slide) => {
        slide.removeAttribute("is-active");
        if (slide.querySelector("lazy-slide-video")) {
          slide.querySelector("lazy-slide-video").removeAttribute("is-active");
        }
      });
      // add is-active attribute to current active slide
      this.activeSlide.setAttribute("is-active", "");
      if (this.activeSlide.querySelector("lazy-slide-video")) {
        this.activeSlide
          .querySelector("lazy-slide-video")
          .setAttribute("is-active", "");
      }
    });
  }

  static get observedAttributes() {
    return ["data-real-index"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "data-real-index") {
      // if (this.swiper) this.swiper.destroy()
      console.log("CHANGED", newVal);
      this.INDEX = newVal;
      // this.config.initialSlide = this.INDEX;
      // this.swiper.params.keyboard.enabled = true;
      this.swiper.activeIndex = this.INDEX;
      this.swiper.update();

      console.log("attributeChangedCallback", this.swiper);

      // this.init();
      this.show();
    }
  }
}

window.customElements.define("pdp-zoom-gallery", PdpZoomGallery);
