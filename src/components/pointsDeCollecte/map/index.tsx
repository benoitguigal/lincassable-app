import { useList } from "@refinedev/core";
import { IPointDeCollecte, PointDeCollecteTypeEnum } from "../../../interfaces";
import { Flex } from "antd";
import { useEffect, useMemo, useRef } from "react";
import mapboxgl, { Map, Marker, Popup } from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYmVub2l0Z3VpZ2FsIiwiYSI6ImNseGFudTJ0bzM2NmQya3FzZHF4YWZ5bDcifQ.vmlhxYdp1EDG6_IFQihxyQ";

function getMarkerColor(type: PointDeCollecteTypeEnum) {
  switch (type) {
    case "Magasin":
      return "#253D39";
    case "Producteur":
      return "#FDEA18";
    case "Massification":
      return "#D5DBD6";
  }
}

export const PointsDeCollecteMap: React.FC = () => {
  const { data: pointsDeCollecteData } = useList<IPointDeCollecte>({
    resource: "point_de_collecte",
    pagination: {
      mode: "off",
    },
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

    for (const pointDeCollecte of pointsDeCollecte) {
      if (pointDeCollecte.latitude && pointDeCollecte.longitude) {
        const popupContent =
          `<div><b>${pointDeCollecte.nom}</b></div>` +
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
      }
    }
  }, [pointsDeCollecte]);

  return (
    <Flex vertical style={{ height: "calc(100vh - 200px)" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </Flex>
  );
};
