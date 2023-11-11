const { processProject } = require('web-component-wrapper-core');
const { AngularComponentsGenerator } = require('web-component-wrapper-angular');

processProject({
  src: '../library/src/tag-lit-js.js',
  dist: './dist',
  typescript: {
    project: '../library/tsconfig.json',
    includes: ['../library/src/vite-env.d.ts']
  },
  generator: new AngularComponentsGenerator({
    webComponentImportPath: () => 'lit-ts-components', // @todo
  })
});
