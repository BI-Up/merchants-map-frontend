import * as React from "react";

import {
  AdvancedMarker,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useCallback } from "react";
import { MerchantsMarker } from "./svg/marker-pin";

export const MerchantsMarkerPin = ({
  position,
  featureId,
  onMarkerClick,
}: any) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const handleClick = useCallback(
    () => onMarkerClick && onMarkerClick(marker!, featureId),
    [onMarkerClick, marker, featureId],
  );

  return (
    <AdvancedMarker
      ref={markerRef}
      position={position}
      onClick={handleClick}
      className={"marker feature"}
    >
      <MerchantsMarker />
    </AdvancedMarker>
  );
};
