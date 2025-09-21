import React, { useEffect, useRef } from "react";
import Globe from "globe.gl";
import { MeshLambertMaterial, DoubleSide } from "three";
import * as topojson from "topojson-client";
import { getPoints } from "../../utils/pointsData";

const pointsData = getPoints();


export default function GlobeViz({newpoint}) {
  const globeRef = useRef(null);

  

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
    controls.minDistance = 240; // closest zoom-in (smaller = closer)
    controls.maxDistance = 100; // farthest zoom-out (larger = farther)


    // Load world map data
    fetch("//cdn.jsdelivr.net/npm/world-atlas/land-110m.json")
      .then((res) => res.json())
      .then((landTopo) => {
        world
          .polygonsData(topojson.feature(landTopo, landTopo.objects.land).features)
          .polygonCapMaterial(
            new MeshLambertMaterial({ color: "rgba(57, 58, 63 )", side: DoubleSide })
          )
          .polygonSideColor(() => "lightgray")
      });

      world
      .pointsData(pointsData)
      .pointLat("lat")
      .pointLng("lng")
      .pointAltitude(0.013) // slight altitude
      .pointColor(() => "rgba(242, 46, 147, 1)")
      .pointRadius("size");
      
  }, [newpoint]);

  return <div className="overflow-hidden" ref={globeRef} style={{ width: "100%", height: "80vh" }} />;
}
