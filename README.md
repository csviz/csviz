CSVIZ
==========

[ ![Codeship Status for csviz/csviz](https://codeship.com/projects/f910fb50-581b-0132-4456-2264a2250d8e/status?branch=master)](https://codeship.com/projects/50001)

### [Live example](http://csviz.github.io/csviz/)

### Build process([npm all the thing](www.substack.net/task_automation_with_npm_run))

```
$ npm install

// development
$ npm run watch

//production
$ npm run build
```

_PS: If you have problem running the above commands, you can try to run `npm run clean` to clean up the build folder._

### Architecture

First, we are using the [flux](http://facebook.github.io/flux/) architecture from Facebook.

Reference: [Getting To Know Flux, the React.js Architecture](http://scotch.io/tutorials/javascript/getting-to-know-flux-the-react-js-architecture)

**main.js** is the entry point of the app which define the route with `react-router`, and the defaut page is `MapPage` which you can find under `/pages/Map`.

#### Actions

* MapActionCreators - trigger the **view action** to **dispatcher**
* MapServerActionCreators - listen on the server response event and send the **server action** to **dispatcher**


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