# Levoit Shopify
Using ShopifyCLI, TailwindCSS, WebComponents, & Yarn for package management

## Setup
- `yarn install` in root folder to install all packages
- Install ShopifyCLI, see [Docs](https://shopify.dev/docs/themes/tools/cli)

## Developement
- `yarn dev` to watch css and js files. See setup under "scripts" in package.json
- `shopify theme dev --store levoitstore` to start dev locally
- Push to git repo, to push live

## Processes
- Will need to make a staging branch when in production


## Philosophy
You can find precompiled styles `_src/styles` and scripts under `__src/scripts`
- Styles are done inline with Tailwind, except for some global classes and modifiers. 
- Webcomponents for javascript for better behavioral encapsulation, reusability, customization
- Refactor liquid and js components to improve quality, readability, and maintainability of code over time

## Resources
- ShopifyCLI for themes [Docs](https://shopify.dev/docs/themes/tools/cli)
- TailwindCSS using TailwindCLI + PostCSS [Docs](https://tailwindcss.com/docs/installation)