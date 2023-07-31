class LazyVideo extends HTMLElement {
  constructor() {
    super();
    this.video = this.querySelector("video");
    this.desktop_src = this.getAttribute("data-src");
    this.desktop_poster = this.getAttribute("poster");

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!this.video.querySelector("source")) {
          this.source = document.createElement("source");
          this.source.src = this.desktop_src;

          // this.appendChild(this.video);
          this.video.appendChild(this.source);
          }

          // this.video.src = this.video.dataset.src;
          // this.video.style.display = "block";
          this.video.play();
          console.log("play");
        } else {
          this.video.pause();
          // this.video.style.display = "none";
          // this.video.querySelector('source').remove();
          // this.video.remove();
          console.log("pause");
        }
      },
      { rootMargin: "0px 0px -30px 0px" }
    );
    this.observer.observe(this);
  }
}

window.customElements.define("lazy-video", LazyVideo);
