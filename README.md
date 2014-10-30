CSVIZ
==========

### Dependencies

* React - View
* Flux - Data flow
* React-router - Router
* Chartist - Graph
* Map - Mapbox

### Build process

I include neither `Grunt` nor `Gulp` for the build process, instead I use the `npm run` command provided from the npm cli. For **how** and **why**, you can refer to [task automation with npm run](www.substack.net/task_automation_with_npm_run) from Substack.

#### Development

```
$ npm run watch
```

You can use this command to:

* `npm run lib` - This task will copy third-party libraries that has **css** files and **images**;
* `npm run watch-js` - This task will listen on changes on js files for browserify
* `npm run watch-css` - This task will listen on changes on sass files from `/sass` folder and re-build the css files

#### Production

```
$ npm run build
```

* `npm run lib` - This task will copy third-party libraries that has **css** files and **images**;
* `npm run build-js` - This task will run the browserify task and uglify the code at the same time for production environment;
* `npm run build-css` - Build css file from sass for production

_PS: If you have problem running the above commands, you can try to run `npm run clean` to clean up(`rm -rf build && mkdir build`) the build folder._

### Architecture

First, we are using the [flux](http://facebook.github.io/flux/) architecture from Facebook.

![flux](https://cloud.githubusercontent.com/assets/1183541/4838381/103d4aee-5fe8-11e4-9b17-f6551f340ae7.png)

Reference: [Getting To Know Flux, the React.js Architecture](http://scotch.io/tutorials/javascript/getting-to-know-flux-the-react-js-architecture)

We are following the concept and main structure of flux, but also have some improvement:

* API utils - Talk to the api and **trigger serverActions**
* Store utils + createStoreMixin - Handy way to create multiple store at the same time
