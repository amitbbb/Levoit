class TabComponent extends HTMLElement {
  constructor() {
    super();
    const tabs = this.querySelectorAll('tab-component-nav')
    const panels = this.querySelectorAll('tab-component-panel')
    const selectedTab = this.querySelector('[selected]')
    const selectedPanel = this.querySelector(`#${selectedTab.id}`)

    tabs.forEach(tab => {
      tab.addEventListener('click', (evt) => {
        tabs.forEach(tab => {
          tab.setAttribute('aria-selected', false)
          tab.removeAttribute('selected')
        });
        tab.setAttribute('aria-selected', true)
        tab.setAttribute('selected', '')

        const panelId = this.querySelector(`#${tab.getAttribute('aria-controls')}`)
        
        panels.forEach(panel => {
          panel.setAttribute('aria-hidden', true)
        })
        panelId.setAttribute('aria-hidden', false)
      })
    });
  }

}

window.customElements.define('tab-component', TabComponent);