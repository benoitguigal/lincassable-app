import { CrudFilter, useList } from "@refinedev/core";
import { PointDeCollecte, PointDeCollecteTypeEnum } from "../../types";
import { Flex } from "antd";
import { useEffect, useMemo, useRef } from "react";
import { Map, Marker, Popup } from "mapbox-gl";
import { initMapbox } from "../../utility/mapboxClient";

initMapbox();

function getMarkerColor(type: PointDeCollecteTypeEnum) {
  switch (type) {
    case "Magasin":
      return "#253D39";
    case "Producteur":
      return "#FDEA18";
    case "Massification":
      return "#D5DBD6";
    case "Tri":
      return "black";
  }
}

type PointsDeCollecteMapProps = {
  pointDeCollecteIds?: number[];
};

const PointsDeCollecteMap: React.FC<PointsDeCollecteMapProps> = ({
  pointDeCollecteIds,
}) => {
  const filters: CrudFilter[] = [];

  if (pointDeCollecteIds) {
    filters.push({ field: "id", operator: "in", value: pointDeCollecteIds });
  } else {
    filters.push({ field: "statut", operator: "ne", value: "archive" });
  }

  const { data: pointsDeCollecteData } = useList<PointDeCollecte>({
    resource: "point_de_collecte",
    pagination: {
      mode: "off",
    },
    filters,
  });

  const pointsDeCollecte = useMemo(
    () => pointsDeCollecteData?.data || [],
    [pointsDeCollecteData]
  );

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (!map.current && pointsDeCollecte && mapContainer.current)
      map.current = new Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [5.53, 43.69],
        zoom: 8,
      });

    let maxLng = -180;
    let minLng = 180;
    let maxLat = -90;
    let minLat = 90;

    for (const pointDeCollecte of pointsDeCollecte) {
      if (pointDeCollecte.latitude && pointDeCollecte.longitude) {
        const showPointDeCollecteUrl = `${
          import.meta.env.VITE_HOST
        }/point-de-collecte/show/${pointDeCollecte.id}`;
        const popupContent =
          `<a href="${showPointDeCollecteUrl}"><b>${pointDeCollecte.nom}</b></a>` +
          `<div>${pointDeCollecte.adresse}</div>`;
        const popup = new Popup().setHTML(popupContent);
        const marker = new Marker({
          color: getMarkerColor(pointDeCollecte.type),
        })
          .setLngLat([pointDeCollecte.longitude, pointDeCollecte.latitude])
          .setPopup(popup);
        if (map.current) {
          marker.addTo(map.current);
        }
        maxLng = Math.max(maxLng, pointDeCollecte.longitude);
        minLng = Math.min(minLng, pointDeCollecte.longitude);
        maxLat = Math.max(maxLat, pointDeCollecte.latitude);
        minLat = Math.min(minLat, pointDeCollecte.latitude);
      }
    }

    if (map.current) {
      map.current.fitBounds(
        [
          [maxLng, minLat], // [lng, lat] - southwestern corner of the bounds
          [minLng, maxLat], // [lng, lat] - northeastern corner of the bounds
        ],
        { padding: { top: 50, bottom: 50, left: 50, right: 50 } }
      );
    }
  }, [pointsDeCollecte]);

  return (
    <Flex vertical style={{ height: "calc(100vh - 200px)" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </Flex>
  );
};

export default PointsDeCollecteMap;
