// const esbuild = require('esbuild');
// // import * as esbuild from "esbuild";
// // import { sassPlugin } from "esbuild-sass-plugin";
// // const { sassPlugin } = require("esbuild-sass-plugin");
// // esbuild
// //   .build({
// //     entryPoints: {
// //       theme: "_src/scripts/theme.js",
// //     },
// //     bundle: true,
// //     outdir: "assets",
// //     target: ["es2018"],
// //     minify: false,
// //     watch: true,
// //     sourcemap: false
// //     // plugins: [sassPlugin({ type: "style" })]
// //   })
// //   .then(() => {
// //     console.log("Watching files...");
// //   })
// //   .catch((e) => console.error(e.message));


// let ctx = await esbuild.context({
//   entryPoints: ["_src/scripts/theme.js"],
//   bundle: true,
//   outdir: "assets",
// });

// await ctx.watch();