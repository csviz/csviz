CSVIZ
==========

### Build process

I include neither `Grunt` nor `Gulp` for the build process, instead I use the `npm run` command provided from the npm cli. For **how** and **why**, you can refer to [task automation with npm run](www.substack.net/task_automation_with_npm_run) from Substack.

#### Dependencies

Make sure you have `browserify`, `watchy`, `watchify`, `browser-sync` installed with `npm install browserify watchy watchify browser-sync -g`

#### Development

```
$ npm run watch
```

You can use this command to:

* `npm run lib` - This task will copy third-party libraries that has **css** files and **images**;
* `npm run browser-sync` -  This task will start a static server and watch file changes;
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

**main.js** is the entry point of the app which define the route with `react-router`, and the defaut page is `MapPage` which you can find under `/pages/Map`.

#### Actions

* MapActionCreators - trigger the **view action** to **dispatcher**
* MapServerActionCreators - listen on the server response event and send the **server action** to **dispatcher**

#### Dispatcher

#### Stores

Now we have three main stores:

* CONFIGStore - store the data read from the `data/configuration.json`
* GEOStore - store the data read from the `data/alternative_country_top.json`
* GLOBALStore - store the indicators data and meta data read from `data/global.json`, also include the **app state** like `selected_indicator`

#### View(Components)

Our app is made from serval reusable component:

* Map component - render the map with mapbox and re-redender on indicator changes
* Map control component(sidebar) - the sidebar component, which contain other sub-component
  - control header(title, config)
  - indicator selector(selectbox for change indicator)
  - social pannel(share and download)
  - graph(gauge, bar chart, line chart...)


#### Pages

* Map page - main map
* Not found page - handle 404 page
* <del>Edit apge</del>

### License
MIT