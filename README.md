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

_ PS: If you have problem running the above commands, you can try to run `npm run clean` to clean up(`rm -rf build && mkdir build`) the build folder.