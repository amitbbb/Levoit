class LazyVideoSources extends HTMLElement {
  constructor() {
    super();
    this.lazyload = this.hasAttribute("lazyload");
    this.video = this.querySelector("video");
    this.desktop_src = this.getAttribute("desktop-src");
    this.desktop_mime = this.getAttribute("desktop-mime");
    this.desktop_poster = this.getAttribute("desktop-poster");
    this.mobile_src = this.getAttribute("mobile-src");
    this.mobile_mime = this.getAttribute("mobile-mime");
    this.mobile_poster = this.getAttribute("mobile-poster");

    this.mq_tablet_up = window.matchMedia("(min-width: 768px)");

    this.soundButton = this.querySelector("button[sound-button]");
    this.iconSoundOn = this.querySelector("span[icon-sound-on]");
    this.iconSoundOff = this.querySelector("span[icon-sound-off]");

    this.DESKTOP_VIDEO_LOADED = false
    this.MOBILE_VIDEO_LOADED = false
  }

  connectedCallback() {
    if (!this.lazyload) this.loadVideo();
    if (this.lazyload) this.initIntersectionObserver();

    // only handle window resize if only two video sources are provided
    if (this.mobile_src || this.mobile_src.trim() !== "") {
      // load correct video upon resizing browser window
      this.mq_tablet_up.addEventListener(
        "change",
        this.handleMediaQueryChange.bind(this)
      );
    }
    this.toggleSound();
  }

  disconnectedCallback() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  toggleSound() {
    if (!this.soundButton) return;
    
    this.soundButton.addEventListener("click", () => {
      this.video.muted = !this.video.muted;

      if (this.video.muted) {
        this.iconSoundOff.classList.add("hidden");
        this.iconSoundOn.classList.remove("hidden");
      } else {
        this.iconSoundOn.classList.add("hidden");
        this.iconSoundOff.classList.remove("hidden");
      }
    });
  }

  initIntersectionObserver() {
    const options = {
      root: null, //use the viewport as the root element
      rootMargin: "0px 0px -30px 0px", // % or px - offsets added to each side of the intersection
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!this.video.querySelector("source")) {
            this.loadVideo();
          } else {
            this.video.play();
          }
          
          // observer.unobserve(this);
          console.log("lazy-video-sources play");
        } else {
          this.video.pause();
          // this.video.querySelector('source').remove();
          // this.video.querySelector('img').remove();
          console.log("lazy-video-sources pause");
        }
      });
    }, options);
     this.observer.observe(this);
  }

  loadVideo() {
    // if only one video source is provided, load that video. Must be "desktop video"
    if (!this.mobile_src || this.mobile_src.trim() === "") {
      console.log("one video source is provided");
      this.video.poster = this.desktop_poster;
      this.source = document.createElement("source");
      this.source.src = this.desktop_src;

      this.poster = document.createElement("img");
      this.poster.src = this.desktop_poster;

      // this.appendChild(this.video);
      this.video.appendChild(this.source);
      this.video.appendChild(this.poster);
      this.video.setAttribute("autoplay", "");
      this.video.setAttribute("playsinline", "");
      this.video.play();
    } else {
      // if under 768px wide, load mobile video
      if (!this.mq_tablet_up.matches) {
        console.log("Media query does not match");
        // this.video = document.createElement("video");

        this.video.poster = this.mobile_poster;
        this.source = document.createElement("source");
        this.source.src = this.mobile_src;

        this.poster = document.createElement("img");
        this.poster.src = this.mobile_poster;

        // this.appendChild(this.video);
        this.video.appendChild(this.source);
        this.video.appendChild(this.poster);
        this.video.setAttribute("autoplay", "");
        this.video.setAttribute("playsinline", "");
        this.video.play();
      }
      // if over 768px wide load desktop video
      if (this.mq_tablet_up.matches) {
        console.log("Media query matches");
        // this.video = document.createElement("video");

        this.video.poster = this.desktop_poster;
        this.source = document.createElement("source");
        this.source.src = this.desktop_src;

        this.poster = document.createElement("img");
        this.poster.src = this.desktop_poster;

        // this.appendChild(this.video);
        this.video.appendChild(this.source);
        this.video.appendChild(this.poster);
        this.video.setAttribute("autoplay", "");
        this.video.setAttribute("playsinline", "");
        this.video.play();
      }
    }
  }

  handleMediaQueryChange(event) {
    if (event.matches) {
      // if over 768px wide load desktop video
      console.log("Media query matches", this.desktop_src);
      this.video.querySelector("img").src = this.desktop_poster;
      this.video.querySelector("source").src = this.desktop_src;
      this.video.load();
    } else {
      // if under 768px wide, load mobile video
      console.log("Media query does not match", this.mobile_src);
      this.video.querySelector("img").src = this.mobile_poster;
      this.video.querySelector("source").src = this.mobile_src;
      this.video.load();
    }
  }
}

window.customElements.define("lazy-video-sources", LazyVideoSources);
