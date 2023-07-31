import BaseSwiper from "../../global/base-swiper";
import {
  Navigation,
  Pagination,
  A11y
} from "swiper/modules";


class ProductRecommendations extends BaseSwiper {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  handleObserver(entries, observer) {
    // super.handleObserver(entries, observer);

    if (!entries[0].isIntersecting) return;
    observer.unobserve(this);

      fetch(this.dataset.url)
        .then((response) => response.text())
        .then((text) => {
          const html = document.createElement("div");
          html.innerHTML = text;
          const recommendations = html.querySelector("product-recommendations");

          if (recommendations && recommendations.innerHTML.trim().length) {
            this.innerHTML = recommendations.innerHTML;

            this.swiperEl = this.querySelector(".swiper");
            this.getConfig = JSON.parse(this.getAttribute("slider-config"));
             this.config = {
               modules: [Navigation, Pagination, A11y],
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
           
           

            console.log("HELLO ------ SIPWER EL", this.swiper);
            this.init();
          }

          // if (
          //   !this.querySelector("slideshow-component") &&
          //   this.classList.contains("complementary-products")
          // ) {
          //   this.remove();
          // }

          // if (html.querySelector(".recommendation-item")) {
          //   this.classList.add("product-recommendations--loaded");
          // }

          // this.init();
        })
        .catch((e) => {
          console.error(e);
        });
  }

  observer() {
    super.observer();

    // const handleObserver = (entries, observer) => {
    //   if (!entries[0].isIntersecting) return;
    //   observer.unobserve(this);

    //   fetch(this.dataset.url)
    //     .then((response) => response.text())
    //     .then((text) => {
    //       const html = document.createElement("div");
    //       html.innerHTML = text;
    //       const recommendations = html.querySelector("product-recommendations");

    //       if (recommendations && recommendations.innerHTML.trim().length) {
    //         this.innerHTML = recommendations.innerHTML;
    //         this.swiperEl = this.querySelector(".swiper");

    //         console.log("HELLO ------ SIPWER EL", this.swiper);
    //         this.init();
    //       }

    //       // if (
    //       //   !this.querySelector("slideshow-component") &&
    //       //   this.classList.contains("complementary-products")
    //       // ) {
    //       //   this.remove();
    //       // }

    //       // if (html.querySelector(".recommendation-item")) {
    //       //   this.classList.add("product-recommendations--loaded");
    //       // }

    //       // this.init();
    //     })
    //     .catch((e) => {
    //       console.error(e);
    //     });
    // };

    // this.intersectionObserver.observe(this);

    // new IntersectionObserver(observer.bind(this), {
    //   rootMargin: "0px 0px -30px 0px",
    // }).observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }
  init() {
    super.init();
    console.log("PRODUCTREC SWIPER", this.swiper);
  }
}

customElements.define("product-recommendations", ProductRecommendations);
