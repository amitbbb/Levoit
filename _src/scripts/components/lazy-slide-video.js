class LazySlideVideo extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.video = this.querySelector('video')
    this.soundButton = this.querySelector('button[sound-button]')
    this.iconSoundOn = this.querySelector('span[icon-sound-on]')
    this.iconSoundOff = this.querySelector('span[icon-sound-off]')

    this.toggleSound()
  }

  toggleSound() {
    this.soundButton.addEventListener('click', () => {
      this.video.muted = !this.video.muted

      if ( this.video.muted ) {
        this.iconSoundOff.classList.add('hidden')
        this.iconSoundOn.classList.remove('hidden')
      } else {
        this.iconSoundOn.classList.add("hidden");
        this.iconSoundOff.classList.remove("hidden");
      }
    })
  }


  play() {
    console.log("play")
    this.video.play()
  }
  
  pause() {
    console.log("pause")
    this.video.pause()
  }

  static get observedAttributes() {
    return ["is-active"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "is-active") {
      if (this.hasAttribute("is-active")) {
        // 'is-active' attribute exists
        console.log("The is-active attribute exists");

        this.play()
      } else {
        // 'is-active' attribute does not exist
        console.log("The is-active attribute does not exist");
        this.pause()
      }
    }
  }

}

window.customElements.define("lazy-slide-video", LazySlideVideo);
