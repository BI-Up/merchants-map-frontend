import * as React from "react";
import { ReactNode, useCallback, useMemo } from "react";
// @ts-ignore
import Supercluster, { ClusterProperties } from "supercluster";
import { Feature, FeatureCollection, Point, GeoJsonProperties } from "geojson";
import { useSupercluster } from "../use-supercluster";
import { MerchantsClusterMarker } from "./MerchantsCluster";
import { MerchantsMarkerPin } from "./MerchantsMarker";

const superclusterOptions: Supercluster.Options<
  GeoJsonProperties,
  ClusterProperties
> = {
  extent: 256,
  radius: 80,
  maxZoom: 15,
};

// Props for ClusteredMarkers
type ClusteredMarkersProps = {
  geojson: FeatureCollection<Point>;
  setInfoWindowData: (
    data: {
      anchor: google.maps.marker.AdvancedMarkerElement;
      features: Feature<Point>[];
    } | null,
  ) => void;
  children: ReactNode;
  isLoading: boolean;
};

const ClusteredMarkers = ({
  geojson,
  setInfoWindowData,
  children,
  isLoading,
}: ClusteredMarkersProps) => {
  const { clusters, getLeaves } = useSupercluster(
    geojson,
    superclusterOptions,
    isLoading,
  );

  // const handleClusterClick = useCallback(
  //   (marker: google.maps.marker.AdvancedMarkerElement, clusterId: number) => {
  //     const leaves = getLeaves(clusterId);
  //
  //     setInfoWindowData({ anchor: marker, features: leaves });
  //   },
  //   [getLeaves, setInfoWindowData],
  // );

  const handleMarkerClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, featureId: string) => {
      const feature = clusters.find(
        (feat) => feat.id === featureId,
      ) as Feature<Point>;
      setInfoWindowData({ anchor: marker, features: [feature] });
    },
    [clusters, setInfoWindowData],
  );

  const renderedMarkers = useMemo(
    () =>
      clusters.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates;
        const clusterProperties = feature.properties as ClusterProperties;
        const isCluster = clusterProperties.cluster;

        if (isCluster) {
          return (
            <MerchantsClusterMarker
              key={feature.id}
              clusterId={clusterProperties.cluster_id}
              position={{ lat, lng }}
              size={clusterProperties.point_count}
              sizeAsText={String(clusterProperties.point_count_abbreviated)}
              // onMarkerClick={handleClusterClick}
            />
          );
        }

        return (
          <React.Fragment key={feature.id}>
            <MerchantsMarkerPin
              featureId={feature.id as string}
              position={{ lat, lng }}
              onMarkerClick={handleMarkerClick}
            />
            {children}
          </React.Fragment>
        );
      }),
    [clusters, handleMarkerClick, children],
  );

  return <>{renderedMarkers}</>;
};

export default ClusteredMarkers;
