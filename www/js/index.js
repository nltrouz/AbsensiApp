let app = {
    map: null,
    currentMarker: null,
    defaultPos: {
      coords: {
        latitude: 45.555,
        longitude: -75.555
      }
    },
    init: function() {
      document.addEventListener("deviceready", app.ready);
    },
    ready: function() {
      let s = document.createElement("script");
      document.head.appendChild(s);
      s.addEventListener("load", app.mapScriptReady);
      s.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_MAP_KEY`;
    },
    mapScriptReady: function() {
      if (navigator.geolocation) {
        let options = {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000 * 60 * 60
        };
        navigator.geolocation.getCurrentPosition(
          app.gotPosition,
          app.failPosition,
          options
        );
      } else {
        app.gotPosition(app.defaultPos);
      }
    },
    gotPosition: function(position) {
      app.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        disableDoubleClickZoom: true
      });
      app.addMapListeners();
    },
    addMapListeners: function() {
      app.map.addListener("dblclick", app.addMarker);
    },
    addMarker: function(ev) {
      let marker = new google.maps.Marker({
        map: app.map,
        draggable: false,
        position: {
          lat: ev.latLng.lat(),
          lng: ev.latLng.lng()
        }
      });
      marker.addListener("click", app.markerClick);
      marker.addListener("dblclick", app.markerDblClick);
    },
    markerClick: function(ev) {
      let marker = this;
      app.currentMarker = marker;
      app.map.panTo(marker.getPosition());
    },
    markerDblClick: function(ev) {
      let marker = this;
      marker.setMap(null);
      app.currentMarker = null;
    },
    failPosition: function(err) {
      app.gotPosition(app.defaultPos);
    }
  };
  
  app.init();
  