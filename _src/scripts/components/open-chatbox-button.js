class OpenChatboxButton extends HTMLElement {
  constructor() {
    super();
    //implementation
    
  }

  connectedCallback() {
   

    // if (!this.chatboxBtn) return;

    this.addEventListener('click', ()=> {
      //  this.chatboxBtn = document.querySelector('button[id="ft-help-button"]');
      //  console.log("this.chatboxBtn", this.chatboxBtn);
      // this.chatboxBtn.click()
      Forethought("widget", "open");
    })
  }


}

window.customElements.define('open-chatbox-button', OpenChatboxButton);