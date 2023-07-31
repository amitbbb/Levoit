import Swiper from "swiper";

import {
  Navigation,
  Pagination,
  A11y,
  Scrollbar,
  Thumbs,
  Keyboard,
} from "swiper/modules";

import BaseSwiper from "../../global/base-swiper";

class ProductGallerySlider extends BaseSwiper {
  constructor() {
    super();
    //implementation
    this.swiperEl = this.querySelector("#ProductGallerySlider-Main");
    this.thumbsEl = this.querySelector("#ProductGallerySlider-Thumbs");
    this.getConfig = JSON.parse(this.getAttribute("slider-config"));
    this.getThumbsConfig = JSON.parse(this.getAttribute("thumbs-config"));
    this.zoomGallery = document.querySelector("pdp-zoom-gallery");

    this.config = {
      modules: [Navigation, Pagination, A11y, Scrollbar, Thumbs, Keyboard],
      ...this.getConfig,
      thumbs: {
        swiper: this.thumbsEl,
      },
      navigation: {
        nextEl: "[swiper-button-next]",
        prevEl: "[swiper-button-prev]",
      },
      pagination: {
        el: "[swiper-pagination]",
        type: "fraction",
      },
      keyboard: {
        enabled: true,
      },
      loop: true,
      on: {
        // click: function() {
        //           //
        //  this.zoomGallery.dataset.realIndex = this.swiper.realIndex;

        // }.bind(this),
        slideChange: function () {
          this.activeSlide = this.swiper.slides[this.swiper.activeIndex];

          // remove is-active attribute from all slides
          this.swiper.slides.forEach((slide) => {
            // add is-active to keen-slider__slide
            slide.removeAttribute("is-active");

            // if slide has video, remove is-active attribute from video
            if (slide.querySelector("lazy-slide-video")) {
              slide
                .querySelector("lazy-slide-video")
                .removeAttribute("is-active");
            }
          });

          // set is-active attribute to current active slide
          this.activeSlide.setAttribute("is-active", "");

          // if slide has video, set is-active attribute to video
          if (this.activeSlide.querySelector("lazy-slide-video")) {
            this.activeSlide
              .querySelector("lazy-slide-video")
              .setAttribute("is-active", "");
          }
        }.bind(this),
      },
    };

    this.thumbsConfig = {
      ...this.getThumbsConfig,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.handleVariantChange();
    this.handleZoom();
  }

  disconnectedCallback() {
    this.swiper.destroy();
    this.thumbs.destroy();
  }

  init() {
    // super.init()
    this.swiper = new Swiper(this.swiperEl, this.config);
    this.thumbs = new Swiper(this.thumbsEl, this.thumbsConfig);
    // const swiper = new Swiper(this.swiperEl, this.config);
  }

  handleVariantChange() {
    document.addEventListener("color-variant:changed", (evt) => {
      //
      // const currentSlideEl = this.querySelector(`[media-id="${evt.detail.featured_media.id}"]`)

      if (!evt.detail.featured_media) return;

      console.log(
        "PRODUCT GALLERY SLIDER MEDIA.id",
        evt.detail.featured_media.id
      );

      const currentSlideEl = this.swiper.el.querySelector(
        `[media-id="${evt.detail.featured_media.id}"]`
      );

      const currentSlideIdx = parseInt(
        currentSlideEl.getAttribute("media-index")
      );

      this.swiper.slideTo(currentSlideIdx);
    });
  }

  handleZoom() {
    this.swiper.slides.forEach((slide, index) => {
      if (slide.querySelector("img"))
        slide
          .querySelector("img")
          .addEventListener(
            "click",
            () => (this.zoomGallery.dataset.realIndex = this.swiper.realIndex)
          );
      if (slide.querySelector("video"))
        slide
          .querySelector("video")
          .addEventListener(
            "click",
            () => (this.zoomGallery.dataset.realIndex = this.swiper.realIndex)
          );
    });
  }
}

window.customElements.define("product-gallery-slider", ProductGallerySlider);
