import * as React from "react";
import {
  AdvancedMarker,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import { ClusterCicle } from "./cluster-cicle";

export const MerchantsClusterMarker = ({
  position,
  size,
  sizeAsText,
  onMarkerClick,
  clusterId,
}: any) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, clusterId),
    [onMarkerClick, marker, clusterId],
  );
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
      <ClusterCicle />
      <span>{sizeAsText}</span>
    </AdvancedMarker>
  );
};
