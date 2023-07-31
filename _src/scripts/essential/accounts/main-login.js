class MainLogin extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.recoveryTrigger = this.querySelector("#recovery-trigger")
    this.loginTrigger = this.querySelector("#login-trigger")
    this.loginForm = this.querySelector("#main-login")
    this.recoveryForm = this.querySelector("#main-login-recovery")
    this.recoverySuccess = this.getAttribute('recovery-success')
    console.log("this.recoverySuccess", this.recoverySuccess)

    this.recoveryTrigger.addEventListener("click", () => {
      this.switchForm()
    })
    this.loginTrigger.addEventListener("click", () => {
      this.switchForm()
    })
  }

  switchForm() {
    console.log("toggle")
    if (this.recoverySuccess === "true") {
      this.loginForm.classList.toggle("hidden")
      this.recoveryForm.classList.toggle("hidden")
      alert("hi")

    } else {
      this.loginForm.classList.toggle("hidden")
      this.recoveryForm.classList.toggle("hidden")
      alert("bye")
    }
  }


}

window.customElements.define('main-login', MainLogin);