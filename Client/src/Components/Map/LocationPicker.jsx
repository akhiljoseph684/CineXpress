import React from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

});

function LocationMarker({
  position,
  setPosition,
}) {

  useMapEvents({

    click(e) {

      setPosition([
        e.latlng.lat,
        e.latlng.lng,
      ]);

    },

  });

  return position ? (

    <Marker
      position={position}
    />

  ) : null;
}

function LocationPicker({
  position,
  setPosition,
}) {

  return (
    <MapContainer
      center={[20.5937, 78.9629]}

      zoom={5}

      scrollWheelZoom={true}

      className="
        h-[400px]
        w-full

        rounded-2xl

        z-0
      "
    >

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'

        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker
        position={position}
        setPosition={setPosition}
      />

    </MapContainer>
  );
}

export default LocationPicker;