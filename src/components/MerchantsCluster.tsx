import * as React from "react";

import {
  AdvancedMarker,
  useAdvancedMarkerRef,
  useMap,
} from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import { ClusterCicle } from "./svg/cluster-cicle";

export const MerchantsClusterMarker = ({
  position,
  size,
  sizeAsText,
  onMarkerClick,
  clusterId,
}: any) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const map = useMap();

  const handleClick = useCallback(() => {
    const currentZoom = map.getZoom();
    if (currentZoom < 9) map.setZoom(9);
    map.setCenter(position);
    map.setZoom(map.getZoom() + 3);
  }, [map, position]);

  const markerSize = Math.floor(48 + Math.sqrt(size) * 2);
  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      zIndex={size}
      onClick={handleClick}
      className={"marker cluster"}
      style={{ width: markerSize, height: markerSize }}
    >
      <ClusterCicle text={sizeAsText} />
    </AdvancedMarker>
  );
};
