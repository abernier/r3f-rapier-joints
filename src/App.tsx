import styled from "@emotion/styled";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Physics, Debug, RigidBody } from "@react-three/rapier";

import Layout from "./Layout";
import Cube from "./components/Cube";
import Ball from "./components/Ball";

import HangingThing from "./components/HangingThing";
import { Rope } from "./components/Rope";

function App() {
  return (
    <Styled>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["KeyW"] },
          { name: "backward", keys: ["KeyS"] },
          { name: "leftward", keys: ["KeyA"] },
          { name: "rightward", keys: ["KeyD"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <Canvas shadows>
          <Physics
            gravity={[0, -60, 0]}
            // timeStep={1 / 60}
            //
          >
            <Debug />

            <Layout />

            {/* 🧊 cube */}
            {/* <Cube position-y={1} /> */}

            {/* 🏀 ball */}
            <Ball />

            <Rope
              length={5}
              position={[1, 0.5, 0]}
              // rotation-z={-Math.PI / 2}
            />
            <HangingThing l={4} position={[4, 5, 1]} />

            {/* Ground */}
            <RigidBody
              type="fixed"
              position-y={-0.1 / 2}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <mesh receiveShadow>
                <boxGeometry args={[100, 100, 0.1]} />
                <meshStandardMaterial color="gray" transparent opacity={0.8} />
              </mesh>
            </RigidBody>
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

export default App;
