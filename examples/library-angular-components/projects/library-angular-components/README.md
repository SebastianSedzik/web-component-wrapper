### Getting started
```shell
npm i library-angular-components
```

### Usage
Import  component from `library-angular-components/components/*` and use it in your Angular application.

```ts
import { TagLitTsComponent, TagRemoveEvent, TagSize } from 'library-angular-components/components/tag-lit-ts';

@Component({
  template: `
    <!-- using TS enums -->
    <tag-lit-ts size="size" (on-remove)="onRemove($event)"></tag-lit-ts>

    <!-- using string literals -->
    <tag-lit-ts size="medium" (on-remove)="onRemove($event)"></tag-lit-ts>
  `,
  imports: [
    TagLitTsComponent
  ]
})
class MyComponent {
  // TS enum
  size: TagSize = 'medium'

  // TS event
  onRemove(event: CustomEvent<TagRemoveEvent>) {
    console.log(event.detail)
  }
}
```
