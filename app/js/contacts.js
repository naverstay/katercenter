var all_pins = [],
  map_timer,
  all_tooltips = [],
  mapProp = {
    zoom: 16,
    // disableDefaultUI: true,
    scrollwheel: false,
    // navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    styles: [{
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [{"color": "#444444"}]
    }, {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{"color": "#f2f2f2"}]
    }, {
        "featureType": "landscape",
        "elementType": "labels.text.fill",
        "stylers": [{"saturation": "-34"}, {"visibility": "on"}]
    }, {"featureType": "poi", "elementType": "all", "stylers": [{"visibility": "off"}]}, {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [{"hue": "#ff0000"}]
    }, {
        "featureType": "road",
        "elementType": "all",
        "stylers": [{"saturation": -100}, {"lightness": 45}]
    }, {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [{"visibility": "simplified"}]
    }, {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [{"visibility": "off"}]
    }, {"featureType": "transit", "elementType": "all", "stylers": [{"visibility": "off"}]}, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{"color": "#156789"}, {"visibility": "on"}]
    }]
  },
  gmap,
  center;

function checkMapSize() {
  clearTimeout(map_timer);

  map_timer = setTimeout(function () {
    if (gmap && center) gmap.setCenter(center);
  }, 10);
}

function loadMap() {

  // без таймаута не работает :(

  setTimeout(function () {
    center = new google.maps.LatLng(55.833114, 37.482283);
    gmap = new google.maps.Map(document.getElementById("contacts_map"), mapProp);
    gmap.setCenter(center);

    createPin(gmap, 'Kater Center', {
      lat: 55.833114,
      lng: 37.482283
    }, false);

  }, 0);
}

function createPin(target_map, name, latlng, icon, icon_hover, magic_top_offset) {
  var img = new Image(), marker;

  if (icon && icon.length) {
    $(img).one('load', function () {
      var image = new google.maps.MarkerImage(
        icon,
        new google.maps.Size(img.width, img.height),
        new google.maps.Point(0, 0),
        new google.maps.Point((img.width / 2).toFixed(), img.height + (magic_top_offset || 0))
      );

      marker = new google.maps.Marker({
        position: latlng,
        map: target_map,
        icon: image,
        title: name
      });

      if (icon_hover && icon_hover.length) {
        google.maps.event.addListener(marker, 'mouseover', function () {
          marker.setIcon(icon_hover);
        });
        google.maps.event.addListener(marker, 'mouseout', function () {
          marker.setIcon(icon);
        });
      }

      return marker;
    });

    img.src = icon;

  } else {
    marker = new google.maps.Marker({
      position: latlng,
      map: target_map,
      title: name
    });

    if (icon_hover && icon_hover.length) {
      google.maps.event.addListener(marker, 'mouseover', function () {
        marker.setIcon(icon_hover);
      });
      google.maps.event.addListener(marker, 'mouseout', function () {
        marker.setIcon(icon);
      });
    }

    return marker;
  }
}

$(window).resize(function () {
  checkMapSize();
});

$(function ($) {
  checkMapSize();
});
