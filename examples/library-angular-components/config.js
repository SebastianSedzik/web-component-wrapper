const { processProject } = require('web-component-wrapper-core');
const { AngularComponentsGenerator } = require('web-component-wrapper-angular');

processProject({
  src: '../library/src/*.ts',
  dist: './dist',
  typescript: {
    project: '../library/tsconfig.json'
  },
  generator: new AngularComponentsGenerator({
    webComponentImportPath: () => 'lit-ts-components', // @todo
  })
});
