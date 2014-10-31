'use strict';

var closeTooltip

var MapUtils = {

  getColor(d) {
    return d > 1000 ? '#8c2d04' :
      d > 500  ? '#cc4c02' :
      d > 200  ? '#ec7014' :
      d > 100  ? '#fe9929' :
      d > 50   ? '#fec44f' :
      d > 20   ? '#fee391' :
      d > 10   ? '#fff7bc' :
      '#ffffe5';
  },

  getStyle(feature) {
    return {
      weight: 2,
      opacity: 0.1,
      color: 'black',
      fillOpacity: 0.7,
      fillColor: MapUtils.getColor(feature.properties.density)
    }
  },

  onEachFeature(feature, layer) {
    layer.on({
      mousemove: MapUtils.mousemove,
      mouseout: MapUtils.mouseout,
      click: MapUtils.zoomToFeature
    })
  },

  mousemove(e) {
    // var popup = new L.Popup({ autoPan: false})
    // var layer = e.target

    // popup.setLatLng(e.latlng);
    // popup.setContent('<div class="marker-title">' + layer.feature.properties.name + '</div>' +
    //     layer.feature.properties.density + ' people per square mile');

    // if (!popup._map) popup.openOn(map);
    // window.clearTimeout(closeTooltip);

    // // highlight feature
    // layer.setStyle({
    //   weight: 3,
    //   opacity: 0.3,
    //   fillOpacity: 0.9
    // });

    // if (!L.Browser.ie && !L.Browser.opera) {
    //     layer.bringToFront();
    // }
  },

  mouseout(e) {
    // countryLayer.resetStyle(e.target);
    // closeTooltip = window.setTimeout(function() {
    //     map.closePopup();
    // }, 100);
  },

  zoomToFeature(e) {
    // map.fitBounds(e.target.getBounds());
  }
}

module.exports = MapUtils;