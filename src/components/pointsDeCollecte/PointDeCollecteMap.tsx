import { useEffect, useRef } from "react";
import { LatLng } from "../../utility/geocoding";
import { Map, Marker } from "mapbox-gl";
import { initMapbox } from "../../utility/mapboxClient";

initMapbox();

type Props = {
  latLng: LatLng;
  handleDragEnd?: (latLng: LatLng) => void;
};

const PointDeCollecteMap: React.FC<Props> = ({ latLng, handleDragEnd }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);
  const marker = useRef<Marker | null>(null);

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      // initialize map only once
      map.current = new Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [latLng.lng, latLng.lat],
        zoom: 13,
      });
      marker.current = new Marker(
        handleDragEnd ? { draggable: true } : {}
      ).setLngLat([latLng.lng, latLng.lat]);

      if (map.current) {
        marker.current.addTo(map.current);
      }

      if (handleDragEnd) {
        marker.current.on("dragend", () => {
          const newLngLat = marker.current?.getLngLat();
          if (newLngLat) {
            handleDragEnd(newLngLat);
          }
        });
      }
    } else if (map.current) {
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

export default PointDeCollecteMap;
