import KeenSlider from "keen-slider";
// import "keen-slider/keen-slider.min.css";

export class SliderComponent extends HTMLElement {
  constructor() {
    super();
    const config = JSON.parse(this.getAttribute("slider-config"));
    console.log("config", config);
    // const useResizePlugin = this.getAttribute("resize-plugin");
    // const useNavigation = this.getAttribute("navigation");
    // const useAutoPlay = this.getAttribute("autoplay");
    this.useNavigation = this.getAttribute("navigation");
    this.useAutoPlay = this.getAttribute("autoplay");
    this.lazyload = this.getAttribute("lazyload");
    // this.useResizePlugin = this.getAttribute("resize-plugin");

    // let plugins = [];

    // if (useNavigation && !useAutoPlay)
    //   (plugins = [this.navigation, this.resizePlugin]), console.log("a");
    // if (!useNavigation && useAutoPlay)
    //   (plugins = [this.autoPlay, this.resizePlugin]), console.log("b");
    // if (!useNavigation && !useAutoPlay)
    //   (plugins = [this.resizePlugin]), console.log("c");
    // if (useNavigation && useAutoPlay)
    //   (plugins = [this.navigation, this.autoPlay, this.resizePlugin]),
    //     console.log("d");

    if (Shopify.designMode) {
      console.log("DEISNG MODE")
      document.addEventListener('shopify:section:load', () => {
         var slider = new KeenSlider(this, config, plugins);
      });
    }

    const plugins = [
      this.navigation,
      this.resizePlugin,
      this.autoPlay,
      this.setActiveSlide,
    ];

    if (this.lazyload === false || this.lazyload === "false") {
      console.log("LAZYLOAD FALSE");
      var slider = new KeenSlider(this, config, plugins);
    } else {
      const handleIntersection = (entries, observer) => {
        if (!entries[0].isIntersecting) return;
        observer.unobserve(this);

        var slider = new KeenSlider(this, config, plugins);
      };

      new IntersectionObserver(handleIntersection.bind(this), {
        rootMargin: "0px 0px 100px 0px",
      }).observe(this);
    }
  }

  connectedCallback() {
    // const plugins = [
    //   this.navigation,
    //   this.resizePlugin,
    //   this.autoPlay,
    //   this.setActiveSlide,
    // ];
    // const handleIntersection = (entries, observer) => {
    //   if (!entries[0].isIntersecting) return;
    //   observer.unobserve(this);
    //   var slider = new KeenSlider(this, config, plugins);
    // };
    // new IntersectionObserver(handleIntersection.bind(this), {
    //   rootMargin: "0px 0px -30px 0px",
    // }).observe(this);
  }

  setActiveSlide(slider) {
    slider.on("created", (slide) => {
      slide.slides[0].setAttribute("is-active", "");
    });
    slider.on("slideChanged", (slide) => {
      const currentSlide = slide.track.details.rel;
      slide.slides.forEach((s) => {
        // add is-active to keen-slider__slide
        s.removeAttribute("is-active");

        // if keen-slider__slide has child element lazy-slide-video, remove is-active attribute from all
        if (s.querySelector("lazy-slide-video")) {
          s.querySelector("lazy-slide-video").removeAttribute("is-active");
        }
      });

      //set is-active attribute to current active keen-slider__slide
      slide.slides[currentSlide].setAttribute("is-active", "");

      //set is-active attribute to current active lazy-slide-video
      if (slide.slides[currentSlide].querySelector("lazy-slide-video")) {
        slide.slides[currentSlide]
          .querySelector("lazy-slide-video")
          .setAttribute("is-active", "");
      }
    });
  }

  resizePlugin(slider) {
    const observer = new ResizeObserver(function () {
      slider.update();
    });

    slider.on("created", () => {
      observer.observe(slider.container);
    });
    slider.on("destroyed", () => {
      observer.unobserve(slider.container);
    });
  }

