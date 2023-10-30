import { AngularComponentsGenerator } from "web-component-wrapper-angular";
import { processProject } from "web-component-wrapper-core";

processProject({
  src: '../../examples/lit-ts/src/spl-button.ts',
  dist: 'dist',
  generator: new AngularComponentsGenerator({
  
  })
})
