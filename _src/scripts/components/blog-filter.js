class BlogFilter extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form')
    this.inputs = this.form.querySelectorAll('input')
    this.currentPath = window.location.pathname
    this.relativePath = this.currentPath.split('/tagged/')[0]
    this.checkForActiveValues()
  }

  connectedCallback() {
    
    this.form.addEventListener('change', (evt) => {
      console.log("change", evt.target.value)
      this.onChange(evt)
    })
  }

  checkForActiveValues() {
    if (!this.currentPath.includes('/tagged')) return;
    
    this.activeTags = this.currentPath.split('tagged/')[1]
    console.log('this.activeTags',this.activeTags);

    this.activeTagsArray = this.activeTags.split('+')
    console.log("this.activeTagsArray",this.activeTagsArray)

    this.matchingInputs = Array.from(this.inputs).filter(input => this.activeTagsArray.includes(input.value))

    console.log('this.matchingInputs', this.matchingInputs);

    this.matchingInputs.forEach(input => {
      input.checked = true
      input.closest('details').open = true
    })


  }


  onChange(evt) {
    console.log("current path", window.location.pathname)
    // window.location.href = window.location.origin + "/blogs/recipes/tagged/" + evt.target.value

    if (!this.currentPath.includes('/tagged')) {
      console.log('doesnt include tagged')
      window.location.href = window.location.origin + this.currentPath + '/tagged/' + evt.target.value
    } 

    if (this.currentPath.includes('/tagged')) {
      console.log('includes tagged')

      // If deselecting an active tag
      if(this.currentPath.includes(evt.target.value)) {
        console.log('includes evt target value')
        
        this.activeTagsArray = this.activeTagsArray.filter(value => value !== evt.target.value);
        console.log("UPDATED this.activeTagsArray", this.activeTagsArray)

        this.activeTagsString = this.activeTagsArray.join('+')
        console.log("this.activeTagsString",this.activeTagsString)
        
        if (this.activeTagsArray.length > 0 ) {
          window.location.href = window.location.origin + this.relativePath + '/tagged/' + this.activeTagsString
        } else {
          window.location.href = window.location.origin + this.relativePath  + this.activeTagsString
        }
        
        console.log("this.relativePath ", this.relativePath )


      } else {
        console.log('doesnt includes evt target value')

        window.location.href = this.currentPath + '+' + evt.target.value
      }

    } 
  }


}

window.customElements.define('blog-filter', BlogFilter);