  navigation(slider) {
    console.log("slider", slider);
    if (!slider.container.getAttribute("navigation")) return;

    // console.log("navigation", slider.container.getAttribute('navigation'))
    const navigationConfig = slider.container.getAttribute("navigation");

    const arrowLeft = slider.container.querySelector("[arrow-left]");
    const arrowRight = slider.container.querySelector("[arrow-right]");

    const dotsWrapper = slider.container.querySelector(".dots");

    // console.log("arrowLeft", arrowLeft)
    // const arrowLeft = this.querySelector('.arrow--left')

    slider.on("created", () => {
      if (navigationConfig === "arrows" || navigationConfig == "full") {
        console.log("arrowLeft", arrowLeft);
        arrowLeft.addEventListener("click", () => {
          slider.prev();
        });
        arrowRight.addEventListener("click", () => {
          slider.next();
        });
      }

      if (navigationConfig == "dots" || navigationConfig == "full") {
        const slides =
          slider.track.details.slides.length -
          Math.round(slider.options.slides.perView);
        console.log(
          "DOTS (slider.track.details.slides",
          slider.track.details.slides
        );
        slider.track.details.slides.forEach((_e, idx) => {
          // slider.track.details.slides.forEach((_e, idx) => {
          console.log("_e", _e);
          // var dots = createDiv("dot")
          // dot.addEventListener("click", () => slider.moveToIdx(idx))
          // dotsWrapper.appendChild(dot)
          if (Math.round(slider.options.slides.perView) > 1) {
            if (idx !== slider.track.details.slides.length - 1) {
              var dot = document.createElement("button");
              dot.classList.add("dot");
              dot.setAttribute("aria-label", "Slide " + (idx + 1));
              dotsWrapper.appendChild(dot);
              // dot.addEventListener("click", () => slider.moveToIdx(idx * Math.round(slider.options.slides.perView) ));
              dot.addEventListener("click", () => slider.moveToIdx(idx));
            }
          } else {
            var dot = document.createElement("button");
            dot.classList.add("dot");
            dot.setAttribute("aria-label", "Slide " + (idx + 1));
            dotsWrapper.appendChild(dot);
            dot.addEventListener("click", () => slider.moveToIdx(idx));
            // dot.addEventListener("click", () => slider.moveToIdx(idx))
          }
        });
      }

      updateClasses(slider);
    });
    slider.on("optionsChanged", () => {
      updateClasses();
    });
    slider.on("slideChanged", () => {
      updateClasses();
    });
    // slider.on("destroyed", () => {
    //   markup(true);
    // });

    function updateClasses() {
      var slide = slider.track.details.rel;
      console.log("slide", slide);

      if (navigationConfig === "arrows" || navigationConfig == "full") {
        slide === 0
          ? arrowLeft.classList.add("arrow--disabled")
          : arrowLeft.classList.remove("arrow--disabled");

        slide ===
        slider.track.details.slides.length -
          Math.round(slider.options.slides.perView)
          ? arrowRight.classList.add("arrow--disabled")
          : arrowRight.classList.remove("arrow--disabled");
      }

      console.log("dots.children");
      if (navigationConfig == "dots" || navigationConfig == "full") {
        const dots = slider.container.querySelector(".dots");
        console.log("dotschildren", dots.children);
        Array.from(dots.children).forEach((dot, idx) => {
          // Array.from(dots.children).forEach((dot, idx) => {
          idx === slide
            ? dot.classList.add("dot--active")
            : dot.classList.remove("dot--active");
        });
      }
    }
  }

  autoPlay(slider) {
    if (!slider.container.getAttribute("autoplay")) return;

    let timeout;
    let mouseOver = false;

    console.log("slider", slider);
    const autoplayInterval = slider.container.getAttribute("autoplay") * 1000;
    console.log("autoplayInterval", autoplayInterval);

    function clearNextTimeout() {
      clearTimeout(timeout);
    }
    function nextTimeout() {
      clearTimeout(timeout);
      if (mouseOver) return;
      timeout = setTimeout(() => {
        slider.next();
      }, autoplayInterval);
    }
    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => {
        mouseOver = true;
        clearNextTimeout();
      });
      slider.container.addEventListener("mouseout", () => {
        mouseOver = false;
        nextTimeout();
      });
      nextTimeout();
    });
    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  }
}

window.customElements.define("keen-slider", SliderComponent);
