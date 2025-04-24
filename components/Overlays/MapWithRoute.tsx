import { useEffect, useRef } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

const tomtomApiKey = "ie4Bbk6muzUdyb5YhAC7rvOOjKeQIUyC"; // Replace with your real API key

export default function MapWithRoute({ from, to }) {
  const mapRef = useRef(null);
  const mapElement = useRef(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!from || !to) return;

      // Convert addresses to coordinates
      const getCoords = async (query) => {
        const res = await fetch(
          `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(query)}.json?key=${tomtomApiKey}`
        );
        const data = await res.json();
        return data.results[0]?.position;
      };

      const [fromCoords, toCoords] = await Promise.all([getCoords(from), getCoords(to)]);

      if (!fromCoords || !toCoords) return;

      const map = tt.map({
        key: tomtomApiKey,
        container: mapElement.current,
        center: [fromCoords.lon, fromCoords.lat],
        zoom: 12,
      });
      mapRef.current = map;

      // Draw markers
      new tt.Marker().setLngLat([fromCoords.lon, fromCoords.lat]).addTo(map);
      new tt.Marker().setLngLat([toCoords.lon, toCoords.lat]).addTo(map);

      // Draw line
      const routeGeoJson = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [fromCoords.lon, fromCoords.lat],
            [toCoords.lon, toCoords.lat],
          ],
        },
      };

      map.on("load", () => {
        map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: routeGeoJson,
          },
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
