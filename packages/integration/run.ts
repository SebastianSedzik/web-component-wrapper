import { AngularComponentsGenerator } from "web-component-wrapper-angular";
import { processProject } from "web-component-wrapper-core";

processProject({
  // src: '../../examples/lit-ts/src/spl-button.ts',
  src: '/Users/sebastiansedzik/Projects/filament-product-language/packages/core-components/src/lib/components/avatar/src/spl-avatar.ts',
  dist: 'dist',
  generator: new AngularComponentsGenerator({
  
  }),
  typescript: {
    project: '/Users/sebastiansedzik/Projects/filament-product-language/packages/core-components/tsconfig.lib.json',
    includes: [
      '/Users/sebastiansedzik/Projects/filament-product-language/packages/core-components/src/globals.d.ts'
    ]
  }
})
