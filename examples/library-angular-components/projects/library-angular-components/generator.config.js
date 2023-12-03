const { processProject } = require('@web-component-wrapper/core');
const { AngularComponentsGenerator } = require('@web-component-wrapper/angular');
const { paramCase } = require('change-case');

processProject({
  src: '../../../library/src/*.(ts|js)', // path to `library` source files
  dist: './components', // path where wrappers should be generated, in our case we want to put them to `components` so every component can be imported as `import {} from 'library-angular-components/components/...`
  typescript: {
    project: '../../../library/tsconfig.json',
    includes: ['../../../library/src/vite-env.d.ts']
  },
  webComponentProvider({ className }) {
    const tagName = paramCase(className);

    return {
      tagName,
      code: `
        import { ${ className} } from 'library-components';

        try {
          customElements.define('${ tagName }', class extends ${className} {});
        } catch (e) {}
      `
    }
  },
  generator: new AngularComponentsGenerator()
});
