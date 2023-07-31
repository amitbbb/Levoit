
// class AccountRegisterForm extends HTMLElement {
//   constructor() {
//     super();
//   }
//   connectedCallback() {
//     //implementation
//     this.submitHandler()

//   }

//   submitHandler() {
//     const form = this.querySelector('#Form-create-account');
//     // const apiUrl = window.themeVariables.routes.account_url
    
//     const firstNameInput = form.querySelector('#RegisterForm-firstname')
//     const emailInput = form.querySelector('#RegisterForm-email')
//     const passwordInput = form.querySelector('#RegisterForm-password')

   
//     form.addEventListener('submit', (e) => {
//       e.preventDefault();

//       //validate first name input
//       if (firstNameInput.value.trim() === '') {
//         alert('First name is required') 
//         return;
//       }

//       // validate the email input
//       if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
//         alert("Invalid email")
//       }

//       // Validate the password input
//       if (passwordInput.value.length < 6) {
//         alert('Password must be at least 6 characters');
//         return;
//       }

//       form.submit();

//       // const customerData = {
//       //   customer: {
//       //     first_name: 'John',
//       //     last_name: 'Doe',
//       //     email: 'johndoe@example.com',
//       //     password: 'password'
//       //   }
//       // };

//       // const API_KEY = '4f3adb147eff655cb172352f0225d932'
//       // const API_SECRET = '87be9a90697137efb2e71da1cd613f73'
//       // const AUTHORIZATION_HEADER = `Basic ${btoa(`${API_KEY}:${API_SECRET}`)}`;
//       // const API_URL = 'https://cosori-stage.myshopify.com/admin/api/2021-07/customers.json'
//       // const options = {
//       //   method: "POST",
//       //   mode: 'no-cors',
//       //   headers: {
//       //     'Authorization': AUTHORIZATION_HEADER,
//       //     'Content-Type': 'application/json'
//       //   },
//       //   body: JSON.stringify(customerData)
//       // }
  

//       // if all fields are valid, submit, and redirect
//       // form.submit();
//       // window.location.href = window.themeVariables.routes.account_url
//       // fetch(API_URL, options)
//       //   .then(response => response.json())
//       //   .then(data => {
//       //     console.log("Success:", data)
//       //   })
//       //   .catch((error) => {
//       //     console.error("Error:", error)
//       //   })
//     })
//   }

// }

// window.customElements.define('account-register-form', AccountRegisterForm);