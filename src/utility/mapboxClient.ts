
import mapboxgl from "mapbox-gl";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

export function initMapbox(){
  mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN
}


