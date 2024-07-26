// mapHelpers.js
export const smoothZoom = (map, targetZoom, setOpenLocation, key) => {
  const currentZoom = map.getZoom();

  console.log("key length: " + key);

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
