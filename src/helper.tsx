import { FeatureCollection, Point, GeoJsonProperties } from "geojson";
// Convert the data to GeoJSON
export function convertToGeoJSON(
  data: any[],
): FeatureCollection<Point, GeoJsonProperties> {
  return {
    type: "FeatureCollection",
    features: data.map((item) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [parseFloat(item.longitude), parseFloat(item.latitude)],
      },
      properties: {
        // id: item._id.$oid,
        vat_name_gr: item.vat_name_gr,
        vat_name_en: item.vat_name_en,
        brand_name_gr: item.brand_name_gr,
        brand_name_en: item.brand_name_en,
        address_gr: item.address_gr,
        address_en: item.address_en,
        zip_code: item.zip_code,
        district_gr: item.district_gr,
        district_en: item.district_en,
        region_gr: item.region_gr,
        region_en: item.region_en,
        town_gr: item.town_gr,
        town_en: item.town_en,
        is_hero_corp: item.is_hero_corp,
        accepted_products: item.accepted_products,
        mcc_category_gr: item.mcc_category_gr,
        mcc_category_en: item.mcc_category_en,
      },
    })),
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
