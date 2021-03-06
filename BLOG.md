title: Code splitting and tree shaking with Typescript and Webpack
---

As off today single page applications are all around and bring application-like user experience to the browser. If done naively, one problem is, that the JavaScript for the application gets very big which is not only a problem in terms of network transfer, but also the client browser have to parse a lot of JavaScript upfront before being able to make the application interactive. This is especially a problem for mobile devices. To reduce initial loading and parsing of unneeded JavaScript there is [code splitting][code-splitting]. To drop unused code all together there is [tree shaking][tree-shaking]. This blog post will show you how to get this working with your [TypeScript][typescript]+[Webpack][webpack] project in a step by step guide.

## TypeScript configuration

Most users will configure the TypeScript compiler to use `"es5"` as `target` and hence do a complete compiling from TypeScript down to browser compatible ES5 JavaScript. The problem with this is, that Webpack will not be able to do tree shaking anymore as it only gets to see `require` instead of ES6 `import`. Code splitting would still be possible, if you use Webpack's properitary `require.ensure`, but this is not a nice solution: Your IDE won't be able to give type information anymore. To solve this, you should choose `"esnext"` as target as well as `module`. Basically what you need is, that the TypeScript compiler does not change anything, but also strips TypeScript typing information from the code. To achiev that the important configuration in your `tsconfig.json` should look like this:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "moduleResolution": "node",
    "module": "esnext",
    "target": "esnext",
    "sourceMap": true
  }
}
```

## Babel configuration

Now you will get JavaScript that uses a bunch of features, that are not widely supported by now. With the preset `babel-preset-env` you can define not what exactly [Babel][babel] transform you want to apply, but what browsers you want to support and then `babel-preset-env` picks the right configuration to match your needs. Your `.babelrc` should look somewhat like this:

```json
{
  "presets": [
    "react",
    [
      "env",
      {
        "modules": false,
        "targets": {
          "browsers": [
            "last 2 chrome versions",
            // ... other browsers you want to support
          ]
        }
      }
    ]
  ],
  "plugins": [
    "babel-plugin-syntax-dynamic-import"
  ]
}
```

Two important things to notice here: You must tell `babel-preset-env` to not touch the modules, meaning it will just keep import statements like `import a from './b'` as they are. In addition you have to add `babel-plugin-syntax-dynamic-import` as plugin to keep dynamic import statements like `const a = await import('./b')` untouched. After this step, you now have compiled your TypeScript down to JavaScript that is compatible with the browsers of your choice, but with the original (dynamic) imports.

## Webpack configuration

As final step, we have to configure Webpack accordingly. You would use your `awesome-typescript-loader` as usual, but add the `useBabel: true` option (which is the same as prepending the `babel-loader` in the rules chain). The important parts of your `webpack.config.js` would look like this:

```javascript
module.exports = {
  target: 'web',
  entry: {
    app: ['./index.ts'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: require.resolve('awesome-typescript-loader'),
            options: {
              useBabel: true,
            },
          },
        ],
      },
    ],
  },
  devtool: '#sourcemap',
}
```

That is it. Now you not only enabled Webpack to do code splitting and tree shaking, but you also reduced your JavaScript asset size even more, because the use of `babel-preset-env` instead of letting TypeScript do the whole compilation. For example `async`/`await` will most likely just be in your resulting JavaScript instead of being transpiled to generators, which is just way shorter.

## TL:DR

Let us wrap up with a brief overview of what had to be done:

1. Configure TypeScript compiler to leave code more or less untouched by using `"esnext"` as target
2. Add Babel configuration to transpile with `babel-preset-env` preset while not touching imports or dynamic imports
3. Tell Webpack to use TypeScript + Babel, either by configuring `awesome-typescript-loader` or by manually adding `babel-loader`

To see everything in action, I prepared a demo repository at [github.com/ePages-de/typescript-babel-webpack-treeshaking-codesplitting-demo](https://github.com/ePages-de/typescript-babel-webpack-treeshaking-codesplitting-demo)

[code-splitting]: https://webpack.js.org/guides/code-splitting/
[tree-shaking]: https://webpack.js.org/guides/tree-shaking/
[webpack]: https://webpack.js.org/
[typescript]: https://www.typescriptlang.org/
[babel]: https://babeljs.io/
