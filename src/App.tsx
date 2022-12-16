import { useRef } from "react";

import styled from "@emotion/styled";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";

import Layout from "./Layout";
import Ground from "./components/Ground";
import Cube from "./components/Cube";
import Ball from "./components/Ball";
import HangingThing from "./components/HangingThing";
import { Rope } from "./components/Rope";

import usePivot from "./components/usePivot";

import type { RigidBodyApi } from "@react-three/rapier";

const map = [
  { name: "forward", keys: ["KeyW"] },
  { name: "backward", keys: ["KeyS"] },
  { name: "leftward", keys: ["KeyA"] },
  { name: "rightward", keys: ["KeyD"] },
  { name: "jump", keys: ["Space"] },
];

function App() {
  return (
    <Styled>
      <KeyboardControls map={map}>
        <Canvas shadows>
          <Physics>
            <Layout />

            <Scene />
            <Debug />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </Styled>
  );
}
export const Styled = styled.div`
  position: fixed;
  inset: 0;
`;

function Scene() {
  const cubeRef = useRef<RigidBodyApi>(null);
  const pivotCubeRef = useRef(null);

  usePivot(cubeRef, pivotCubeRef);

  return (
    <>
      {/* 🧊 cube */}
      {/* <group position={[-2, 1, 0]}>
        <Cube ref={cubeRef} />
        <PivotControls ref={pivotCubeRef} scale={4} />
      </group> */}

      <Rope length={5} position={[0, 1, 0]} />

      {/* <Ball /> */}

      {/* <HangingThing l={4} position={[4, 5, 1]} /> */}

      <Ground />
    </>
  );
}

export default App;
