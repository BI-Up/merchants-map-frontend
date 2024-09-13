import * as React from "react";
import { ReactNode, useCallback, useMemo } from "react";
// @ts-ignore
import Supercluster, { ClusterProperties } from "supercluster";
import { Feature, FeatureCollection, Point, GeoJsonProperties } from "geojson";
import { useSupercluster } from "../hooks/use-supercluster";
import { MerchantsClusterMarker } from "./MerchantsCluster";
import { MerchantsMarkerPin } from "./MerchantsMarker";
import { convertMarkerToGeoJSON } from "../helper";
import { merchantsResponse } from "../type";

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
  fetchMarkerInfo: ({ id }) => Promise<merchantsResponse>;
};

const ClusteredMarkers = ({
  geojson,
  setInfoWindowData,
  children,
  isLoading,
  fetchMarkerInfo,
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
    async (
      marker: google.maps.marker.AdvancedMarkerElement,
      featureId: string,
    ) => {
      const feature = clusters.find(
        (feat) => feat.properties.id === featureId,
      ) as Feature<Point>;

      if (feature) {
        try {
          const markerInfo = await fetchMarkerInfo({
            id: feature.properties.id as number, // You're passing an object instead of a number here
          });

          const convertedMarkerInfo = convertMarkerToGeoJSON(markerInfo[0]);

          setInfoWindowData({
            anchor: marker,
            features: [convertedMarkerInfo.features[0]],
          });
        } catch (error) {
          console.error("Error fetching marker info:", error);
        }
      }
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
          <React.Fragment key={feature.properties.id}>
            <MerchantsMarkerPin
              featureId={feature.properties.id as string}
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
