import BaseSwiper from "../global/base-swiper";

class SwiperSlider extends BaseSwiper {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.connectedCallback();
  }

  init() {
    super.init();
  }

}

window.customElements.define('swiper-slider', SwiperSlider);






// // import Swiper from "swiper";
// import Swiper from "swiper";

// import {
//   Navigation,
//   Pagination,
//   A11y,
//   Autoplay,
//   EffectFade,
// } from "swiper/modules";


// class SwiperSlider extends HTMLElement {
//   constructor() {
//     super();
//     //get config from attribute
//     this.getConfig = JSON.parse(this.getAttribute("slider-config"));
//     console.log("this.getConfig", this.getConfig);

//     //get show autoplay progress from attribute
//     this.showAutoplayProgress = this.hasAttribute("show-autoplay-progress");
//     console.log("this.showAutoplayProgress", this.showAutoplayProgress);

//     //get slides legnth from attribute
//     this.slidesLength = parseInt(this.getAttribute("slides-length"));

//     //get modules from attribute
//     this.getModules = this.getAttribute("modules");
//     console.log("this.getModules", this.getModules);

//     this.swiperEl = this.querySelector(".swiper");

//     if (this.getModules) {
//       this.modulesArray = this.getModules.split(", ");

//       //create module array
//       this.modules = [];

//       if (this.getModules.includes("Navigation")) {
//         this.modules.push(Navigation);
//       }
//       if (this.getModules.includes("Pagination")) {
//         this.modules.push(Pagination);
//       }
//       if (this.getModules.includes("A11y")) {
//         this.modules.push(A11y);
//       }
//       if (this.getModules.includes("Autoplay")) {
//         this.modules.push(Autoplay);
//       }
//       if (this.getModules.includes("EffectFade")) {
//         this.modules.push(EffectFade);
//       }
//       console.log("this.modules", this.modules);
//     }
    

//     //if show autoplay progress is true, create progress object
//     if (this.showAutoplayProgress && this.slidesLength > 1) {
//       const progressCircle = this.querySelector(".autoplay-progress svg");
//       const progressContent = this.querySelector(".autoplay-progress span");

//       // this.autoplayProgress = {
//       //   autoplayTimeLeft(s, time, progress) {
//       //     progressCircle.style.setProperty("--progress", 1 - progress);
//       //     progressContent.textContent = `${Math.ceil(time / 1000)}s`;
//       //   },
//       // };
//       // this.autoplayProgress = autoplayTimeLeft(s, time, progress) {
//       //     progressCircle.style.setProperty("--progress", 1 - progress);
//       //     progressContent.textContent = `${Math.ceil(time / 1000)}s`;
//       //   }
//     }

//     //create config object
//     this.config = {
//       modules: this.modules,
//       ...this.getConfig,
//       // on: this.autoplayProgress ? this.autoplayProgress : null,
//       on: {
//         init: function () {
//           console.log("swiper initialized");
//         },
//         disable: function() {
//           console.log("swiper disabled", this)
//           this.el.closest('swiper-slider').setAttribute('disabled', '')
//           // this.destroy(false, true)
//           this.activeIndex = 0
//           // console.log("this.destroy(false, true)", this.destroy(false, true));
          
//         },
//         enable: function() {
//           console.log("swiper enabled", this)
//           // this.init()
//           if (this.el.closest('swiper-slider').hasAttribute('disabled')) {
//             this.el.closest('swiper-slider').removeAttribute('disabled')
//           }
//           // this.el.init(this.el);
//           // this.init(this.el)
//         }
        
//       }
//     };
//     console.log("this.config", this.config);

//     const swiper = new Swiper(this.swiperEl, this.config);

//     // swiper.destroy(false, true)
//   }

//   connectedCallback() {
//     //implementation
//   }

//   disconnectedCallback() {
    
//   }

//   attributeChangedCallback(name, oldVal, newVal) {
//     //implementation
//   }

//   adoptedCallback() {
//     //implementation
//   }

// }

// window.customElements.define("swiper-slider", SwiperSlider);