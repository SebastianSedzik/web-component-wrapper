import { AngularComponentsGenerator } from "webcomponents-wrappers-angular";
import { processProject } from "webcomponents-wrappers-core";

processProject({
  src: '../../examples/lit-ts/src/text-field.ts',
  dist: 'dist',
  generator: new AngularComponentsGenerator({
  
  })
})
