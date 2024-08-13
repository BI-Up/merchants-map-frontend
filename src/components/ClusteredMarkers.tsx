import * as React from "react";
import { useCallback, useEffect } from "react";
// @ts-ignore
import Supercluster, { ClusterProperties } from "supercluster";
import { Feature, FeatureCollection, Point, GeoJsonProperties } from "geojson";
import { useSupercluster } from "../use-supercluster";
import { MerchantsClusterMarker } from "./MerchantsCluster";
import { MerchantsMarker } from "./svg/marker-pin";
import { MerchantsMarkerPin } from "./MerchantsMarker";
import { InfoWindow, useMap } from "@vis.gl/react-google-maps";
import InfoWindowContent from "./InfoWindowContent";

const superclusterOptions: Supercluster.Options<
  GeoJsonProperties,
  ClusterProperties
> = {
  extent: 256,
  radius: 80,
  maxZoom: 12,
};

// Props for ClusteredMarkers
type ClusteredMarkersProps = {
  geojson: FeatureCollection<Point>;
  setNumClusters: (n: number) => void;
  setInfowindowData: (
    data: {
      anchor: google.maps.marker.AdvancedMarkerElement;
      features: Feature<Point>[];
    } | null,
  ) => void;
};

const ClusteredMarkers = ({
  geojson,
  setNumClusters,
  setInfoWindowData,
  children,
}) => {
  const { clusters, getLeaves } = useSupercluster(geojson, superclusterOptions);

  const map = useMap();

  console.log("clusters", clusters);

  useEffect(() => {
    setNumClusters(clusters.length);
  }, [setNumClusters, clusters.length]);

  const handleClusterClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, clusterId: number) => {
      const leaves = getLeaves(clusterId);

      setInfoWindowData({ anchor: marker, features: leaves });
    },
    [getLeaves, setInfoWindowData],
  );

  const handleMarkerClick = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement, featureId: string) => {
      const feature = clusters.find(
        (feat) => feat.id === featureId,
      ) as Feature<Point>;

      setInfoWindowData({ anchor: marker, features: [feature] });
    },
    [clusters, setInfoWindowData],
  );

  return (
    <>
      {clusters.map((feature) => {
        const [lng, lat] = feature.geometry.coordinates;

        const clusterProperties = feature.properties as ClusterProperties;
        const isCluster: boolean = clusterProperties.cluster;

        return isCluster ? (
          <MerchantsClusterMarker
            key={feature.id}
            clusterId={clusterProperties.cluster_id}
            position={{ lat, lng }}
            size={clusterProperties.point_count}
            sizeAsText={String(clusterProperties.point_count_abbreviated)}
            // onMarkerClick={handleClusterClick}
          />
        ) : (
          <>
            <MerchantsMarkerPin
              key={feature.id}
              featureId={feature.id as string}
              position={{ lat, lng }}
              onMarkerClick={handleMarkerClick}
            />

            {children ?? <> </>}
            {/*{hasInfoWindowData && (*/}
            {/*  <InfoWindow onCloseClick={closeInfoWindowData} anchor={anchor}>*/}
            {/*    <InfoWindowContent*/}
            {/*      info={hasInfoWindowData?.features.properties}*/}
            {/*      language={language}*/}
            {/*    />*/}
            {/*  </InfoWindow>*/}
            {/*)}*/}
          </>
        );
      })}
    </>
  );
};

export default ClusteredMarkers;
