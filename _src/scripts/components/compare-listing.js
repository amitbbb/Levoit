class CompareListing extends HTMLElement {
  constructor() {
    super();
    //implementation
    this.productCardList = this.querySelector("[compare-product-card-listing]");
    this.specsList = this.querySelector('[compare-specs-listing]')

    console.log("COMPARE LISTING", this.getComparisons());

    this.renderHTML();
  }

  connectedCallback() {
    //implementation
  }

  getComparisons() {
    return JSON.parse(localStorage.getItem("comparisons"));
  }

  renderHTML() {
    console.log("this.productCardList", this.productCardList);
    this.renderProductCards();
    this.renderSpecs();
  }

  renderProductCards() {
    if (this.getComparisons() !== null && this.getComparisons().length > 0) {
      const html = this.getComparisons()
        .map(
          (product, idx) => `
        <th class="text-center p-4" >
          <div class="flex flex-col justify-start" style="width:350px">
            <div class="aspect-square bg-neutral-100 p-8 mb-4 mx-auto" >
              <img src="${product.featured_image}&width=300" loading="lazy" class="w-full"  style="width: 350px">
            </div>
            <p class="mb-4"><a href="${product.url}" class="text-xl">${product.title}</a></p>
           
            <p class="font-normal text-lg">${product.price}</p>
          </div>
        </th>
      `
        )
        .join("");

      this.productCardList.innerHTML = html;

      const firstTh = document.createElement("th");
      firstTh.classList.add("py-8", "pr-4", "max-w-full", "w-72");

      if (this.productCardList.hasChildNodes()) {
        this.productCardList.insertBefore(
          firstTh,
          this.productCardList.firstChild
        );
      }
    }
  }

  // renderSpecs() {
  //   if (this.getComparisons() !== null && this.getComparisons().length > 0) {
  //     // Array to store unique spec names
  //     const specNames = [];

  //     // Iterate over each product in the comparisons array to get all unique spec names
  //     this.getComparisons().forEach((product) => {
  //       console.log("renderSpecs product", product)

  //       if ( product.specs) {
  //         product.specs.forEach((spec) => {
  //           if (!specNames.includes(spec.name)) {
  //             specNames.push(spec.name);
  //           }
  //         });
  //       }
  
  //     });

  //     // // Sort the spec names alphabetically
  //     // specNames.sort();

  //     console.log("SpecNames", specNames)

  //     const specsListEl = this.querySelector('[compare-specs-listing]')
  //     let specListHTML = ``

  //     // specNames.forEach((name, idx) => {
  //     //   specListHTML += `
  //     //     <tr class='${idx % 2 === 0 ? 'bg-neutral-100' : '' } whitespace-nowrap'>
  //     //       <td class='py-4 px-4 font-medium border-b border-gray-200 max-w-full w-72'>${name}</td>
  //     //     </tr>
  //     //   `
  //     // })

  //     //Render Specs HTML adding a table cell for each unique spec name
  //     this.getComparisons().forEach((product) => {
  //       // const specTitle = document.createElement('td')
  //       // specTitle.classList.add('px-4', 'pr-4', 'font-medium', 'border-b', 'border-gray-200', 'max-w-full', 'w-72')
  //       // specListHTML += `<td class="py-4 pr-4 font-medium border-b border-gray-200 max-w-full w-72">title</td>`

  //         specNames.forEach((name, idx) => {
  //           if(product.specs) {
  //             const spec = product.specs.find((s) => s.name === name)
  //             const value = spec ? spec.value : "—";
  
  //             specListHTML += `
  //             <tr class='${idx % 2 === 0 ? 'bg-neutral-100' : '' } whitespace-nowrap'>
  //               <td class='py-4 px-4 font-medium border-b border-gray-200 max-w-full w-72'>${name}</td>
  //               <td class="px-4 py-4 text-center border-b border-gray-200">${value}</td>
  //             </tr>
  //           `
  //           }
           
  
  //           // let specRowHTML =  `<td class="px-4 py-4 text-center border-b border-gray-200">${value}</td>`
  
  //           // console.log("spec name + value ==== ", spec.name + ', ' + value)
  
  //           // specListHTML += `<td class="px-4 py-4 text-center border-b border-gray-200">${value}</td>`
  
  //           // const specTitle = document.createElement('td')
  //           // specTitle.classList.add('px-4', 'pr-4', 'font-medium', 'border-b', 'border-gray-200')
  //           // specListHTML += `<td class="px-4 py-4 text-center border-b border-gray-200">${value}</td>`
  
  //         //  `<td class="px-4 py-4 text-center border-b border-gray-200">${value}</td>`
  //         })
        
  //     })


  //     // specListHTML += `</tr>`

  //     specsListEl.innerHTML = specListHTML


  //   }
  // }

  renderSpecs() {
    
    const specNames = [
      ...new Set(
        this.getComparisons().flatMap((c) => c.specs.map((s) => s.name))
      ),
    ];
    const specValues = specNames.map((name) => {
      const valuesArray = this.getComparisons().flatMap((c) => {
        const spec = c.specs.find((s) => s.name === name);
        return spec ? spec.value : "—";
      });
      return { name, values: valuesArray };
    });

    console.log("specvalues", specValues);

    let html = `
      
    `;

    //Render Specs HTML adding a table cell for each unique spec name
    specValues.forEach((item, idx) => {
      console.log("item", item)

      html += `<tr class='${idx % 2 === 0 ? 'bg-neutral-100' : '' } '>`

      html += `<td class='py-4 px-4 font-medium border-b border-gray-200 max-w-full w-72 whitespace-nowrap'>${item.name}</td>`

      item.values.forEach((value,idx) => {
        html += `<td class="px-4 py-4 text-center border-b border-gray-200"><div style="width: 350px">${value}</div></td>`
      })

      html += `</tr>`
     
    })

    console.log("html", html)

    this.specsList.innerHTML = html
  }
}

window.customElements.define("compare-listing", CompareListing);
