import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const tomtomApiKey = "ie4Bbk6muzUdyb5YhAC7rvOOjKeQIUyC"; // still used for geocoding

export default function MapWithRoute({ from, to }) {
  const mapRef = useRef(null);
  const mapElement = useRef(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!from || !to) return;

      // Convert addresses to coordinates using TomTom's geocode API
      const getCoords = async (query) => {
        const res = await fetch(
          `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(query)}.json?key=${tomtomApiKey}`
        );
        const data = await res.json();
        return data.results[0]?.position;
      };

      const [fromCoords, toCoords] = await Promise.all([getCoords(from), getCoords(to)]);

      if (!fromCoords || !toCoords) return;

      const map = new maplibregl.Map({
        container: mapElement.current,
        style: "https://demotiles.maplibre.org/style.json", // Public free MapLibre style
        center: [fromCoords.lon, fromCoords.lat],
        zoom: 12,
      });

      mapRef.current = map;

      // Add markers
      new maplibregl.Marker().setLngLat([fromCoords.lon, fromCoords.lat]).addTo(map);
      new maplibregl.Marker().setLngLat([toCoords.lon, toCoords.lat]).addTo(map);

      map.on("load", () => {
        // Add route line
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [fromCoords.lon, fromCoords.lat],
                [toCoords.lon, toCoords.lat],
              ],
            },
          },
        });

        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: {
            "line-color": "#4A90E2",
            "line-width": 4,
          },
        });
      });

      return () => map.remove();
    };

    initializeMap();
  }, [from, to]);

  return <div ref={mapElement} className="w-full h-60 rounded-lg overflow-hidden" />;
}
