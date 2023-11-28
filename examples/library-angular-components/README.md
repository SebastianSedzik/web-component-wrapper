Example Angular workspace with library that generates angular-wrappers for [components-library]() 

### 1. Creation of Workspace Using Standard Angular CLI Commands
```shell
# Generate the workspace
ng new library-angular-components --create-application=false

# Navigate to the created workspace
cd library-angular-components

# Generate the library
ng generate library library-angular-components
```

### 2. Configuration and Setup for library-angular-components
#### Step 1: Install Required Dependencies
```shell
# Install dependencies for web-component-wrapper
npm i @web-component-wrapper/core @web-component-wrapper/angular -D

# Install your library
npm i my-web-components-library
```

👀 [package.json](https://github.com/SebastianSedzik/web-component-wrapper/blob/master/examples/library-angular-components/projects/library-angular-components/package.json#L16-L21)

#### Step 2: Configure the web-component-wrapper
Create file where you will specify the source of your web-components library and the destination where the generated wrappers will be stored. Consider adding the folder containing the generated wrappers to your .gitignore file.

👀 [Config file](https://github.com/SebastianSedzik/web-component-wrapper/blob/master/examples/library-angular-components/projects/library-angular-components/generator.config.js)

#### Step 3: Generate Angular Wrapper Components (e.g., Using a Prebuild Hook)
Incorporate the generation of Angular wrappers into your build process. For instance, run the generation script before running Angular package build:

👀 [package.json](https://github.com/SebastianSedzik/web-component-wrapper/blob/master/examples/library-angular-components/projects/library-angular-components/package.json#L12)

#### Step 4: Include the Generated Components Module in the Library's Public API Export
Export the module containing the generated components from the public API file of your library.

👀 [public-api.ts](https://github.com/SebastianSedzik/web-component-wrapper/blob/master/examples/library-angular-components/projects/library-angular-components/src/lib/public-api.ts#L6)

#### Step 5: Build and Publish Your Library 🎉!
Complete the process by building and publishing your library. Congratulations!
