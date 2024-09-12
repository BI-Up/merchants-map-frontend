import { FeatureCollection, Point, GeoJsonProperties } from "geojson";

export function convertPointsToGeoJSON(
  data: any[],
): FeatureCollection<Point, GeoJsonProperties> {
  return {
    type: "FeatureCollection",
    features: data.map((item) => {
      const baseProperties = {
        id: item.i,
      };

      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [parseFloat(item.t), parseFloat(item.l)],
        },
        properties: baseProperties,
      };
    }),
  };
}

export function convertMarkerToGeoJSON(
  data: any,
): FeatureCollection<Point, GeoJsonProperties> {
  console.log("data", data);
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
        },
        properties: {
          vat_name_gr: data.vat_name_gr,
          vat_name_en: data.vat_name_en,
          brand_name_gr: data.brand_name_gr,
          brand_name_en: data.brand_name_en,
          address_gr: data.address_gr,
          address_en: data.address_en,
          zip_code: data.zip_code,
          district_gr: data.district_gr,
          district_en: data.district_en,
          region_gr: data.region_gr,
          region_en: data.region_en,
          town_gr: data.town_gr,
          town_en: data.town_en,
          is_hero_corp: data.is_hero_corp,
          accepted_products: data.accepted_products,
          mcc_category_gr: data.mcc_category_gr,
          mcc_category_en: data.mcc_category_en,
        },
      },
    ],
  };
}

// Helper function to check if coordinates match
export const checkCoordinates = (
  geojsonItem: any,
  merchantLat: number,
  merchantLng: number,
  tolerance: number = 1e-6,
): boolean => {
  // Ensure the feature has geometry and coordinates
  if (
    !geojsonItem ||
    !geojsonItem.geometry ||
    !geojsonItem.geometry.coordinates
  ) {
    return false;
  }

  const geojsonLat = Number(geojsonItem.geometry.coordinates[1]);
  const geojsonLng = Number(geojsonItem.geometry.coordinates[0]);

  // Use a tolerance for floating-point comparisons
  return (
    Math.abs(geojsonLat - merchantLat) < tolerance &&
    Math.abs(geojsonLng - merchantLng) < tolerance
  );
};

export const smoothZoom = (map, targetZoom, setOpenLocation, key) => {
  const currentZoom = map.getZoom();

  const zoomIn = () => {
    if (map.getZoom() < targetZoom) {
      map.setZoom(map.getZoom() + 1);
      setTimeout(zoomIn, 100);
    } else {
      setOpenLocation(key);
    }
  };

  const zoomOut = () => {
    if (map.getZoom() > targetZoom) {
      map.setZoom(map.getZoom() - 1);
      setTimeout(zoomOut, 100);
    } else {
      setOpenLocation(key);
    }
  };

  if (currentZoom < targetZoom) {
    zoomIn();
  } else if (currentZoom > targetZoom) {
    zoomOut();
  } else {
    setOpenLocation(key);
  }
};
