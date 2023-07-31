class DeferEmbedVideo extends HTMLElement {
  constructor() {
    super();
    this.video = this.querySelector("iframe");

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.video.src = this.video.dataset.src;
          this.observer.unobserve(this);
        }
      },
      { rootMargin: "0px 0px -30px 0px" }
    );
    this.observer.observe(this);
  }
}

window.customElements.define("defer-embed-video", DeferEmbedVideo);
