import React, { useEffect, useRef, useState } from "react";
import Globe from "globe.gl";
import { MeshLambertMaterial, DoubleSide } from "three";
import * as topojson from "topojson-client";
import { geoContains } from "d3-geo"; // point-in-polygon
import { getPoints } from "../../utils/pointsData";

const pointsData = getPoints();

export default function GlobeViz({ newpoint }) {
  const globeRef = useRef(null);
  const [landFeatureCollection, setLandFeatureCollection] = useState(null);

  useEffect(() => {
    if (!globeRef.current) return;

    // Initialize globe
    const world = Globe()(globeRef.current)
      .backgroundColor("rgba(0,0,0,0)")
      .showGlobe(false)
      .showAtmosphere(false);

    const controls = world.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;
    controls.minDistance = 240;
    controls.maxDistance = 100;

    // Load world map data
    fetch("//cdn.jsdelivr.net/npm/world-atlas/land-110m.json")
      .then((res) => res.json())
      .then((landTopo) => {
        const features = topojson.feature(landTopo, landTopo.objects.land);
        setLandFeatureCollection(features);

        world
          .polygonsData(features.features)
          .polygonCapMaterial(
            new MeshLambertMaterial({ color: "rgba(57, 58, 63)", side: DoubleSide })
          )
          .polygonSideColor(() => "lightgray");
      });

    // Add points
    world
      .pointsData(pointsData)
      .pointLat("lat")
      .pointLng("lng")
      .pointAltitude(0.013)
      .pointColor(() => "yellow")
      .pointRadius("size");

    // Right-click handler
    world.onGlobeClick((coords) => {
  if (landFeatureCollection && !geoContains(landFeatureCollection, [coords.lng, coords.lat])) {
    console.log("✅ Land click:", coords.lat, coords.lng);
  } else {
    console.log("🌊 Clicked on ocean, ignoring...");
  }
});

  }, [newpoint]);

  return (
    <div
      className="overflow-hidden"
      ref={globeRef}
      style={{ width: "100%", height: "80vh" }}
    />
  );
}