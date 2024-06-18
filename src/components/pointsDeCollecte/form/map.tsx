import { useEffect, useRef } from "react";
import { LatLng } from "../../../utility/geocoding";
import mapboxgl, { Map, Marker } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmVub2l0Z3VpZ2FsIiwiYSI6ImNseGFudTJ0bzM2NmQya3FzZHF4YWZ5bDcifQ.vmlhxYdp1EDG6_IFQihxyQ";

type Props = {
  latLng: LatLng;
  handleDragEnd?: (latLng: LatLng) => void;
};

export const PointDeCollecteMap: React.FC<Props> = ({
  latLng,
  handleDragEnd,
}) => {
  const mapContainer = useRef(null);
  const map = useRef<Map>(null);
  const marker = useRef<Marker>(null);

  useEffect(() => {
    if (!map.current) {
      // initialize map only once
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [latLng.lng, latLng.lat],
        zoom: 13,
      });
      marker.current = new mapboxgl.Marker(
        handleDragEnd ? { draggable: true } : {}
      )
        .setLngLat([latLng.lng, latLng.lat])
        .addTo(map.current);

      if (handleDragEnd) {
        marker.current.on("dragend", () => {
          const newLngLat = marker.current?.getLngLat();
          if (newLngLat) {
            handleDragEnd(newLngLat);
          }
        });
      }
    } else {
      map.current.setCenter([latLng.lng, latLng.lat]);
      marker.current?.setLngLat([latLng.lng, latLng.lat]);
    }
  }, [latLng.lng, latLng.lat, handleDragEnd]);

  return (
    <div>
      <div ref={mapContainer} style={{ height: "400px" }} />
    </div>
  );
};
