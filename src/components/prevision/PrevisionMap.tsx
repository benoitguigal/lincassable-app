import { useList } from "@refinedev/core";
import { PointDeCollecte, Prevision } from "../../types";
import { useEffect, useMemo, useRef } from "react";
import { Map, Marker, Popup } from "mapbox-gl";
import { Flex } from "antd";

function getColor(prevision: Prevision) {
  const nbJours = prevision.nb_jours_avant_estimation_prochaine_collecte;
  if (nbJours === null) {
    return "grey";
  }
  if (nbJours < 0) {
    return "red";
  }
  if (nbJours < 30) {
    return "orange";
  }
  return "green";
}

type Record = Prevision & {
  point_de_collecte: Pick<
    PointDeCollecte,
    "latitude" | "longitude" | "nom" | "adresse" | "statut"
  >;
};

const PrevisionMap: React.FC = () => {
  const { data: previsionData } = useList<Record>({
    resource: "prevision",
    pagination: {
      mode: "off",
    },
    meta: {
      select: "*,point_de_collecte(latitude,longitude,nom,adresse)",
    },
  });

  const previsions = useMemo(() => previsionData?.data || [], [previsionData]);

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (!map.current && previsions && mapContainer.current)
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

    for (const prevision of previsions) {
      if (
        prevision.point_de_collecte.latitude &&
        prevision.point_de_collecte.longitude &&
        prevision.point_de_collecte.statut !== "archive"
      ) {
        const popupContent =
          `<div><b>${prevision.point_de_collecte.nom}</b></div>` +
          `<div>${prevision.point_de_collecte.adresse}</div>` +
          `<br/>` +
          `<div>Estimation date prochaine collecte: ${prevision.date_estimation_prochaine_collecte}</div>` +
          `<div>Date dernière collecte : ${prevision.date_derniere_collecte}</div>` +
          `<div>Date avant-dernière collecte : ${prevision.date_avant_derniere_collecte}</div>`;
        const popup = new Popup().setHTML(popupContent);

        const marker = new Marker({
          color: getColor(prevision),
        })
          .setLngLat([
            prevision.point_de_collecte.longitude,
            prevision.point_de_collecte.latitude,
          ])
          .setPopup(popup);
        if (map.current) {
          marker.addTo(map.current);
        }
        maxLng = Math.max(maxLng, prevision.point_de_collecte.longitude);
        minLng = Math.min(minLng, prevision.point_de_collecte.longitude);
        maxLat = Math.max(maxLat, prevision.point_de_collecte.latitude);
        minLat = Math.min(minLat, prevision.point_de_collecte.latitude);
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
  }, [previsions]);

  return (
    <Flex vertical style={{ height: "calc(100vh - 200px)" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </Flex>
  );
};

export default PrevisionMap;
