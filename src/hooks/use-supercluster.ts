import { FeatureCollection, GeoJsonProperties, Point } from "geojson";
// @ts-ignore
import Supercluster, { ClusterProperties } from "supercluster";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { useMapViewport } from "./use-map-viewport";

export function useSupercluster<T extends GeoJsonProperties>(
  geojson: FeatureCollection<Point, T>,
  superclusterOptions: Supercluster.Options<T, ClusterProperties>,
  disableRefresh?: boolean,
) {
  // create the clusterer and keep it
  const clusterer = useMemo(() => {
    return new Supercluster(superclusterOptions);
  }, [superclusterOptions]);

  // version-number for the data loaded into the clusterer
  // (this is needed to trigger updating the clusters when data was changed)
  const [version, dataWasUpdated] = useReducer((x: number) => x + 1, 0);

  // Ref to keep track of previous geojson data
  const prevGeojsonRef = useRef(geojson);

  // when data changes, load it into the clusterer
  useEffect(() => {
    if (!disableRefresh) {
      // Only load data if disableRefresh is false
      clusterer.load(geojson.features);
      dataWasUpdated();
    }
    // Store the current geojson data in the ref
    prevGeojsonRef.current = geojson;
  }, [clusterer, geojson, disableRefresh]);

  // get bounding-box and zoomlevel from the map
  const { bbox, zoom } = useMapViewport({ padding: 100 });

  // retrieve the clusters within the current viewport
  const clusters = useMemo(() => {
    if (!clusterer || version === 0 || disableRefresh) return [];
    return clusterer.getClusters(bbox, zoom);
  }, [version, clusterer, bbox, zoom, disableRefresh]);

  // create callbacks to expose supercluster functionality outside of this hook
  const getChildren = useCallback(
    (clusterId: number) => clusterer.getChildren(clusterId),
    [clusterer],
  );

  // note: here, the paging that would be possible is disabled; we found this
  // has no significant performance impact when it's just used in a click event handler.
  const getLeaves = useCallback(
    (clusterId: number) => clusterer.getLeaves(clusterId, Infinity),
    [clusterer],
  );

  const getClusterExpansionZoom = useCallback(
    (clusterId: number) => clusterer.getClusterExpansionZoom(clusterId),
    [clusterer],
  );

  return {
    clusters,
    getChildren,
    getLeaves,
    getClusterExpansionZoom,
  };
}
